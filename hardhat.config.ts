import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import {
  attestFromEth,
  getEmitterAddressEth,
  parseSequenceFromLogEth,
} from '@certusone/wormhole-sdk';
require('dotenv').config();
task('attest', 'attest from eth', async (args, hre) => {
  //TODO: Check private key
  const signer = new hre.ethers.Wallet(
    process.env.PRIVATE_KEY as string,
    hre.ethers.provider
  );
  const tokenBridgeAddr = '0xF890982f9310df57d00f659cf4fd87e65adEd8d7';
  const networkTokenAttestation = await attestFromEth(
    tokenBridgeAddr,
    signer,
    '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844'
  );
  const emitterAddr = getEmitterAddressEth(tokenBridgeAddr);
  const seq = parseSequenceFromLogEth(networkTokenAttestation, tokenBridgeAddr);
  const vaaURL = `https://wormhole-v2-testnet-api.certus.one/v1/signed_vaa/${5}/${emitterAddr}/${seq}`;
  console.log('Searching for: ', vaaURL);
  let vaaBytes = await (await fetch(vaaURL)).json();
  while (!vaaBytes.vaaBytes) {
    console.log('VAA not found, retrying in 5s!');
    await new Promise((r) => setTimeout(r, 5000)); //Timeout to let Guardiand pick up log and have VAA ready
    vaaBytes = await (await fetch(vaaURL)).json();
  }
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
  },
  etherscan: {
    apiKey: {
      bscTestnet: process.env.BSC_API_KEY,
      goerli: process.env.ETHERSCAN_API_KEY,
      mainnet: process.env.ETHERSCAN_API_KEY,
    },
  },
};

export default config;
