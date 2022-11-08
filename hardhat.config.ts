import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import signale from 'signale';
require('dotenv').config();

task('deploy_receiver', 'Deploy the receiver contract').setAction(
  async (taskArgs, hre) => {
    signale.pending(`Deploying  receiver contract to ${hre.network.name} \n`);
    const receiverFactory = await hre.ethers.getContractFactory(
      'BloomBridgeReceiverEVM'
    );
    const receiver = await receiverFactory.deploy();
    await receiver.deployed();
    signale.success(
      `Receiver contract was deployed to:${receiver.address} 🚀🚀 `
    );
    signale.pending('Waiting for blocks to be mined 🕑 ');
    await receiver.deployTransaction.wait(10);
    try {
      signale.complete('Blocks mined ');
      signale.pending('Verifying  contracts on scanner');
      await hre.run('verify:verify', {
        address: receiver.address,
        constructorArguments: [],
        contract: 'contracts/BloomBridgeReceiverEVM.sol:BloomBridgeReceiverEVM',
      });
      signale.success('All done 🎉🎉');
    } catch (error: any) {
      if (error.message.toLowerCase().includes('already verified')) {
        signale.complete('Contract already verified');
      } else {
        console.log(error);
      }
    }
  }
);

task('deploy_bridge', 'Deploy the receiver contract')
  .addParam('address', 'The address of the receiver contract')
  .addParam('chain', 'The chain id of the receiver chain')
  .setAction(async (taskArgs, hre) => {
    signale.pending(`Deploying  sender contract to ${hre.network.name} \n`);
    const bridgeFactory = await hre.ethers.getContractFactory('BloomBridgeEVM');
    const { _dai } = getContractsAddresses(
      hre.network.config.chainId as number
    );
    const bridge = await bridgeFactory.deploy(
      _dai,
      taskArgs.address,
      taskArgs.chain
    );
    await bridge.deployed();
    signale.success(`Bridge contract was deployed to:${bridge.address} 🚀🚀 `);
    signale.pending('Waiting for blocks to be mined 🕑 ');
    await bridge.deployTransaction.wait(10);
    try {
      signale.complete('Blocks mined ');
      signale.pending('Verifying  contracts on scanner');
      await hre.run('verify:verify', {
        address: bridge.address,
        constructorArguments: [],
        contract: 'contracts/BloomBridgeEVM.sol:BloomBridgeEVM',
      });
      signale.success('All done 🎉🎉');
    } catch (error: any) {
      if (error.message.toLowerCase().includes('already verified')) {
        signale.complete('Contract already verified');
      } else {
        console.log(error);
      }
    }
  });

function getContractsAddresses(chainId: number) {
  switch (chainId) {
    case 5:
      // goerli testnet
      return {
        _dai: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
        _usdc: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
        _usdt: '0x2DB274b9E5946855B83e9Eac5aA6Dcf2c68a95F3',
      };
    case 1:
      // ethereum mainnet
      return {
        _dai: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        _usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        _usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      };
    case 97:
      // bnb testnet
      return {
        _dai: '0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867',
        _usdc: '0x64544969ed7EBf5f083679233325356EbE738930',
        _usdt: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
      };
    case 56:
      // bnb mainnet
      return {
        _dai: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
        _usdc: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
        _usdt: '0x55d398326f99059fF775485246999027B3197955',
      };
    default:
      throw new Error('Invalid chainId');
  }
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.17',
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
