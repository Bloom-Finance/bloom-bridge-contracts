import { ethers, run, network } from 'hardhat';
import signale from 'signale';
import {
  getContractsAddresses,
  getWormholeTokenBridgeAddress,
  isTesnetByChainId,
} from '../utils/addresses';
async function main() {
  signale.pending(`Deploying  contract to ${network.name} \n`);
  const BloomBridgeEVMFactory = await ethers.getContractFactory(
    'BloomBridgeEVM'
  );
  const { _dai } = getContractsAddresses(network.config.chainId as number);
  const bloomBridge = await BloomBridgeEVMFactory.deploy(
    _dai,
    getWormholeTokenBridgeAddress(
      network.config.chainId as number,
      isTesnetByChainId(network.config.chainId as number)
    )
  );
  await bloomBridge.deployed();
  signale.success(`BloomBridgeEVM deployed to ${bloomBridge.address}`);
  await bloomBridge.deployTransaction.wait(5);
  signale.pending(`Waiting for some blocks to be mined...`);
  await verify(bloomBridge.address, [
    _dai,
    getWormholeTokenBridgeAddress(
      network.config.chainId as number,
      isTesnetByChainId(network.config.chainId as number)
    ),
  ]);
}

async function verify(contractAddress: string, args: any[]) {
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error: any) {
    if (error.message.toLowerCase().includes('already verified')) {
      signale.complete(`Contract already verified`);
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
