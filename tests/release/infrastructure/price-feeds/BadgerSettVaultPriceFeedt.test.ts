import { IBadgerSettVault } from '@enzymefinance/protocol';
import { deployProtocolFixture, ProtocolDeployment } from '@enzymefinance/testutils';

let fork: ProtocolDeployment;
beforeEach(async () => {
  fork = await deployProtocolFixture();
});

describe('constructor', () => {
  it('sets state vars', async () => {
    const badgerSettVaultPriceFeed = fork.deployment.badgerSettVaultPriceFeed;

    expect(await badgerSettVaultPriceFeed.getBadgerSettVaultController()).toMatchAddress(fork.config.badger.controller);

    // Assert each derivative is properly registered
    for (const badgerSettVaultAddress of Object.values(fork.config.badger.settVaults)) {
      const badgerSettVault = new IBadgerSettVault(badgerSettVaultAddress, provider);
      expect(await badgerSettVaultPriceFeed.isSupportedAsset(badgerSettVault)).toBe(true);
    }
  });
});
