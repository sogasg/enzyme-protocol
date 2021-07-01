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
            wrappedBadgerSettVault: randomAddress(),
            outgoingUnderlyingAmount: BigNumber.from(1),
            minIncomingBadgerSettVaultSharesAmount: BigNumber.from(1),
          }),
        ),
      ).rejects.toBeReverted();
    });

    it('generates expected output', async () => {
      const badgerSettVaultAdapter = fork.deployment.badgerSettVaultAdapter;

      const wrappedBadgerSettVault = new IBadgerSettVault(fork.config.badger.settVaults.bBADGER, provider);
      const outgoingUnderlyingAmount = utils.parseEther('2');
      const minIncomingBadgerSettVaultSharesAmount = utils.parseEther('3');

      const result = await badgerSettVaultAdapter.parseAssetsForMethod(
        lendSelector,
        badgerSettVaultLendArgs({
          wrappedBadgerSettVault,
          outgoingUnderlyingAmount,
          minIncomingBadgerSettVaultSharesAmount,
        }),
      );

      expect(result).toMatchFunctionOutput(badgerSettVaultAdapter.parseAssetsForMethod, {
        spendAssetsHandleType_: SpendAssetsHandleType.Transfer,
        spendAssets_: [await wrappedBadgerSettVault.token()],
        spendAssetAmounts_: [outgoingUnderlyingAmount],
        incomingAssets_: [wrappedBadgerSettVault],
        minIncomingAssetAmounts_: [minIncomingBadgerSettVaultSharesAmount],
      });
    });
  });
});

describe('redeem', () => {
  it('does not allow an invalid vault address', async () => {
    await expect(
      fork.deployment.badgerSettVaultAdapter.parseAssetsForMethod(
        redeemSelector,
        badgerSettVaultRedeemArgs({
          wrappedBadgerSettVault: randomAddress(),
          outgoingBadgerSettVaultSharesAmount: BigNumber.from(1),
          minIncomingUnderlyingAmount: BigNumber.from(1),
        }),
      ),
    ).rejects.toBeReverted();
  });

  it('generates expected output', async () => {
    const badgerSettVaultAdapter = fork.deployment.badgerSettVaultAdapter;

    // const wrappedBadgerSettVault = new IBadgerSettVault(fork.config.badger.settVaults.bBADGER, provider);
    const wrappedBadgerSettVault = fork.deployment.wrappedBadgerSettVault;
    const outgoingBadgerSettVaultSharesAmount = utils.parseEther('2');
    const minIncomingUnderlyingAmount = utils.parseEther('3');

    const result = await badgerSettVaultAdapter.parseAssetsForMethod(
      redeemSelector,
      badgerSettVaultRedeemArgs({
        wrappedBadgerSettVault,
        outgoingBadgerSettVaultSharesAmount,
        minIncomingUnderlyingAmount,
      }),
    );

    expect(result).toMatchFunctionOutput(badgerSettVaultAdapter.parseAssetsForMethod, {
      spendAssetsHandleType_: SpendAssetsHandleType.Transfer,
      spendAssets_: [wrappedBadgerSettVault],
      spendAssetAmounts_: [outgoingBadgerSettVaultSharesAmount],
      incomingAssets_: [await wrappedBadgerSettVault.token()],
      minIncomingAssetAmounts_: [minIncomingUnderlyingAmount],
    });
  });
});

