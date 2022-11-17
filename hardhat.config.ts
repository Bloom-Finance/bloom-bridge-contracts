import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import { tryNativeToHexString } from '@certusone/wormhole-sdk';
import { ethers } from 'hardhat';
import signale from 'signale';
import { abi } from './polygonBridgeABI.json';

require('dotenv').config();

//TODO: Should we have to attest tokens if we can do it with portal?
task('completetransfer', 'Completes a transfer from a bridging')
  .addParam('vaa', 'The vaa to complete the transfer')
  .setAction(async (taskArgs, hre) => {
    const signer = new ethers.Wallet(
      process.env.PRIVATE_KEY as string,
      ethers.provider
    );
    const targetBridge = new ethers.Contract(
      '0x377D55a7928c046E18eEbb61977e714d2a76472a',
      abi,
      signer
    );
    const completeTransfer = await (
      await targetBridge.completeTransfer(
        Buffer.from(taskArgs.vaa as string, 'base64')
      )
    ).wait();
    signale.success(
      `Transfer completed! Tx hash: ${completeTransfer.transactionHash}`
    );
  });

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
