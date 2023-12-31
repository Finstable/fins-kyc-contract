// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

interface IFINSProjectRegistry {
    struct Project {
        string projectName;
        address[] contractAddresses;
        bool isActive;
    }

    function projects(uint256) external view returns (Project memory);

    function projectCount() external view returns (uint256);

    function projectAdmin() external view returns (address);

    function addProject(
        string memory name,
        address[] memory contractAddresses
    ) external;

    function addProjectContract(
        uint256 projectId,
        address contractAddress
    ) external;

    function setProjectIsActive(uint256 projectId, bool status) external;

    function getProjectIsActive(
        address contractAddress
    ) external view returns (bool);

    function setProjectAdmin(address _projectAdmin) external;
}
