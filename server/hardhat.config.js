require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    //sepolia: {
      //url: process.env.SEPOLIA_RPC_URL || "",
      //accounts: [process.env.PRIVATE_KEY]
    //}
  }
};