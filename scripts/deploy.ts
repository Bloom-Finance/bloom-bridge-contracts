import { ethers, run, network } from 'hardhat';
import signale from 'signale';
async function main() {
  signale.pending(`Deploying  contract to ${network.name} \n`);
  const BloomBridgeEVMFactory = await ethers.getContractFactory(
    'BloomBridgeEVM'
  );
  const bloomBridge = await BloomBridgeEVMFactory.deploy();
  await bloomBridge.deployed();
  signale.success(`BloomBridgeEVM deployed to ${bloomBridge.address}`);
  await bloomBridge.deployTransaction.wait(5);
  signale.pending(`Waiting for some blocks to be mined...`);
  await verify(bloomBridge.address, []);
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
