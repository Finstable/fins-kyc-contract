// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
import "../interfaces/IFINSKYC.sol";

abstract contract FINSKYCHelper {
    IFINSKYC public finsKYC;
    uint256 public acceptedKYCLevel;

    constructor(IFINSKYC _finsKYC, uint256 _acceptedKYCLevel) {
        finsKYC = _finsKYC;
        acceptedKYCLevel = _acceptedKYCLevel;
    }

    modifier requireKYC() {
        require(
            finsKYC.getKYCLevel(msg.sender) >= acceptedKYCLevel,
            "KYC level is too low"
        );
        _;
    }

    modifier requireKYCLevel(uint256 kycLevel) {
        require(
            finsKYC.getKYCLevel(msg.sender) >= kycLevel,
            "KYC level is too low"
        );
        _;
    }

    function _setAcceptedKYCLevel(uint256 _kycLevel) internal {
        acceptedKYCLevel = _kycLevel;
    }

    function _setFINSKYC(IFINSKYC _finsKYC) internal {
        finsKYC = _finsKYC;
    }
}
