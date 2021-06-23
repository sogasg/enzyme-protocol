import { deployProtocolFixture, ProtocolDeployment } from '@enzymefinance/testutils';
import { IBadgerSettVault } from '../../../../../packages/protocol/src';

let fork: ProtocolDeployment;
beforeEach(async () => {
  fork = await deployProtocolFixture();
});

describe('constructor', () => {
  it('sets state vars', async () => {
    const badgerSettVaultAdapter = fork.deployment.badgerSettVaultAdapter;

    // AdapterBase
    expect(await badgerSettVaultAdapter.getIntegrationManager()).toMatchAddress(fork.deployment.integrationManager);

    expect(await badgerSettVaultAdapter.identifier()).toMatch('BADGER_SETT_VAULT');
  });
});

describe('lend', () => {
  it('generates expected output', async () => {
    // const badgerSettVaultAdapter = fork.deployment.badgerSettVaultAdapter;

    const bBadgerSettVault = new IBadgerSettVault(fork.config.badger.settVaults.bBADGER, provider);
    // check that things are set up correctly
    expect(await bBadgerSettVault.token()).toMatchAddress(fork.config.badger.badgerToken);
  });
});
