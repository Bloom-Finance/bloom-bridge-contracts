# Bloom Bridge Contracts

Bloom Bridge are a set of contracts that allow users to bridge between two different chains 🤯🤯

For more information visit [Wormhole 🪱](https://wormhole.com/)

### Supported tokens 💰

- DAI

## Testing 🧪

All testing has been done using several testnets, including:

- [Polygon](https://mumbai.polygonscan.com/)
- [Ethereum](https://goerli.etherscan.io/)

### Last stable testnet contracts in goerli ⚙️

- [Bloom Bridge 🌉](https://goerli.etherscan.io/address/0x2f0f7FE6A18B99c191b06e64de4F35A15FfdF9a4): 0x2f0f7FE6A18B99c191b06e64de4F35A15FfdF9a4

### Addresses in different chains 📃

If you want to have the several addresses in different chains, you can check them in the [Contracts json](contracts.json)

### How to use in Testnet 🤔

1.  Create your own .env file
2.  Add the specified keys to your .env file
3.  Run `yarn install` or `npm install`
4.  Run the following command to compile and deploy the contract:

```shell
npx hardhat compile
npm run deploy:testnet:goerli
```

### Environment variables 📝

| Item                  |                                                  Value |
| --------------------- | -----------------------------------------------------: |
| BSC_TESTNET_RPC       |                             Add your RPC Server in BSC |
| GOERLI_TESTNET_RPC    |                          Add your RPC Server in GOERLI |
| RPC_MUMBAI            |                          Add your RPC Server in MUMBAI |
| ETHERSCAN_API_KEY     |                          Api key provided by etherscan |
| BSC_API_KEY           |                            Api key provided by bscscan |
| POLYGONSCAN_API_KEY   |                        Api key provided by polygonscan |
| COINMARKETCAP_API_KEY | Api key provided by coinmarketcap for the gas reporter |
| PRIVATE_KEY           |                                Your wallet private key |
