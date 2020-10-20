import { describeDeployment } from '@melonproject/utils';
import { Signer } from 'ethers';
import { Dispatcher } from './contracts';

export interface PersistentDeploymentConfig {
  deployer: Signer;
}

export interface PersistentDeploymentOutput {
  dispatcher: Promise<Dispatcher>;
}

export const deployPersistent = describeDeployment<
  PersistentDeploymentConfig,
  PersistentDeploymentOutput
>({
  dispatcher(config) {
    return Dispatcher.deploy(config.deployer);
  },
});