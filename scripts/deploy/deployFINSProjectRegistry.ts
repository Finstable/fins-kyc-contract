import hre, { ethers } from "hardhat";
import addresses from "../../utils/addresses";
import { FINSProjectRegistry__factory } from "../../typechain-types";

export async function deployFINSProjectRegistry() {
  const [owner] = await ethers.getSigners();
  const addressList = await addresses.getAddressList(hre.network.name);

  const FINSProjectRegistry = (await ethers.getContractFactory(
    "FINSProjectRegistry",
    owner
  )) as FINSProjectRegistry__factory;

  const finsProjectRegistry = await FINSProjectRegistry.deploy(
    addressList["ProjectAdmin"]
  );

  await finsProjectRegistry.deployed();
  console.log("FINSProjectRegistry deployed to:", finsProjectRegistry.address);

  await addresses.saveAddresses(hre.network.name, {
    FINSProjectRegistry: finsProjectRegistry.address,
  });
}

deployFINSProjectRegistry();
