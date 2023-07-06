import hre, { ethers } from "hardhat";
import addresses from "../../utils/addresses";
import { FINSKYC__factory } from "../../typechain-types";

export async function deployFINSKYC() {
  const [owner] = await ethers.getSigners();
  const addressList = await addresses.getAddressList(hre.network.name);

  const FINSKYC = (await ethers.getContractFactory(
    "FINSKYC",
    owner
  )) as FINSKYC__factory;

  const finsKYC = await FINSKYC.deploy(
    addressList["FINSProjectRegistry"],
    addressList["KYCAdmin"]
  );

  await finsKYC.deployed();
  console.log("FINSKYC deployed to:", finsKYC.address);

  await addresses.saveAddresses(hre.network.name, {
    FINSKYC: finsKYC.address,
  });
}

deployFINSKYC();
