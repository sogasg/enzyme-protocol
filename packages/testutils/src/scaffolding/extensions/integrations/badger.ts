import { SignerWithAddress } from '@enzymefinance/hardhat';
import {
  callOnIntegrationArgs,
  ComptrollerLib,
  IntegrationManager,
  IntegrationManagerActionId,
  lendSelector,
  redeemSelector,
  StandardToken,
  BadgerSettVaultAdapter,
  badgerSettVaultLendArgs,
  badgerSettVaultRedeemArgs,
} from '@enzymefinance/protocol';
import { BigNumber, BigNumberish } from 'ethers';

export async function badgerSettVaultLend({
  signer,
  comptrollerProxy,
  integrationManager,
  badgerSettVaultAdapter,
  badgerSettVault,
  outgoingUnderlyingAmount,
  minIncomingBadgerSettVaultSharesAmount = BigNumber.from(1),
}: {
  signer: SignerWithAddress;
  comptrollerProxy: ComptrollerLib;
  integrationManager: IntegrationManager;
  badgerSettVaultAdapter: BadgerSettVaultAdapter;
  badgerSettVault: StandardToken;
  outgoingUnderlyingAmount: BigNumberish;
  minIncomingBadgerSettVaultSharesAmount?: BigNumberish;
}) {
  const callArgs = callOnIntegrationArgs({
    adapter: badgerSettVaultAdapter,
    selector: lendSelector,
    encodedCallArgs: badgerSettVaultLendArgs({
      badgerSettVault,
      outgoingUnderlyingAmount,
      minIncomingBadgerSettVaultSharesAmount,
    }),
  });

  return comptrollerProxy
    .connect(signer)
    .callOnExtension(integrationManager, IntegrationManagerActionId.CallOnIntegration, callArgs);
}

export async function badgerSettVaultRedeem({
  signer,
  comptrollerProxy,
  integrationManager,
  badgerSettVaultAdapter,
  badgerSettVault,
  outgoingBadgerSettVaultSharesAmount,
  minIncomingUnderlyingAmount = BigNumber.from(1),
}: {
  signer: SignerWithAddress;
  comptrollerProxy: ComptrollerLib;
  integrationManager: IntegrationManager;
  badgerSettVaultAdapter: BadgerSettVaultAdapter;
  badgerSettVault: StandardToken;
  outgoingBadgerSettVaultSharesAmount: BigNumberish;
  minIncomingUnderlyingAmount?: BigNumberish;
}) {
  const callArgs = callOnIntegrationArgs({
    adapter: badgerSettVaultAdapter,
    selector: redeemSelector,
    encodedCallArgs: badgerSettVaultRedeemArgs({
      badgerSettVault,
      outgoingBadgerSettVaultSharesAmount,
      minIncomingUnderlyingAmount,
    }),
  });

  return comptrollerProxy
    .connect(signer)
    .callOnExtension(integrationManager, IntegrationManagerActionId.CallOnIntegration, callArgs);
}
