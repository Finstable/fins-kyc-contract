import hre, { ethers } from "hardhat";
import addresses from "../../../utils/addresses";
import { FINSKYC__factory } from "../../../typechain-types";

const main = async function () {
  const [owner] = await ethers.getSigners();
  const addressList = await addresses.getAddressList(hre.network.name);

  const FINSKYC = FINSKYC__factory.connect(addressList["FINSKYC"], owner);

  const tx = await FINSKYC.setFINSProjectRegistry(
    addressList["FINSProjectRegistry"]
  );

  await tx.wait();

  console.log("Set FINS Project Registry Success");
};

main();
