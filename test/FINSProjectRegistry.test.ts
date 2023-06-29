import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import {
  FINSProjectRegistry,
  FINSProjectRegistry__factory,
} from "../typechain-types";

describe("FINSProjectRegistry", function () {
  let finsProjectRegistry: FINSProjectRegistry;
  let owner: SignerWithAddress;
  let projectAdmin: SignerWithAddress;
  let testWallet: SignerWithAddress;
  let testContract: SignerWithAddress;

  beforeEach(async function () {
    [owner, projectAdmin, testWallet, testContract] = await ethers.getSigners();
    const finsProjectRegistryFactory = (await ethers.getContractFactory(
      "FINSProjectRegistry",
      owner
    )) as FINSProjectRegistry__factory;
    finsProjectRegistry = await finsProjectRegistryFactory
      .connect(owner)
      .deploy(projectAdmin.address);
    await finsProjectRegistry.deployed();
  });

  it("should deploy the contract", async function () {
    expect(finsProjectRegistry.address).to.not.equal(0);
  });

  it("should initiate the project admin", async function () {
    expect(await finsProjectRegistry.projectAdmin()).to.equal(
      projectAdmin.address
    );
  });

  it("should allow the project admin to add a project", async function () {
    await finsProjectRegistry
      .connect(projectAdmin)
      .addProject("Test Project", [testContract.address]);
    expect(await finsProjectRegistry.projectCount()).to.equal(1);
    expect((await finsProjectRegistry.projects(0)).projectName).to.equal(
      "Test Project"
    );
    expect(
      (await finsProjectRegistry.projects(0)).contractAddresses[0]
    ).to.equal(testContract.address);
  });

  it("should allow the project admin to add a contract to a project", async function () {
    await finsProjectRegistry
      .connect(projectAdmin)
      .addProject("Test Project", []);
    await finsProjectRegistry
      .connect(projectAdmin)
      .addProjectContract(0, testContract.address);
    expect(
      (await finsProjectRegistry.projects(0)).contractAddresses[0]
    ).to.equal(testContract.address);
  });

  it("should allow the project admin to set isActive status to a project", async function () {
    await finsProjectRegistry
      .connect(projectAdmin)
      .addProject("Test Project", []);
    await finsProjectRegistry
      .connect(projectAdmin)
      .setProjectIsActive(0, false);
    expect((await finsProjectRegistry.projects(0)).isActive).to.equal(false);
  });

  it("should allow the owner to add a project", async function () {
    await finsProjectRegistry
      .connect(owner)
      .addProject("Test Project", [testContract.address]);
    expect(await finsProjectRegistry.projectCount()).to.equal(1);
    expect((await finsProjectRegistry.projects(0)).projectName).to.equal(
      "Test Project"
    );
    expect(
      (await finsProjectRegistry.projects(0)).contractAddresses[0]
    ).to.equal(testContract.address);
  });

  it("should allow the owner to add a contract to a project", async function () {
    await finsProjectRegistry.connect(owner).addProject("Test Project", []);
    await finsProjectRegistry
      .connect(owner)
      .addProjectContract(0, testContract.address);
    expect(
      (await finsProjectRegistry.projects(0)).contractAddresses[0]
    ).to.equal(testContract.address);
  });

  it("should allow the owner to set isActive status to a project", async function () {
    await finsProjectRegistry.connect(owner).addProject("Test Project", []);
    await finsProjectRegistry.connect(owner).setProjectIsActive(0, false);
    expect((await finsProjectRegistry.projects(0)).isActive).to.equal(false);
  });

  it("should allow the owner to update the project admin", async function () {
    await finsProjectRegistry
      .connect(owner)
      .setProjectAdmin(testWallet.address);
    expect(await finsProjectRegistry.projectAdmin()).to.equal(
      testWallet.address
    );
  });

  it("should not allow non project admin or owner to add project", async function () {
    await expect(
      finsProjectRegistry
        .connect(testWallet)
        .addProject("Test Project", [testContract.address])
    ).to.be.revertedWith("Only project admin or owner can call this function");
  });

  it("should not allow non project admin or owner to add a contract to a project", async function () {
    await finsProjectRegistry
      .connect(projectAdmin)
      .addProject("Test Project", []);
    await expect(
      finsProjectRegistry
        .connect(testWallet)
        .addProjectContract(0, testContract.address)
    ).to.be.revertedWith("Only project admin or owner can call this function");
  });

  it("should not allow non project admin or owner to set isActive status to a project", async function () {
    await finsProjectRegistry
      .connect(projectAdmin)
      .addProject("Test Project", []);
    await expect(
      finsProjectRegistry.connect(testWallet).setProjectIsActive(0, false)
    ).to.be.revertedWith("Only project admin or owner can call this function");
  });

  it("should not allow non owner to update the project admin", async function () {
    await expect(
      finsProjectRegistry
        .connect(projectAdmin)
        .setProjectAdmin(testWallet.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("should get the project detail by project id", async function () {
    await finsProjectRegistry
      .connect(projectAdmin)
      .addProject("Test Project", [testContract.address]);
    expect((await finsProjectRegistry.projects(0)).projectName).to.equal(
      "Test Project"
    );
  });

  it("should get the project isActive status by contract address", async function () {
    await finsProjectRegistry
      .connect(projectAdmin)
      .addProject("Test Project", [testContract.address]);
    expect(
      await finsProjectRegistry.getProjectIsActive(testContract.address)
    ).to.equal(true);
  });
});
