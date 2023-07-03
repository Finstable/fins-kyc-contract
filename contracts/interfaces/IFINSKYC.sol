// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
import "./IFINSProjectRegistry.sol";

interface IFINSKYC {
    struct KYCWallet {
        string uid;
        uint256 kycLevel;
        uint256 updatedAt;
    }

    function projectRegistry() external view returns (IFINSProjectRegistry);

    function kycWallets(address) external view returns (KYCWallet memory);

    function kycAdmin() external view returns (address);

    function setKYCWallet(
        address walletAddress,
        string memory uid,
        uint256 kycLevel
    ) external;

    function updateKYCLevel(address walletAddress, uint256 kycLevel) external;

    function setKYCAdmin(address _kycAdmin) external;

    function setFINSProjectRegistry(address _projectRegistry) external;

    function getKYCLevel(address walletAddress) external view returns (uint256);
}
