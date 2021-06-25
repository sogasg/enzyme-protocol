import { AddressLike } from '@enzymefinance/ethers';
import { BigNumberish } from 'ethers';
import { encodeArgs } from '../encoding';

export function badgerSettVaultLendArgs({
  badgerSettVault,
  outgoingUnderlyingAmount,
  minIncomingBadgerSettVaultSharesAmount,
}: {
  badgerSettVault: AddressLike;
  outgoingUnderlyingAmount: BigNumberish;
  minIncomingBadgerSettVaultSharesAmount: BigNumberish;
}) {
  return encodeArgs(
    ['address', 'uint256', 'uint256'],
    [badgerSettVault, outgoingUnderlyingAmount, minIncomingBadgerSettVaultSharesAmount],
  );
}

export function badgerSettVaultRedeemArgs({
  badgerSettVault,
  outgoingBadgerSettVaultSharesAmount,
  minIncomingUnderlyingAmount,
}: {
  badgerSettVault: AddressLike;
  outgoingBadgerSettVaultSharesAmount: BigNumberish;
  minIncomingUnderlyingAmount: BigNumberish;
}) {
  return encodeArgs(
    ['address', 'uint256', 'uint256'],
    [badgerSettVault, outgoingBadgerSettVaultSharesAmount, minIncomingUnderlyingAmount],
  );
}
