import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import { tryNativeToHexString } from '@certusone/wormhole-sdk';
import { ethers } from 'hardhat';
import signale from 'signale';

require('dotenv').config();

//TODO: Should we have to attest tokens if we can do it with portal?
// task('attest', 'attest from eth', async (args, hre) => {});

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
