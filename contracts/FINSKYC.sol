// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IFINSKYC.sol";

contract FINSKYC is IFINSKYC, Ownable {
    IFINSProjectRegistry public projectRegistry;
    mapping(uint256 => KYCWallet) private _kycWallets;
    address public kycAdmin;

    constructor(address _projectRegistry, address _kycAdmin) {
        projectRegistry = IFINSProjectRegistry(_projectRegistry);
        kycAdmin = _kycAdmin;
    }
}
