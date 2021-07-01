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
    expect(await badgerSettVaultPriceFeed.isSupportedAsset(fork.deployment.wrappedBadgerSettVault.address)).toBe(true);
  });
});
