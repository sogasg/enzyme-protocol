import { BadgerSettVaultAdapterArgs, IBadgerSettVault } from '@enzymefinance/protocol';
import { DeployFunction } from 'hardhat-deploy/types';

import { loadConfig } from '../../../../utils/config';

const fn: DeployFunction = async function (hre) {
  const {
    deployments: { deploy, get },
    ethers: { getSigners, getSigner },
  } = hre;

  const deployer = (await getSigners())[0];
  const integrationManager = await get('IntegrationManager');
  const badgerSettVaultPriceFeed = await get('BadgerSettVaultPriceFeed');
  const config = await loadConfig(hre);

  const badgerSettVaultAdapter = await deploy('BadgerSettVaultAdapter', {
    args: [integrationManager.address, badgerSettVaultPriceFeed.address] as BadgerSettVaultAdapterArgs,
    from: deployer.address,
    linkedData: {
      type: 'ADAPTER',
    },
    log: true,
    skipIfAlreadyDeployed: true,
  });

  if (badgerSettVaultAdapter.newlyDeployed) {
    const badgerSettVaults = Object.values(config.badger.settVaults);
    await Promise.all(
      badgerSettVaults.map(async (badgerSettVaultAddress) => {
        const badgerSettVault = new IBadgerSettVault(badgerSettVaultAddress, deployer);
        const governanceAddress = await badgerSettVault.governance();

        console.log('Start impersonating the Badger Sett Vault governance address: ', governanceAddress);
        await hre.network.provider.request({
          method: 'hardhat_impersonateAccount',
          params: [governanceAddress],
        });
        const governanceSigner = await getSigner(governanceAddress);
        const badgerSettVaultFromGovernance = new IBadgerSettVault(badgerSettVaultAddress, governanceSigner);
        await badgerSettVaultFromGovernance.approveContractAccess(badgerSettVaultAdapter.address);
        console.log(
          'The BaderSettVaultAdapter address is whitelisted in the Badger Sett Vault: ',
          badgerSettVaultAddress,
        );
        await hre.network.provider.request({
          method: 'hardhat_stopImpersonatingAccount',
          params: [governanceAddress],
        });
        console.log('Stop impersonating the Badger Sett Vault governance address');
      }),
    );
  }
};

fn.tags = ['Release', 'Adapters', 'BadgerSettVaultAdapter'];
fn.dependencies = ['Config', 'IntegrationManager', 'BadgerSettVaultPriceFeed'];

export default fn;
