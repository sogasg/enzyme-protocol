import { BigNumber, constants, utils } from 'ethers';
import { randomAddress } from '@enzymefinance/ethers';
import {
  IBadgerSettVault,
  lendSelector,
  redeemSelector,
  SpendAssetsHandleType,
  StandardToken,
  badgerSettVaultLendArgs,
  badgerSettVaultRedeemArgs,
} from '@enzymefinance/protocol';
import {
  createNewFund,
  deployProtocolFixture,
  getAssetBalances,
  ProtocolDeployment,
  badgerSettVaultLend,
  badgerSettVaultRedeem,
} from '@enzymefinance/testutils';

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

describe('parseAssetsForMethod', () => {
  it('does not allow a bad selector', async () => {
    await expect(
      fork.deployment.badgerSettVaultAdapter.parseAssetsForMethod(utils.randomBytes(4), constants.HashZero),
    ).rejects.toBeRevertedWith('_selector invalid');
  });

  describe('lend', () => {
    it('does not allow an invalid vault address', async () => {
      await expect(
        fork.deployment.badgerSettVaultAdapter.parseAssetsForMethod(
          lendSelector,
          badgerSettVaultLendArgs({
            badgerSettVault: randomAddress(),
            outgoingUnderlyingAmount: BigNumber.from(1),
            minIncomingBadgerSettVaultSharesAmount: BigNumber.from(1),
          }),
        ),
      ).rejects.toBeReverted();
    });

    it('generates expected output', async () => {
      const badgerSettVaultAdapter = fork.deployment.badgerSettVaultAdapter;

      const badgerSettVault = new IBadgerSettVault(fork.config.badger.settVaults.bBADGER, provider);
      const outgoingUnderlyingAmount = utils.parseEther('2');
      const minIncomingBadgerSettVaultSharesAmount = utils.parseEther('3');

      const result = await badgerSettVaultAdapter.parseAssetsForMethod(
        lendSelector,
        badgerSettVaultLendArgs({
          badgerSettVault,
          outgoingUnderlyingAmount,
          minIncomingBadgerSettVaultSharesAmount,
        }),
      );

      expect(result).toMatchFunctionOutput(badgerSettVaultAdapter.parseAssetsForMethod, {
        spendAssetsHandleType_: SpendAssetsHandleType.Transfer,
        spendAssets_: [await badgerSettVault.token()],
        spendAssetAmounts_: [outgoingUnderlyingAmount],
        incomingAssets_: [badgerSettVault],
        minIncomingAssetAmounts_: [minIncomingBadgerSettVaultSharesAmount],
      });
    });
  });

  describe('redeem', () => {
    it('does not allow an invalid vault address', async () => {
      await expect(
        fork.deployment.badgerSettVaultAdapter.parseAssetsForMethod(
          redeemSelector,
          badgerSettVaultRedeemArgs({
            badgerSettVault: randomAddress(),
            outgoingBadgerSettVaultSharesAmount: BigNumber.from(1),
            minIncomingUnderlyingAmount: BigNumber.from(1),
          }),
        ),
      ).rejects.toBeReverted();
    });

    it('generates expected output', async () => {
      const badgerSettVaultAdapter = fork.deployment.badgerSettVaultAdapter;

      const badgerSettVault = new IBadgerSettVault(fork.config.badger.settVaults.bBADGER, provider);
      const outgoingBadgerSettVaultSharesAmount = utils.parseEther('2');
      const minIncomingUnderlyingAmount = utils.parseEther('3');

      const result = await badgerSettVaultAdapter.parseAssetsForMethod(
        redeemSelector,
        badgerSettVaultRedeemArgs({
          badgerSettVault,
          outgoingBadgerSettVaultSharesAmount,
          minIncomingUnderlyingAmount,
        }),
      );

      expect(result).toMatchFunctionOutput(badgerSettVaultAdapter.parseAssetsForMethod, {
        spendAssetsHandleType_: SpendAssetsHandleType.Transfer,
        spendAssets_: [badgerSettVault],
        spendAssetAmounts_: [outgoingBadgerSettVaultSharesAmount],
        incomingAssets_: [await badgerSettVault.token()],
        minIncomingAssetAmounts_: [minIncomingUnderlyingAmount],
      });
    });
  });

  describe('lend', () => {
    it('works as expected when called for lending by a fund', async () => {
      const badgerSettVaultAdapter = fork.deployment.badgerSettVaultAdapter;
      const [fundOwner] = fork.accounts;
      const badgerSettVault = new StandardToken(fork.config.badger.settVaults.bBADGER, provider);
      const badger = new StandardToken(fork.config.badger.badgerToken, whales.badger);
      const outgoingToken = badger;
      const assetUnit = utils.parseUnits('1', await badger.decimals());

      const { comptrollerProxy, vaultProxy } = await createNewFund({
        signer: fundOwner,
        fundOwner,
        fundDeployer: fork.deployment.fundDeployer,
        denominationAsset: badger,
      });

      // Seed the fund with more than the necessary amount of outgoing asset
      const outgoingUnderlyingAmount = assetUnit;
      await outgoingToken.transfer(vaultProxy, outgoingUnderlyingAmount.mul(3));

      // Since we can't easily test that an unused underlying amount from a deposit is returned
      /// to the vaultProxy, we seed the adapter with a small amount of the underlying, which will
      /// be returned to the vaultProxy upon running lend()
      const preTxAdapterUnderlyingBalance = assetUnit;
      await outgoingToken.transfer(badgerSettVaultAdapter, preTxAdapterUnderlyingBalance);

      const [preTxBadgerSettVaultBalance, preTxUnderlyingBalance] = await getAssetBalances({
        account: vaultProxy,
        assets: [badgerSettVault, outgoingToken],
      });
      expect(preTxBadgerSettVaultBalance).toEqBigNumber(0);

      // TODO: This fails due to the badger token not being supported
      // see: __isSupportedAsset in contracts/release/extensions/integration-manager/IntegrationManager.sol
      const lendReceipt = await badgerSettVaultLend({
        signer: fundOwner,
        comptrollerProxy,
        integrationManager: fork.deployment.integrationManager,
        badgerSettVaultAdapter,
        badgerSettVault,
        outgoingUnderlyingAmount,
      });
    });
  });
});
