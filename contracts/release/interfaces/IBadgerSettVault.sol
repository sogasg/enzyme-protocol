// SPDX-License-Identifier: GPL-3.0

/*
    This file is part of the Enzyme Protocol.

    (c) Enzyme Council <council@enzyme.finance>

    For the full license information, please view the LICENSE
    file that was distributed with this source code.
*/

pragma solidity 0.6.12;

/// @title IBadgerSettVault Interface
/// @author Asgeir
/// @notice Minimal interface for our interactions with Badger Sett Vault contracts
interface IBadgerSettVault {
    function deposit(uint256) external;

    function depositAll() external;

    function getPricePerFullShare() external view returns (uint256);

    function token() external view returns (address);

    function withdraw(uint256) external;

    function withdrawAll() external;

    function governance() external view returns (address);

    function approveContractAccess(address account) external;
}
