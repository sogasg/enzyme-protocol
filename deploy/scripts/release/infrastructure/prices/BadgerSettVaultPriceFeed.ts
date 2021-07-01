import {
  BadgerSettVaultPriceFeedArgs,
} from '@enzymefinance/protocol';
import { DeployFunction } from 'hardhat-deploy/types';

import { loadConfig } from '../../../../utils/config';

const fn: DeployFunction = async function (hre) {
  const {
    deployments: { deploy, get },
    ethers: { getSigners },
  } = hre;

  const deployer = (await getSigners())[0];
  const config = await loadConfig(hre);
  const fundDeployer = await get('FundDeployer');

  await deploy('BadgerSettVaultPriceFeed', {
    args: [fundDeployer.address, config.badger.controller] as BadgerSettVaultPriceFeedArgs,
    from: deployer.address,
    log: true,
    skipIfAlreadyDeployed: true,
  });

};

fn.tags = ['Release', 'BadgerSettVaultPriceFeed'];
fn.dependencies = ['Config', 'FundDeployer'];

export default fn;
