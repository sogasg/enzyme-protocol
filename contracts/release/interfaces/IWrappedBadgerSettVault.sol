// SPDX-License-Identifier: GPL-3.0

/*
    This file is part of the Enzyme Protocol.

    (c) Enzyme Council <council@enzyme.finance>

    For the full license information, please view the LICENSE
    file that was distributed with this source code.
*/

pragma solidity 0.6.12;

/// @title IYearnVaultV2 Interface
/// @author Enzyme Council <security@enzyme.finance>
/// @notice Minimal interface for our interactions with Yearn Vault V2 contracts
interface IWrappedBadgerSettVault {
    function deposit(uint256) external;

    function getPricePerFullShare() external view returns (uint256);

    function token() external view returns (address);

    function underlyingToken() external view returns (address);

    function wrappedVault() external view returns (address);

    function withdraw(uint256) external;
}
