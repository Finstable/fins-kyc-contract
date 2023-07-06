import hre, { ethers } from "hardhat";
import addresses from "../../utils/addresses";
import { TestProjectContract__factory } from "../../typechain-types";

const main = async function () {
  const [owner] = await ethers.getSigners();
  const addressList = await addresses.getAddressList(hre.network.name);

  const TestProjectContract = TestProjectContract__factory.connect(
    addressList["TestProjectContract"],
    owner
  );

  const testAcceptedKYCLevel = await TestProjectContract.testAcceptedKYCLevel();
  console.log(testAcceptedKYCLevel.toString());

  const testAcceptedKYCLevel3 =
    await TestProjectContract.testAcceptedKYCLevel3();
  console.log(testAcceptedKYCLevel3.toString());
};

main();
