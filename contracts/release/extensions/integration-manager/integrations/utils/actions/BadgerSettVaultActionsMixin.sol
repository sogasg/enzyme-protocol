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

/// @title BadgerSettVaultActionsMixin Contract
/// @author Asgeir
/// @notice Mixin contract for interacting with Badger Sett Vaults
abstract contract BadgerSettVaultActionsMixin is AssetHelpers {
    /// @dev Helper to lend underlying for Badger Sett Vault shares
    function __badgerSettVaultLend(
        address _badgerSettVault,
        address _underlying,
        uint256 _underlyingAmount
    ) internal {
        __approveAssetMaxAsNeeded(_underlying, _badgerSettVault, _underlyingAmount);
        IBadgerSettVault(_badgerSettVault).deposit(_underlyingAmount);
    }

    /// @dev Helper to redeem Badger Sett Vault shares for underlying
    function __badgerSettVaultRedeem(
        address _badgerSettVault,
        uint256 _badgerSettVaultSharesAmount
    ) internal {
        // TODO: What about frontrunning? This could be a big order. Is it a problem?
        IBadgerSettVault(_badgerSettVault).withdraw(_badgerSettVaultSharesAmount);
    }
}
