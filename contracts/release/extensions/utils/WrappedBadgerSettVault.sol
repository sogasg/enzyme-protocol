// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.6.12;
// This is only for a single underlying due to time constraints

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "../../interfaces/IBadgerSettVault.sol";
import "../../interfaces/IWrappedBadgerSettVault.sol";

contract WrappedBadgerSettVault is ERC20, IWrappedBadgerSettVault {
    using SafeMath for uint256;

    address private BADGER_SETT_VAULT;
    address private UNDERLYING_TOKEN;

    constructor(
        address _wrappedBadgerSettVault,
        string memory _tokenName,
        string memory _tokenSymbol
    ) public ERC20(_tokenName, _tokenSymbol) {
        BADGER_SETT_VAULT = _wrappedBadgerSettVault;
        IBadgerSettVault badgerSetVault = IBadgerSettVault(BADGER_SETT_VAULT);
        UNDERLYING_TOKEN = badgerSetVault.token();
    }

    function token() public view override returns (address) {
        return IBadgerSettVault(BADGER_SETT_VAULT).token();
    }

    function underlyingToken() external view override returns (address) {
        return token();
    }

    function wrappedVault() external view override returns (address) {
        return BADGER_SETT_VAULT;
    }

    function deposit(uint256 _amountOfUnderlyingToken) public override {
        IBadgerSettVault badgerSettVault = IBadgerSettVault(BADGER_SETT_VAULT);
        ERC20 underlyingToken_ = ERC20(UNDERLYING_TOKEN);
        // Before this happens the user needs to have called approve for this token
        underlyingToken_.transferFrom(msg.sender, address(this), _amountOfUnderlyingToken);

        underlyingToken_.approve(address(badgerSettVault), _amountOfUnderlyingToken);
        uint256 originalShareAmount = badgerSettVault.balanceOf(address(this));
        badgerSettVault.deposit(_amountOfUnderlyingToken);
        uint256 newShareAmount = badgerSettVault.balanceOf(address(this));
        uint256 diffShareAmount = newShareAmount.sub(originalShareAmount);
        _mint(msg.sender, diffShareAmount);
    }

    function withdraw(uint256 _amountOfBadgerVaultShares) public override {
        _burn(msg.sender, _amountOfBadgerVaultShares);

        ERC20 underlyingToken_ = ERC20(UNDERLYING_TOKEN);

        uint256 originalUnderlyingAmount = underlyingToken_.balanceOf(address(this));
        IBadgerSettVault(BADGER_SETT_VAULT).withdraw(_amountOfBadgerVaultShares);
        uint256 newUnderlyingAmount = underlyingToken_.balanceOf(address(this));
        uint256 diffAmount = newUnderlyingAmount.sub(originalUnderlyingAmount);
        underlyingToken_.transfer(msg.sender, diffAmount);
    }

    function getPricePerFullShare() external view override returns (uint256) {
        return IBadgerSettVault(BADGER_SETT_VAULT).getPricePerFullShare();
    }
}
