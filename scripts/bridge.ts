import {
  getEmitterAddressEth,
  parseSequenceFromLogEth,
  tryNativeToHexString,
} from '@certusone/wormhole-sdk';
import { ethers } from 'hardhat';
import signale from 'signale';

async function main() {
  const bridgeAmt = ethers.utils.parseUnits('3', 18);
  const Bridge = await ethers.getContractFactory('BloomBridgeEVM');
  const bloomBridge = await Bridge.attach(
    '0xc6D2C9a921bFc451161971352bC6B00840103A64' // TODO: Replace with your deployed contract address
  );
  const targetRecepient = Buffer.from(
    tryNativeToHexString(
      '0xc6D2C9a921bFc451161971352bC6B00840103A64', // The address of the user that want to be bridge
      'ethereum'
    ),
    'hex'
  );
  const tx = await (
    await bloomBridge.bridgeDAIToMumbai(bridgeAmt, 8001, targetRecepient)
  ).wait();
  signale.success(`Goerli bridge done tx hash: ${tx.transactionHash}`);
  const emmiterAddr = getEmitterAddressEth(
    '0xB4DC0c495a4304cA549B17f17D86298207D05E48' // Wormhole bridge contract address
  );
  console.log(emmiterAddr);
  console.log(tx.logs);
  const seq = parseSequenceFromLogEth(tx, emmiterAddr);
  const vaaURL = `https://wormhole-v2-testnet-api.certus.one
  /v1/signed_vaa/2/${emmiterAddr}/${seq}`;
  console.log(vaaURL);
  signale.pending('Waiting for VAAs');
  let vaaBytes = await (await fetch(vaaURL)).json();
  while (!vaaBytes.vaaBytes) {
    signale.error('VAA not found, retrying in 5s!');
    await new Promise((r) => setTimeout(r, 5000)); //Timeout to let Guardiand pick up log and have VAA ready
    vaaBytes = await (await fetch(vaaURL)).json();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
