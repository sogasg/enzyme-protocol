import { AddressLike } from '@enzymefinance/ethers';
import { BigNumberish } from 'ethers';
import { encodeArgs } from '../encoding';

export function badgerSettVaultLendArgs({
  wrappedBadgerSettVault,
  outgoingUnderlyingAmount,
  minIncomingBadgerSettVaultSharesAmount,
}: {
  wrappedBadgerSettVault: AddressLike;
  outgoingUnderlyingAmount: BigNumberish;
  minIncomingBadgerSettVaultSharesAmount: BigNumberish;
}) {
  return encodeArgs(
    ['address', 'uint256', 'uint256'],
    [wrappedBadgerSettVault, outgoingUnderlyingAmount, minIncomingBadgerSettVaultSharesAmount],
  );
}

export function badgerSettVaultRedeemArgs({
  wrappedBadgerSettVault,
  outgoingBadgerSettVaultSharesAmount,
  minIncomingUnderlyingAmount,
}: {
  wrappedBadgerSettVault: AddressLike;
  outgoingBadgerSettVaultSharesAmount: BigNumberish;
  minIncomingUnderlyingAmount: BigNumberish;
}) {
  return encodeArgs(
    ['address', 'uint256', 'uint256'],
    [wrappedBadgerSettVault, outgoingBadgerSettVaultSharesAmount, minIncomingUnderlyingAmount],
  );
}
