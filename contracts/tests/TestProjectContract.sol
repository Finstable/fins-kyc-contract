// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
import "../abstracts/FINSKYCHelper.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestProjectContract is FINSKYCHelper, Ownable {
    constructor(
        IFINSKYC _finsKYC,
        uint256 _acceptedKYCLevel
    ) FINSKYCHelper(_finsKYC, _acceptedKYCLevel) {}

    function testAcceptedKYCLevel()
        external
        view
        requireKYC
        returns (string memory)
    {
        return "testAcceptedKYCLevel success";
    }

    function testAcceptedKYCLevel3()
        external
        view
        requireKYCLevel(3)
        returns (string memory)
    {
        return "testAcceptedKYCLevel3 success";
    }

    function setAcceptedKYCLevel(uint256 _kycLevel) external onlyOwner {
        _setAcceptedKYCLevel(_kycLevel);
    }

    function setFINSKYC(IFINSKYC _finsKYC) external onlyOwner {
        _setFINSKYC(_finsKYC);
    }
}
