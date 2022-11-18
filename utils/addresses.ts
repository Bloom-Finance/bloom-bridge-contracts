import { ChainId, coalesceChainName, CONTRACTS } from '@certusone/wormhole-sdk';
import addresses from '../contracts.json';
function getContractsAddresses(chainId: number) {
  switch (chainId) {
    case 5:
      // goerli testnet
      return {
        _dai: addresses.tokens.ethereum.testnet.DAI,
        _usdc: addresses.tokens.ethereum.testnet.USDC,
        _usdt: addresses.tokens.ethereum.testnet.USDT,
      };
    case 1:
      // ethereum mainnet
      return {
        _dai: addresses.tokens.ethereum.mainnet.DAI,
        _usdc: addresses.tokens.ethereum.mainnet.USDC,
        _usdt: addresses.tokens.ethereum.mainnet.USDT,
      };
    case 80001:
      //mumbai testnet
      return {
        _dai: addresses.tokens.polygon.testnet.DAI,
        _usdc: addresses.tokens.polygon.testnet.USDC,
        _usdt: addresses.tokens.polygon.testnet.USDT,
      };
    case 137:
      //polygon mainnet
      return {
        _dai: addresses.tokens.polygon.mainnet.DAI,
        _usdc: addresses.tokens.polygon.mainnet.USDC,
        _usdt: addresses.tokens.polygon.mainnet.USDT,
      };
    default:
      throw new Error('Invalid chainId');
  }
}
function getWormholeTokenBridgeAddress(chainId: number, testnet: boolean) {
  let wormholeChainId: ChainId;
  switch (chainId) {
    case 5:
      //goerli testnet => ethereum
      wormholeChainId = 2;
      break;
    case 1:
      //ethereum mainnet => ethereum
      wormholeChainId = 2;
      break;
    case 80001:
      //mumbai testnet => polygon
      wormholeChainId = 5;
      break;
    case 137:
      //polygon mainnet => polygon
      wormholeChainId = 5;
      break;
    default:
      throw new Error('Invalid chainId');
  }
  return (
    CONTRACTS[testnet ? 'TESTNET' : 'MAINNET'][
      coalesceChainName(wormholeChainId)
    ].token_bridge || ''
  );
}
function isTesnetByChainId(chainId: number) {
  switch (chainId) {
    case 5:
      //goerli testnet
      return true;
    case 1:
      //ethereum mainnet
      return false;
    case 80001:
      //mumbai testnet
      return true;
    case 137:
      //polygon mainnet
      return false;
    default:
      throw new Error('Invalid chainId');
  }
}

export {
  getContractsAddresses,
  getWormholeTokenBridgeAddress,
  isTesnetByChainId,
};
