import { ethers, run, network } from 'hardhat';
import signale from 'signale';
async function main() {
  signale.pending(`Deploying  contract to ${network.name} \n`);
  const BloomBridgeEVMFactory = await ethers.getContractFactory(
    'BloomBridgeEVM'
  );
  const currentNetworkId = network.config.chainId;
  const { _dai } = getContractsAddresses(network.config.chainId as any);
  // const bloomBridgeEVM = await BloomBridgeEVMFactory.deploy(_dai);
  // await bloomBridgeEVM.deployed();
  // signale.success(
  //   `Treasure contract was deployed to:${bloomBridgeEVM.address} 🚀🚀 `
  // );
  // if (
  //   (currentNetworkId === 5 ||
  //     currentNetworkId === 1 ||
  //     currentNetworkId === 97 ||
  //     currentNetworkId === 56) &&
  //   process.env.ETHERSCAN_API_KEY
  // ) {
  //   signale.pending('Waiting for blocks to be mined 🕑 ');
  //   await bloomBridgeEVM.deployTransaction.wait(10);
  //   signale.success('Blocks mined ');
  //   signale.pending('Verifying  contracts on Etherscan');
  //   await verify(bloomBridgeEVM.address, [_dai]);
  //   signale.success('Contracts verified on Etherscan');
  //   signale.complete('All done 🎉🎉');
  // }
}

async function verify(contractAddress: string, args: any[]) {
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error: any) {
    if (error.message.toLowerCase().includes('already verified')) {
      console.log('Contract already verified');
    } else {
      console.log(error);
    }
  }
}
function getContractsAddresses(chainId: 5 | 1 | 97 | 56) {
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

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
