// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IFINSProjectRegistry.sol";

contract FINSProjectRegistry is IFINSProjectRegistry, Ownable {
    event ProjectAdded(string name, address[] contractAddresses);
    event ProjectContractAdded(uint256 projectId, address contractAddress);
    event ProjectIsActiveSet(uint256 projectId, bool status);
    event ProjectAdminSet(address projectAdmin);

    mapping(uint256 => Project) private _projects;
    uint256 public projectCount;
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

    function addProject(
        string memory name,
        address[] memory contractAddresses
    ) external onlyProjectAdminOrOwner {
        _projects[projectCount] = Project({
            projectName: name,
            contractAddresses: contractAddresses,
            isActive: true
        });
        projectCount++;
        emit ProjectAdded(name, contractAddresses);
    }

    function addProjectContract(
        uint256 projectId,
        address contractAddress
    ) external onlyProjectAdminOrOwner {
        _projects[projectId].contractAddresses.push(contractAddress);
        emit ProjectContractAdded(projectId, contractAddress);
    }

    function setProjectIsActive(
        uint256 projectId,
        bool status
    ) external onlyProjectAdminOrOwner {
        _projects[projectId].isActive = status;
        emit ProjectIsActiveSet(projectId, status);
    }

    function setProjectAdmin(address _projectAdmin) external onlyOwner {
        projectAdmin = _projectAdmin;
        emit ProjectAdminSet(_projectAdmin);
    }

    function projects(
        uint256 projectId
    ) external view override returns (Project memory) {
        return (_projects[projectId]);
    }

    function getProjectIsActive(
        address contractAddress
    ) external view returns (bool) {
        for (uint256 i = 0; i < projectCount; i++) {
            for (
                uint256 j = 0;
                j < _projects[i].contractAddresses.length;
                j++
            ) {
                if (_projects[i].contractAddresses[j] == contractAddress) {
                    return _projects[i].isActive;
                }
            }
        }
        return false;
    }
}
