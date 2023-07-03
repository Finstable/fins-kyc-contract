import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import {
  FINSKYC,
  FINSKYC__factory,
  FINSProjectRegistry,
  FINSProjectRegistry__factory,
} from "../typechain-types";

describe("FINSKYC", function () {
  let finsKYC: FINSKYC;
  let finsProjectRegistry: FINSProjectRegistry;
  let kycAdmin: SignerWithAddress;
  let projectAdmin: SignerWithAddress;
  let owner: SignerWithAddress;
  let testWallet: SignerWithAddress;
  let registeredContract: SignerWithAddress;
  let testContract: SignerWithAddress;

  beforeEach(async function () {
    [
      owner,
      kycAdmin,
      projectAdmin,
      testWallet,
      testContract,
      registeredContract,
    ] = await ethers.getSigners();

    const finsProjectRegistryFactory = (await ethers.getContractFactory(
      "FINSProjectRegistry",
      owner
    )) as FINSProjectRegistry__factory;

    const finsKYCFactory = (await ethers.getContractFactory(
      "FINSKYC",
      owner
    )) as FINSKYC__factory;

    finsProjectRegistry = await finsProjectRegistryFactory
      .connect(owner)
      .deploy(projectAdmin.address);
    await finsProjectRegistry.deployed();

    await finsProjectRegistry
      .connect(projectAdmin)
      .addProject("Test Project", [registeredContract.address]);

    finsKYC = await finsKYCFactory
      .connect(owner)
      .deploy(finsProjectRegistry.address, kycAdmin.address);
    await finsKYC.deployed();
  });

  it("should deploy the contract", async function () {
    expect(finsKYC.address).to.not.equal(0);
  });

  it("should initiate the kyc admin", async function () {
    expect(await finsKYC.kycAdmin()).to.equal(kycAdmin.address);
  });

  it("should initiate the project registry", async function () {
    expect(await finsKYC.projectRegistry()).to.equal(
      finsProjectRegistry.address
    );
  });

  it("should allow the kyc admin to set KYC Level", async function () {
    await finsKYC
      .connect(kycAdmin)
      .setKYCWallet(testWallet.address, "abc123", 1);
    expect((await finsKYC.kycWallets(testWallet.address)).kycLevel).to.equal(1);
  });

  it("should allow the kyc admin to update KYC Level", async function () {
    await finsKYC
      .connect(kycAdmin)
      .setKYCWallet(testWallet.address, "abc123", 1);
    await finsKYC.connect(kycAdmin).updateKYCLevel(testWallet.address, 0);
    expect((await finsKYC.kycWallets(testWallet.address)).kycLevel).to.equal(0);
  });

  it("should allow the owner to set KYC Level", async function () {
    await finsKYC.connect(owner).setKYCWallet(testWallet.address, "abc123", 1);
    expect((await finsKYC.kycWallets(testWallet.address)).kycLevel).to.equal(1);
  });

  it("should allow the owner to update KYC Level", async function () {
    await finsKYC.connect(owner).setKYCWallet(testWallet.address, "abc123", 1);
    await finsKYC.connect(kycAdmin).updateKYCLevel(testWallet.address, 0);
    expect((await finsKYC.kycWallets(testWallet.address)).kycLevel).to.equal(0);
  });

  it("should allow the owner to update the FINSProjectRegistry", async function () {
    await finsKYC.connect(owner).setFINSProjectRegistry(testContract.address);
    expect(await finsKYC.projectRegistry()).to.equal(testContract.address);
  });

  it("should allow the owner to update the kyc admin", async function () {
    await finsKYC.connect(owner).setKYCAdmin(testWallet.address);
    expect(await finsKYC.kycAdmin()).to.equal(testWallet.address);
  });

  it("should not allow non kyc admin or owner to set KYC Level", async function () {
    await expect(
      finsKYC.connect(testWallet).setKYCWallet(testWallet.address, "abc123", 1)
    ).to.be.revertedWith("Only KYC admin or owner can call this function");
  });

  it("should not allow non kyc admin or owner to update KYC Level", async function () {
    await expect(
      finsKYC.connect(testWallet).updateKYCLevel(testWallet.address, 0)
    ).to.be.revertedWith("Only KYC admin or owner can call this function");
  });

  it("should not allow non owner to update the FINSProjectRegistry", async function () {
    await expect(
      finsKYC.connect(testWallet).setFINSProjectRegistry(testContract.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("should not allow non owner to update the kyc admin", async function () {
    await expect(
      finsKYC.connect(testWallet).setKYCAdmin(testWallet.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("should allow registered contract to get kycLevel", async function () {
    await finsKYC
      .connect(kycAdmin)
      .setKYCWallet(testWallet.address, "abc123", 1);

    expect(
      await finsKYC.connect(registeredContract).getKYCLevel(testWallet.address)
    ).to.equal(1);
  });

  it("should allow kyc admin to get kycWallet detail", async function () {
    await finsKYC
      .connect(kycAdmin)
      .setKYCWallet(testWallet.address, "abc123", 1);

    expect(
      (await finsKYC.connect(kycAdmin).kycWallets(testWallet.address)).uid
    ).to.equal("abc123");
  });

  it("should allow owner to get kycWallet detail", async function () {
    await finsKYC
      .connect(kycAdmin)
      .setKYCWallet(testWallet.address, "abc123", 1);

    expect(
      (await finsKYC.connect(owner).kycWallets(testWallet.address)).uid
    ).to.equal("abc123");
  });

  it("should not allow non registered contract to get kycLevel", async function () {
    await finsKYC
      .connect(kycAdmin)
      .setKYCWallet(testWallet.address, "abc123", 1);

    await expect(
      finsKYC.connect(testContract).getKYCLevel(testWallet.address)
    ).to.be.revertedWith("Sender is not an active project");
  });

  it("should not allow non kyc admin or owner to get kycWallet detail", async function () {
    await finsKYC
      .connect(kycAdmin)
      .setKYCWallet(testWallet.address, "abc123", 1);

    await expect(
      finsKYC.connect(testWallet).kycWallets(testWallet.address)
    ).to.be.revertedWith("Only KYC admin or owner can call this function");
  });
});
