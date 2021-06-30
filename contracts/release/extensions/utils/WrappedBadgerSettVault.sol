// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.6.12;
// This is only for a single underlying due to time constraints

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "../../interfaces/IBadgerSettVault.sol";

contract WrappedBedgerSettVaul is ERC20 {
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

    function deposit(uint256 _amountOfUnderlyingToken) public {
        IBadgerSettVault badgerSettVault = IBadgerSettVault(BADGER_SETT_VAULT);
        ERC20 underlyingToken = ERC20(UNDERLYING_TOKEN);
        // Before this happens the user needs to have called approve for this token
        underlyingToken.transferFrom(msg.sender, address(this), _amountOfUnderlyingToken);

        uint256 originalShareAmount = badgerSettVault.balanceOf(address(this));
        badgerSettVault.deposit(_amountOfUnderlyingToken);
        uint256 newShareAmount = badgerSettVault.balanceOf(address(this));
        uint256 diffShareAmount = newShareAmount.sub(originalShareAmount);
        _mint(msg.sender, diffShareAmount);
    }

    function withdraw(uint256 _amountOfBadgerVaultShares) public {
        _burn(msg.sender, _amountOfBadgerVaultShares);

        ERC20 underlyingToken = ERC20(UNDERLYING_TOKEN);

        uint256 originalUnderlyingAmount = underlyingToken.balanceOf(address(this));
        IBadgerSettVault(BADGER_SETT_VAULT).withdraw(_amountOfBadgerVaultShares);
        uint256 newUnderlyingAmount = underlyingToken.balanceOf(address(this));
        uint256 diffAmount = newUnderlyingAmount.sub(originalUnderlyingAmount);
        underlyingToken.transfer(msg.sender, diffAmount);
    }
}
