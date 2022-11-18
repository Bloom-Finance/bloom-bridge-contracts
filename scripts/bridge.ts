import {
  CONTRACTS,
  ChainId,
  coalesceChainName,
  tryNativeToHexString,
  getEmitterAddressEth,
  parseSequenceFromLogEth,
} from '@certusone/wormhole-sdk';
import { ethers } from 'hardhat';
import signale from 'signale';
import { getWormholeTokenBridgeAddress } from '../utils/addresses';
async function main() {
  const bridgeAmt = ethers.utils.parseUnits('3', 18);
  const Bridge = await ethers.getContractFactory('BloomBridgeEVM');

  signale.pending('Bridging your token...');
  const bloomBridge = await Bridge.attach(
    '0xc6D2C9a921bFc451161971352bC6B00840103A64' // TODO: Replace with your deployed contract address of bloom bridge
  );
  const targetRecepient = Buffer.from(
    tryNativeToHexString(
      '0xF274800E82717D38d2e2ffe18A4C6489a50C5Add', // The address of the user that want to receive the money in the other bridge
      'ethereum'
    ),
    'hex'
  );
  const tx = await (
    await bloomBridge.bridgeDAI(bridgeAmt, 5, targetRecepient)
  ).wait();
  signale.success(`Goerli bridge done tx hash: ${tx.transactionHash}`);
  const emmiterAddr = getEmitterAddressEth(
    getWormholeTokenBridgeAddress(5, true) // Wormhole token bridge contract address
  );
  const seq = parseSequenceFromLogEth(
    tx,
    '0x706abc4E45D419950511e474C7B9Ed348A4a716c' //Wormhole core bridge address
  );
  const vaaURL = `https://wormhole-v2-testnet-api.certus.one/v1/signed_vaa/2/${emmiterAddr}/${seq}`;
  signale.pending('Waiting for VAAs');
  let vaaBytes = await (await fetch(vaaURL)).json();
  signale.await(
    'Grab a coffee while we wait for the VAA this is going to be a long one... ☕☕ '
  );
  while (!vaaBytes.vaaBytes) {
    await new Promise((r) => setTimeout(r, 5000)); //Timeout to let Guardiand pick up log and have VAA ready
    vaaBytes = await (await fetch(vaaURL)).json();
  }
  signale.success('VAA found!');
  signale.pending('Completing transfer');
  signale.success(
    `Transfer complete! You're all set! Here you have your VAA: ${vaaBytes.vaaBytes}`
  );
}

const getTokenBridgeAddressForChain = (chainId: number) => {
  // CONTRACTS['TESTNET'][coalesceChainName(chainId)].token_bridge || '';
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
