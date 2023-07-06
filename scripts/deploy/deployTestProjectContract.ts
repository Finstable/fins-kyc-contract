import hre, { ethers } from "hardhat";
import addresses from "../../utils/addresses";
import { TestProjectContract__factory } from "../../typechain-types";

export async function deployTestProjectContract() {
  const [owner] = await ethers.getSigners();
  const addressList = await addresses.getAddressList(hre.network.name);

  const TestProjectContract = (await ethers.getContractFactory(
    "TestProjectContract",
    owner
  )) as TestProjectContract__factory;

  const testProjectContract = await TestProjectContract.deploy(
    addressList["FINSKYC"],
    1
  );

  await testProjectContract.deployed();
  console.log("TestProjectContract deployed to:", testProjectContract.address);

  await addresses.saveAddresses(hre.network.name, {
    TestProjectContract: testProjectContract.address,
  });
}

deployTestProjectContract();
