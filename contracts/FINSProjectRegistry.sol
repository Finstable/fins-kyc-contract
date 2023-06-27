// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IFINSProjectRegistry.sol";

contract FINSProjectRegistry is IFINSProjectRegistry, Ownable {
    event ProjectAdded(string name, address[] contractAddresses);

    event ProjectContractAddressAdded(
        uint256 projectId,
        address contractAddress
    );

    event ProjectIsActiveSet(uint256 projectId, bool status);

    event ProjectAdminSet(address projectAdmin);

    mapping(uint256 => Project) private _kycProject;
    uint256 public kycProjectCount;
    address public projectAdmin;

    constructor(address _projectAdmin) {
        projectAdmin = _projectAdmin;
    }

    modifier onlyProjectAdminOrOwner() {
        require(
            msg.sender == projectAdmin || msg.sender == owner(),
            "Only project admin or owner can call this function"
        );
        _;
    }

    function addKYCProject(
        string memory name,
        address[] memory contractAddresses
    ) external onlyProjectAdminOrOwner {
        _kycProject[kycProjectCount] = Project({
            projectName: name,
            contractAddresses: contractAddresses,
            isActive: true
        });
        kycProjectCount++;
        emit ProjectAdded(name, contractAddresses);
    }

    function addProjectContractAddress(
        uint256 projectId,
        address contractAddress
    ) external onlyProjectAdminOrOwner {
        _kycProject[projectId].contractAddresses.push(contractAddress);
        emit ProjectContractAddressAdded(projectId, contractAddress);
    }

    function setProjectIsActive(
        uint256 projectId,
        bool status
    ) external onlyProjectAdminOrOwner {
        _kycProject[projectId].isActive = status;
        emit ProjectIsActiveSet(projectId, status);
    }

    function setProjectAdmin(address _projectAdmin) external onlyOwner {
        projectAdmin = _projectAdmin;
        emit ProjectAdminSet(_projectAdmin);
    }

    function kycProject(
        uint256 projectId
    ) external view override returns (Project memory) {
        return (_kycProject[projectId]);
    }

    function getProjectIsActive(
        address contractAddress
    ) external view returns (bool) {
        for (uint256 i = 0; i < kycProjectCount; i++) {
            for (
                uint256 j = 0;
                j < _kycProject[i].contractAddresses.length;
                j++
            ) {
                if (_kycProject[i].contractAddresses[j] == contractAddress) {
                    return _kycProject[i].isActive;
                }
            }
        }
        return false;
    }
}
