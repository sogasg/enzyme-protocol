// SPDX-License-Identifier: GPL-3.0

/*
    This file is part of the Enzyme Protocol.

    (c) Enzyme Council <council@enzyme.finance>

    For the full license information, please view the LICENSE
    file that was distributed with this source code.
*/

pragma solidity 0.6.12;

import "../../../../../interfaces/IBadgerSettVault.sol";
import "../../../../../utils/AssetHelpers.sol";
import "../../../../../interfaces/IWrappedBadgerSettVault.sol";

/// @title BadgerSettVaultActionsMixin Contract
/// @author Asgeir
/// @notice Mixin contract for interacting with Badger Sett Vaults
abstract contract WrappedBadgerSettVaultActionsMixin is AssetHelpers {
    /// @dev Helper to lend underlying for Badger Sett Vault shares
    function __wrappedBadgerSettVaultLend(
        address _wrappedBadgerSettVault,
        address _underlying,
        uint256 _underlyingAmount
    ) internal {
        __approveAssetMaxAsNeeded(_underlying, _wrappedBadgerSettVault, _underlyingAmount);
        IWrappedBadgerSettVault(_wrappedBadgerSettVault).deposit(_underlyingAmount);
    }

    /// @dev Helper to redeem Badger Sett Vault shares for underlying
    function __wrappedBadgerSettVaultRedeem(
        address _wrappedBadgerSettVault,
        uint256 _wrappedBadgerSettVaultSharesAmount
    ) internal {
        IWrappedBadgerSettVault(_wrappedBadgerSettVault).withdraw(
            _wrappedBadgerSettVaultSharesAmount
        );
    }
}
