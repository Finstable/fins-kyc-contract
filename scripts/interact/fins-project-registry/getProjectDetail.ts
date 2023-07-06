import hre, { ethers } from "hardhat";
import addresses from "../../../utils/addresses";
import { FINSProjectRegistry__factory } from "../../../typechain-types";

const main = async function () {
  const [owner] = await ethers.getSigners();
  const addressList = await addresses.getAddressList(hre.network.name);

  const FINSProjectRegistry = FINSProjectRegistry__factory.connect(
    addressList["FINSProjectRegistry"],
    owner
  );

  const projectDetail = await FINSProjectRegistry.projects(1);

  console.log({ projectDetail });
};

main();
