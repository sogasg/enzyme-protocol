// SPDX-License-Identifier: GPL-3.0

/*
    This file is part of the Enzyme Protocol.

    (c) Enzyme Council <council@enzyme.finance>

    For the full license information, please view the LICENSE
    file that was distributed with this source code.
*/

pragma solidity 0.6.12;

import "../utils/actions/BadgerSettVaultActionsMixin.sol";
import "../utils/AdapterBase2.sol";

/// @title BadgerSettVaultAdapter Contract
/// @author Asgeir
/// @notice Adapter for interacting with Badger Sett Vaults
contract BadgerSettVaultAdapter is AdapterBase2, BadgerSettVaultActionsMixin {
    constructor(address _integrationManager) public AdapterBase2(_integrationManager) {}

    /// @notice Provides a constant string identifier for an adapter
    /// @return identifier_ An identifier string
    function identifier() external pure override returns (string memory identifier_) {
        return "BADGER_SETT_VAULT";
    }

    /// @notice Deposits an amount of an underlying asset into its corresponding Badger Sett Vault
    /// @param _vaultProxy The VaultProxy of the calling fund
    /// @param _encodedAssetTransferArgs Encoded args for expected assets to spend and receive
    function lend(
        address _vaultProxy,
        bytes calldata,
        bytes calldata _encodedAssetTransferArgs
    )
        external
        onlyIntegrationManager
        postActionIncomingAssetsTransferHandler(_vaultProxy, _encodedAssetTransferArgs)
    {
        (
            ,
            address[] memory spendAssets,
            uint256[] memory spendAssetAmounts,
            address[] memory incomingAssets
        ) = __decodeEncodedAssetTransferArgs(_encodedAssetTransferArgs);

        __badgerSettVaultLend(incomingAssets[0], spendAssets[0], spendAssetAmounts[0]);
    }

    /// @notice Redeems an amount of Badger Sett Vault shares for its underlying asset
    /// @param _vaultProxy The VaultProxy of the calling fund
    /// @param _encodedCallArgs The encoded parameters for the callOnIntegration
    /// @param _encodedAssetTransferArgs Encoded args for expected assets to spend and receive
    function redeem(
        address _vaultProxy,
        bytes calldata _encodedCallArgs,
        bytes calldata _encodedAssetTransferArgs
    )
        external
        onlyIntegrationManager
        postActionIncomingAssetsTransferHandler(_vaultProxy, _encodedAssetTransferArgs)
    {
        (
            address _badgerSettVault,
            uint256 _outgoingBadgerSettVaultSharesAmount,

        ) = __decodeRedeemCallArgs(_encodedCallArgs);

        __badgerSettVaultRedeem(_badgerSettVault, _outgoingBadgerSettVaultSharesAmount);
    }

    /// @dev Helper to decode callArgs for redeeming
    function __decodeRedeemCallArgs(bytes memory _encodedCallArgs)
        private
        pure
        returns (
            address badgerSettVault_,
            uint256 outgoingBadgerSettVaultSharesAmount_,
            uint256 minIncomingUnderlyingAmount_
        )
    {
        return abi.decode(_encodedCallArgs, (address, uint256, uint256));
    }

    /// @notice Parses the expected assets to receive from a call on integration
    /// @param _selector The function selector for the callOnIntegration
    /// @param _encodedCallArgs The encoded parameters for the callOnIntegration
    /// @return spendAssetsHandleType_ A type that dictates how to handle granting
    /// the adapter access to spend assets (`None` by default)
    /// @return spendAssets_ The assets to spend in the call
    /// @return spendAssetAmounts_ The asset amounts to spend in the call
    /// @return incomingAssets_ The assets to receive in the call
    /// @return minIncomingAssetAmounts_ The min asset amounts to receive in the call
    function parseAssetsForMethod(bytes4 _selector, bytes calldata _encodedCallArgs)
        external
        view
        override
        returns (
            IIntegrationManager.SpendAssetsHandleType spendAssetsHandleType_,
            address[] memory spendAssets_,
            uint256[] memory spendAssetAmounts_,
            address[] memory incomingAssets_,
            uint256[] memory minIncomingAssetAmounts_
        )
    {
        if (_selector == LEND_SELECTOR) {
            return __parseAssetsForLend(_encodedCallArgs);
        } else if (_selector == REDEEM_SELECTOR) {
            return __parseAssetsForRedeem(_encodedCallArgs);
        }

        revert("parseAssetsForMethod: _selector invalid");
    }

    /// @dev Helper to decode callArgs for lending
    function __decodeLendCallArgs(bytes memory _encodedCallArgs)
        private
        pure
        returns (
            address badgerSettVault_,
            uint256 outgoingUnderlyingAmount_,
            uint256 minIncomingBadgerSettVaultSharesAmount_
        )
    {
        return abi.decode(_encodedCallArgs, (address, uint256, uint256));
    }

    /// @dev Helper to get the underlying for a given Badger Vault
    function __getUnderlyingForBadgerSettVault(address _badgerSettVault)
        private
        view
        returns (address underlying_)
    {
        return IBadgerSettVault(_badgerSettVault).token();
    }

    /// @dev Helper function to parse spend and incoming assets from encoded call args
    /// during lend() calls
    function __parseAssetsForLend(bytes calldata _encodedCallArgs)
        private
        view
        returns (
            IIntegrationManager.SpendAssetsHandleType spendAssetsHandleType_,
            address[] memory spendAssets_,
            uint256[] memory spendAssetAmounts_,
            address[] memory incomingAssets_,
            uint256[] memory minIncomingAssetAmounts_
        )
    {
        (
            address badgerSettVault,
            uint256 outgoingUnderlyingAmount,
            uint256 minIncomingBadgerSettVaultSharesAmount
        ) = __decodeLendCallArgs(_encodedCallArgs);

        address underlying = __getUnderlyingForBadgerSettVault(badgerSettVault);
        require(underlying != address(0), "__parseAssetsForLend: Unsupported badgerSettVault");

        spendAssets_ = new address[](1);
        spendAssets_[0] = underlying;

        spendAssetAmounts_ = new uint256[](1);
        spendAssetAmounts_[0] = outgoingUnderlyingAmount;

        incomingAssets_ = new address[](1);
        incomingAssets_[0] = badgerSettVault;

        minIncomingAssetAmounts_ = new uint256[](1);
        minIncomingAssetAmounts_[0] = minIncomingBadgerSettVaultSharesAmount;

        return (
            IIntegrationManager.SpendAssetsHandleType.Transfer,
            spendAssets_,
            spendAssetAmounts_,
            incomingAssets_,
            minIncomingAssetAmounts_
        );
    }

    /// @dev Helper function to parse spend and incoming assets from encoded call args
    /// during redeem() calls
    function __parseAssetsForRedeem(bytes calldata _encodedCallArgs)
        private
        view
        returns (
            IIntegrationManager.SpendAssetsHandleType spendAssetsHandleType_,
            address[] memory spendAssets_,
            uint256[] memory spendAssetAmounts_,
            address[] memory incomingAssets_,
            uint256[] memory minIncomingAssetAmounts_
        )
    {
        (
            address badgerSettVault,
            uint256 outgoingBadgerSettVaultSharesAmount,
            uint256 minIncomingUnderlyingAmount
        ) = __decodeRedeemCallArgs(_encodedCallArgs);

        address underlying = __getUnderlyingForBadgerSettVault(badgerSettVault);
        require(underlying != address(0), "__parseAssetsForRedeem: Unsupported yVault");

        spendAssets_ = new address[](1);
        spendAssets_[0] = badgerSettVault;

        spendAssetAmounts_ = new uint256[](1);
        spendAssetAmounts_[0] = outgoingBadgerSettVaultSharesAmount;

        incomingAssets_ = new address[](1);
        incomingAssets_[0] = underlying;

        minIncomingAssetAmounts_ = new uint256[](1);
        minIncomingAssetAmounts_[0] = minIncomingUnderlyingAmount;

        return (
            IIntegrationManager.SpendAssetsHandleType.Transfer,
            spendAssets_,
            spendAssetAmounts_,
            incomingAssets_,
            minIncomingAssetAmounts_
        );
    }
}
