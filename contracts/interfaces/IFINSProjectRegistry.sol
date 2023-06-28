// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

interface IFINSProjectRegistry {
    struct Project {
        string projectName;
        address[] contractAddresses;
        bool isActive;
    }

    function kycProject(uint256) external view returns (Project memory);

    function kycProjectCount() external view returns (uint256);

    function projectAdmin() external view returns (address);

    function addKYCProject(
        string memory name,
        address[] memory contractAddresses
    ) external;

    function addProjectContractAddress(
        uint256 projectId,
        address contractAddress
    ) external;

    function setProjectIsActive(uint256 projectId, bool status) external;

    function getProjectIsActive(
        address contractAddress
    ) external view returns (bool);
}
