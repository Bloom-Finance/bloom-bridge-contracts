import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.0',
      },
    ],
  },
  networks: {
    bsc_testnet: {
      url: process.env.BSC_TESTNET_RPC,
      accounts: [process.env.PRIVATE_KEY as string],
      chainId: 97,
    },
    goerli: {
      url: process.env.GOERLI_TESTNET_RPC,
      accounts: [process.env.PRIVATE_KEY as string],
      chainId: 5,
    },
    mumbai: {
      url: process.env.RPC_MUMBAI,
      accounts: [process.env.PRIVATE_KEY as string],
      chainId: 80001,
    },
  },
  etherscan: {
    apiKey: {
      bscTestnet: process.env.BSC_API_KEY,
      goerli: process.env.ETHERSCAN_API_KEY,
      mainnet: process.env.ETHERSCAN_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
    },
  },
};

export default config;
