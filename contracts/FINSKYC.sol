// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IFINSKYC.sol";

contract FINSKYC is IFINSKYC, Ownable {
    event KYCLevelSet(
        address indexed walletAddress,
        string uid,
        uint256 kycLevel
    );
    event KYCLevelUpdated(address indexed walletAddress, uint256 kycLevel);
    event KYCAdminSet(address indexed kycAdmin);
    event FINSProjectRegistrySet(address indexed projectRegistry);

    IFINSProjectRegistry public projectRegistry;
    mapping(address => KYCWallet) private _kycWallets;
    address public kycAdmin;

    constructor(address _projectRegistry, address _kycAdmin) {
        projectRegistry = IFINSProjectRegistry(_projectRegistry);
        kycAdmin = _kycAdmin;
    }

    modifier onlyKYCAdminOrOwner() {
        require(
            msg.sender == kycAdmin || msg.sender == owner(),
            "Only KYC admin or owner can call this function"
        );
        _;
    }

    function setKYCWallet(
        address walletAddress,
        string memory uid,
        uint256 kycLevel
    ) external onlyKYCAdminOrOwner {
        _kycWallets[walletAddress] = KYCWallet({
            uid: uid,
            kycLevel: kycLevel,
            updatedAt: block.timestamp
        });
        emit KYCLevelSet(walletAddress, uid, kycLevel);
    }

    function updateKYCLevel(
        address walletAddress,
        uint256 kycLevel
    ) external onlyKYCAdminOrOwner {
        _kycWallets[walletAddress].kycLevel = kycLevel;
        _kycWallets[walletAddress].updatedAt = block.timestamp;
        emit KYCLevelUpdated(walletAddress, kycLevel);
    }

    function setFINSProjectRegistry(
        address _projectRegistry
    ) external onlyOwner {
        projectRegistry = IFINSProjectRegistry(_projectRegistry);
        emit FINSProjectRegistrySet(_projectRegistry);
    }

    function setKYCAdmin(address _kycAdmin) external onlyOwner {
        kycAdmin = _kycAdmin;
        emit KYCAdminSet(_kycAdmin);
    }

    function getKYCLevel(
        address walletAddress
    ) external view override returns (uint256) {
        require(
            projectRegistry.getProjectIsActive(msg.sender),
            "Sender is not an active project"
        );
        return _kycWallets[walletAddress].kycLevel;
    }

    function kycWallets(
        address walletAddress
    ) external view override onlyKYCAdminOrOwner returns (KYCWallet memory) {
        return _kycWallets[walletAddress];
    }
}
