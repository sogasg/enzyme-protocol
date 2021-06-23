import { BadgerSettVaultAdapterArgs } from '@enzymefinance/protocol';
import { DeployFunction } from 'hardhat-deploy/types';

const fn: DeployFunction = async function (hre) {
  const {
    deployments: { deploy, get },
    ethers: { getSigners },
  } = hre;

  const deployer = (await getSigners())[0];
  const integrationManager = await get('IntegrationManager');

  await deploy('BadgerSettVaultAdapter', {
    args: [integrationManager.address] as BadgerSettVaultAdapterArgs,
    from: deployer.address,
    linkedData: {
      type: 'ADAPTER',
    },
    log: true,
    skipIfAlreadyDeployed: true,
  });
};

fn.tags = ['Release', 'Adapters', 'BadgerSettVaultAdapter'];
fn.dependencies = ['IntegrationManager'];

export default fn;
