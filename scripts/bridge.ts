import {
  CONTRACTS,
  ChainId,
  coalesceChainName,
  tryNativeToHexString,
  getEmitterAddressEth,
  parseSequenceFromLogEth,
} from '@certusone/wormhole-sdk';
import { ethers } from 'hardhat';
import { abi } from '../polygonBridgeABI.json';
import signale from 'signale';
async function main() {
  const bridgeAmt = ethers.utils.parseUnits('3', 18);
  const Bridge = await ethers.getContractFactory('BloomBridgeEVM');
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
      Buffer.from(
        'AQAAAAABAGN3LIvkcTKS71lThMD8PMBM0D1fpY4tttvHBRxCWUvMHIquMvceD2ex3H2G7ZvKkasjJJB05BRpUopNiCqYxowAY3aGVAAAABgAAgAAAAAAAAAAAAAAAPiQmC+TEN9X0A9lnPT9h+Za3tjXAAAAAAAACmMBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAR4aMAAAAAAAAAAAAAAAAAEf5LauE9KmBVyNnPZcVbrDK12EQAAgAAAAAAAAAAAAAAAPJ0gA6CcX040uL/4YpMZImlDFrdAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
        'base64'
      )
    )
  ).wait();
  console.log(completeTransfer);

  // signale.pending('Bridging your token...');
  // const bloomBridge = await Bridge.attach(
  //   '0xc6D2C9a921bFc451161971352bC6B00840103A64' // TODO: Replace with your deployed contract address of bloom bridge
  // );
  // const targetRecepient = Buffer.from(
  //   tryNativeToHexString(
  //     '0xF274800E82717D38d2e2ffe18A4C6489a50C5Add', // The address of the user that want to receive the money in the other bridge
  //     'ethereum'
  //   ),
  //   'hex'
  // );
  // const tx = await (
  //   await bloomBridge.bridgeDAIToMumbai(bridgeAmt, 5, targetRecepient)
  // ).wait();
  // signale.success(`Goerli bridge done tx hash: ${tx.transactionHash}`);
  // const emmiterAddr = getEmitterAddressEth(
  //   getTokenBridgeAddressForChain(2) // Wormhole token bridge contract address
  // );
  // const seq = parseSequenceFromLogEth(
  //   tx,
  //   '0x706abc4E45D419950511e474C7B9Ed348A4a716c' //Wormhole core bridge address
  // );
  // const vaaURL = `https://wormhole-v2-testnet-api.certus.one/v1/signed_vaa/2/${emmiterAddr}/${seq}`;
  // console.log(vaaURL);
  // signale.pending('Waiting for VAAs');
  // let vaaBytes = await (await fetch(vaaURL)).json();
  // signale.await(
  //   'Grab a coffee while we wait for the VAA this is going to be a long one... ☕☕ '
  // );
  // while (!vaaBytes.vaaBytes) {
  //   await new Promise((r) => setTimeout(r, 5000)); //Timeout to let Guardiand pick up log and have VAA ready
  //   vaaBytes = await (await fetch(vaaURL)).json();
  // }
  // signale.success('VAA found!');
  // signale.pending('Completing transfer');
  // console.log(vaaBytes.vaaBytes);
}

const getTokenBridgeAddressForChain = (chainId: ChainId) =>
  CONTRACTS['TESTNET'][coalesceChainName(chainId)].token_bridge || '';

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
