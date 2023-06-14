import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import accountUtils from "./utils/accounts";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.18",
      },
    ],
  },
  networks: {
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: accountUtils.getAccounts(),
    },
  },
};

export default config;