describe('lend', () => {
  it('works as expected when called for lending by a fund', async () => {
    const badgerSettVaultAdapter = fork.deployment.badgerSettVaultAdapter;
    const [fundOwner] = fork.accounts;
    const wrappedBadgerSettVault = fork.deployment.wrappedBadgerSettVault;
    const badger = new StandardToken(fork.config.badger.badgerToken, whales.badger);
    const outgoingToken = badger;
    const assetUnit = utils.parseUnits('1', await badger.decimals());

    const { comptrollerProxy, vaultProxy } = await createNewFund({
      signer: fundOwner,
      fundOwner,
      fundDeployer: fork.deployment.fundDeployer,
      denominationAsset: badger,
    });

    const outgoingUnderlyingAmount = assetUnit;
    await outgoingToken.transfer(vaultProxy, outgoingUnderlyingAmount.mul(3));

    const [preTxBadgerSettVaultBalance, preTxUnderlyingBalance] = await getAssetBalances({
      account: vaultProxy,
      assets: [wrappedBadgerSettVault, outgoingToken],
    });
    expect(preTxBadgerSettVaultBalance).toEqBigNumber(0);
    expect(preTxUnderlyingBalance).toEqBigNumber(outgoingUnderlyingAmount.mul(3));

    await badgerSettVaultLend({
      signer: fundOwner,
      comptrollerProxy,
      integrationManager: fork.deployment.integrationManager,
      badgerSettVaultAdapter,
      wrappedBadgerSettVault,
      outgoingUnderlyingAmount,
    });

    const [postTxBadgerSettVaultVaultBalance, postTxUnderlyingBalance] = await getAssetBalances({
      account: vaultProxy,
      assets: [wrappedBadgerSettVault, outgoingToken],
    });

    expect(postTxBadgerSettVaultVaultBalance).toBeGtBigNumber(0);
    expect(postTxUnderlyingBalance).toEqBigNumber(preTxUnderlyingBalance.sub(outgoingUnderlyingAmount));
  });
});

describe('redeem', () => {
  it('works as expected when called for redeem by a fund', async () => {
    const badgerSettVaultAdapter = fork.deployment.badgerSettVaultAdapter;
    const [fundOwner] = fork.accounts;
    const wrappedBadgerSettVault = fork.deployment.wrappedBadgerSettVault;
    const badger = new StandardToken(fork.config.badger.badgerToken, whales.badger);
    const outgoingToken = badger;
    const assetUnit = utils.parseUnits('1', await badger.decimals());

    const { comptrollerProxy, vaultProxy } = await createNewFund({
      signer: fundOwner,
      fundOwner,
      fundDeployer: fork.deployment.fundDeployer,
      denominationAsset: badger,
    });

    const outgoingUnderlyingAmount = assetUnit;
    await outgoingToken.transfer(vaultProxy, outgoingUnderlyingAmount.mul(3));

    const [preLendTxBadgerSettVaultBalance, preLendTxUnderlyingBalance] = await getAssetBalances({
      account: vaultProxy,
      assets: [wrappedBadgerSettVault, outgoingToken],
    });
    expect(preLendTxBadgerSettVaultBalance).toEqBigNumber(0);
    expect(preLendTxUnderlyingBalance).toEqBigNumber(outgoingUnderlyingAmount.mul(3));

    await badgerSettVaultLend({
      signer: fundOwner,
      comptrollerProxy,
      integrationManager: fork.deployment.integrationManager,
      badgerSettVaultAdapter,
      wrappedBadgerSettVault,
      outgoingUnderlyingAmount,
    });

    const [postLendTxBadgerSettVaultBalance, postLendTxUnderlyingBalance] = await getAssetBalances({
      account: vaultProxy,
      assets: [wrappedBadgerSettVault, outgoingToken],
    });

    expect(postLendTxBadgerSettVaultBalance).toBeGtBigNumber(0);
    expect(postLendTxUnderlyingBalance).toEqBigNumber(preLendTxUnderlyingBalance.sub(outgoingUnderlyingAmount));

    await badgerSettVaultRedeem({
      signer: fundOwner,
      comptrollerProxy,
      integrationManager: fork.deployment.integrationManager,
      badgerSettVaultAdapter,
      wrappedBadgerSettVault,
      outgoingBadgerSettVaultSharesAmount: postLendTxBadgerSettVaultBalance,
    });

    const [postRedeemTxBadgerSettVaultBalance, postRedeemTxUnderlyingBalance] = await getAssetBalances({
      account: vaultProxy,
      assets: [wrappedBadgerSettVault, outgoingToken],
    });

    expect(postRedeemTxBadgerSettVaultBalance).toEqBigNumber(0);
    expect(postRedeemTxUnderlyingBalance).toBeGtBigNumber(postLendTxUnderlyingBalance.add(1));

    expect(wrappedBadgerSettVault.withdraw).toHaveBeenCalledOnContractWith(postLendTxBadgerSettVaultBalance);
  });
});
