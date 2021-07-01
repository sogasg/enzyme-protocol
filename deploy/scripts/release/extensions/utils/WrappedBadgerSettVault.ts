import {
  WrappedBadgerSettVaultArgs,
  IBadgerSettVault,
  BadgerSettVaultPriceFeed,
  IWrappedBadgerSettVault,
  AggregatedDerivativePriceFeed,
} from '@enzymefinance/protocol';
import { DeployFunction } from 'hardhat-deploy/types';

import { loadConfig } from '../../../../utils/config';

const fn: DeployFunction = async function (hre) {
  const {
    deployments: { deploy, get },
    ethers: { getSigners, getSigner },
  } = hre;

  const deployer = (await getSigners())[0];
  const config = await loadConfig(hre);
  const badgerSettVaultPriceFeed = await get('BadgerSettVaultPriceFeed');
  const aggregatedDerivativePriceFeed = await get('AggregatedDerivativePriceFeed');

  const wrappedBadgerSettVault = await deploy('WrappedBadgerSettVault', {
    args: [config.badger.settVaults.bBADGER, 'Wrapped bBADGER', 'wbBADGER'] as WrappedBadgerSettVaultArgs,
    from: deployer.address,
    log: true,
    skipIfAlreadyDeployed: true,
  });

  console.log('deployed wrappedBadgerSettVault');

  if (wrappedBadgerSettVault.newlyDeployed) {
    const badgerSettVaults = Object.values(config.badger.settVaults);
    const badgerSettVaultPriceFeedInstance = new BadgerSettVaultPriceFeed(badgerSettVaultPriceFeed.address, deployer);
    const wrappedBadgerSettVaultInstance = new IWrappedBadgerSettVault(wrappedBadgerSettVault.address, deployer);
    const aggregatedDerivativePriceFeedINSTANCE = new AggregatedDerivativePriceFeed(
      aggregatedDerivativePriceFeed.address,
      deployer,
    );
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
        await badgerSettVaultFromGovernance.approveContractAccess(wrappedBadgerSettVault.address);
        console.log(
          'The BaderSettVaultAdapter address is whitelisted in the Badger Sett Vault: ',
          badgerSettVaultAddress,
        );
        await hre.network.provider.request({
          method: 'hardhat_stopImpersonatingAccount',
          params: [governanceAddress],
        });
        console.log('Stop impersonating the Badger Sett Vault governance address');

        const underlying = await wrappedBadgerSettVaultInstance.token();
        await badgerSettVaultPriceFeedInstance.addDerivatives([wrappedBadgerSettVault.address], [underlying]);
        await aggregatedDerivativePriceFeedINSTANCE.addDerivatives(
          [wrappedBadgerSettVault.address],
          [badgerSettVaultPriceFeedInstance.address],
        );
      }),
    );
  }
};

fn.tags = ['Release', 'Adapters', 'WrappedBadgerSettVault'];
fn.dependencies = ['Config', 'IntegrationManager', 'BadgerSettVaultPriceFeed', 'AggregatedDerivativePriceFeed'];

export default fn;
