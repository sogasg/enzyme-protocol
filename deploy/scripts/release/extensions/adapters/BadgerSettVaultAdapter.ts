import { BadgerSettVaultAdapterArgs } from '@enzymefinance/protocol';
import { DeployFunction } from 'hardhat-deploy/types';

const fn: DeployFunction = async function (hre) {
  const {
    deployments: { deploy, get },
    ethers: { getSigners },
  } = hre;

  const deployer = (await getSigners())[0];
  const integrationManager = await get('IntegrationManager');
  const badgerSettVaultPriceFeed = await get('BadgerSettVaultPriceFeed');

  await deploy('BadgerSettVaultAdapter', {
    args: [integrationManager.address, badgerSettVaultPriceFeed.address] as BadgerSettVaultAdapterArgs,
    from: deployer.address,
    linkedData: {
      type: 'ADAPTER',
    },
    log: true,
    skipIfAlreadyDeployed: true,
  });
  console.log('deployed BadgerSettVaultAdapter');
};

fn.tags = ['Release', 'Adapters', 'BadgerSettVaultAdapter'];
fn.dependencies = ['IntegrationManager', 'BadgerSettVaultPriceFeed'];

export default fn;
