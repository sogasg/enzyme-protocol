// SPDX-License-Identifier: GPL-3.0

/*
    This file is part of the Enzyme Protocol.

    (c) Enzyme Council <council@enzyme.finance>

    For the full license information, please view the LICENSE
    file that was distributed with this source code.
*/

pragma solidity 0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../../../../interfaces/IBadgerSettVault.sol";
import "../../../../interfaces/IBadgerSettController.sol";
import "../IDerivativePriceFeed.sol";

/// @title BadgerSettVaultPriceFeed Contract
/// @author Asgeir
/// @notice Price source for Badger Sett Vault shares
contract BadgerSettVaultPriceFeed is IDerivativePriceFeed {
    using SafeMath for uint256;

    address private immutable BADGER_SETT_VAULT_CONTROLLER;

    constructor(address _fundDeployer, address _badgerSettVaultController) public {
        BADGER_SETT_VAULT_CONTROLLER = _badgerSettVaultController;
    }

    /// @notice Converts a given amount of a derivative to its underlying asset values
    /// @param _derivative The derivative to convert
    /// @param _derivativeAmount The amount of the derivative to convert
    /// @return underlyings_ The underlying assets for the _derivative
    /// @return underlyingAmounts_ The amount of each underlying asset for the equivalent derivative amount
    function calcUnderlyingValues(address _derivative, uint256 _derivativeAmount)
        external
        override
        returns (address[] memory underlyings_, uint256[] memory underlyingAmounts_)
    {
        underlyings_ = new address[](1);
        underlyings_[0] = IBadgerSettVault(_derivative).token();

        require(underlyings_[0] != address(0), "calcUnderlyingValues: Unsupported derivative");

        underlyingAmounts_ = new uint256[](1);
        underlyingAmounts_[0] = _derivativeAmount
            .mul(IBadgerSettVault(_derivative).getPricePerFullShare())
            .div(10**uint256(ERC20(_derivative).decimals()));
    }

    /// @notice Checks if an asset is supported by the price feed
    /// @param _asset The asset to check
    /// @return isSupported_ True if the asset is supported
    function isSupportedAsset(address _asset) external view override returns (bool isSupported_) {
        return IBadgerSettController(BADGER_SETT_VAULT_CONTROLLER).vaults(_asset) != address(0);
    }

    /// @dev Helper to validate the derivative-underlying pair.
    /// Inherited from SingleUnderlyingDerivativeRegistryMixin.
    function __validateDerivative(address _derivative, address _underlying) internal override {
        // Only validate that the _derivative is a valid Badger Sett Vault.
        IBadgerSettController badgerSettController = IBadgerSettController(
            BADGER_SETT_VAULT_CONTROLLER
        );
        require(
            badgerSettController.vaults(_underlying) != address(0),
            "__validateDerivative: No active vault for underlying"
        );

        require(
            badgerSettController.vaults(_underlying) == _derivative,
            "__validateDerivative: The derivative is not the current active vault for the current underlying"
        );

        // Validates our assumption that Badger Sett Vault and underlyings will have the same decimals
        require(
            ERC20(_derivative).decimals() == ERC20(_underlying).decimals(),
            "__validateDerivative: Incongruent decimals"
        );
    }

    ///////////////////
    // STATE GETTERS //
    ///////////////////

    /// @notice Gets the `BADGER_SETT_VAULT_CONTROLLER` variable
    /// @return badgerSettVaultController_ The `BADGER_SETT_VAULT_CONTROLLER` variable value
    function getBadgerSettVaultController()
        public
        view
        returns (address badgerSettVaultController_)
    {
        return BADGER_SETT_VAULT_CONTROLLER;
    }
}
