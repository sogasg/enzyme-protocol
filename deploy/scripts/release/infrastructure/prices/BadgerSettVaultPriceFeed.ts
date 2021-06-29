import { BadgerSettVaultPriceFeed, BadgerSettVaultPriceFeedArgs, IBadgerSettVault } from '@enzymefinance/protocol';
import { DeployFunction } from 'hardhat-deploy/types';

import { loadConfig } from '../../../../utils/config';

const fn: DeployFunction = async function (hre) {
  const {
    deployments: { deploy, get, log },
    ethers: { getSigners },
  } = hre;

  const deployer = (await getSigners())[0];
  const config = await loadConfig(hre);
  const fundDeployer = await get('FundDeployer');

  const badgerSettVaultPriceFeed = await deploy('BadgerSettVaultPriceFeed', {
    args: [fundDeployer.address, config.badger.controller] as BadgerSettVaultPriceFeedArgs,
    from: deployer.address,
    log: true,
    skipIfAlreadyDeployed: true,
  });

  if (badgerSettVaultPriceFeed.newlyDeployed) {
    const badgerSettVaultPriceFeedInstance = new BadgerSettVaultPriceFeed(badgerSettVaultPriceFeed.address, deployer);
    const badgerSettVaults = Object.values(config.badger.settVaults);
    const underlyings = await Promise.all(
      badgerSettVaults.map((badgerSettVaultAddress) => {
        const badgerSettVault = new IBadgerSettVault(badgerSettVaultAddress, deployer);
        return badgerSettVault.token();
      }),
    );

    if (!!badgerSettVaults.length) {
      log('Registering Badger Sett Vault tokens');
      await badgerSettVaultPriceFeedInstance.addDerivatives(badgerSettVaults, underlyings);
    }
  }
};

fn.tags = ['Release', 'BadgerSettVaultPriceFeed'];
fn.dependencies = ['Config', 'FundDeployer'];

export default fn;
