import { ethers, run, network } from 'hardhat';
import signale from 'signale';
async function main() {
  signale.pending(`Deploying  contract to ${network.name} \n`);
  const BloomBridgeEVMFactory = await ethers.getContractFactory(
    'BloomBridgeEVM'
  );
  const currentNetworkId = network.config.chainId;
  const bloomBridgeEVM = await BloomBridgeEVMFactory.deploy();
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

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
