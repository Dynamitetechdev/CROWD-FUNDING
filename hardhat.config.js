require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
const RPC = process.env.RPC;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.5",
      },
      {
        version: "0.8.0",
      },
    ],
  },

  networks: {
    goerli: {
      url: RPC,
      accounts: [PRIVATE_KEY],
      chainId: 5,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      5: 0,
    },
  },
};
