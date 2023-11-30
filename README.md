# StarkYield

StarkYield is a yield maximier which you can use to earn more yield from your defi farming on StarkNet. 

For example : 

Jane wants to participate into ETH-USDC pool on Jediswap. With the reward tokens she will receive, she will get %20 APY on her participation if she sells the reward tokens before exiting the pool. With the help of Yield maximizer like StarkYield , she can maximize her APY b simply participating into Vault that auto compounds the rewards which means it is selling the rewards and adding it into the pool so that the amount increases together with the reward amount.

## Simple Overview

![alt_text](https://i.postimg.cc/V6VqTV39/Screen-Shot-2022-04-26-at-01-16-35.png)

## Contracts

StarkYield currently have 3 Strategies for XBank deployed on Starknet Goerli Testnet:

XbankDaiStrategy : 0x02f4d29b173e7edda25bce02f71686f6a753b3cd16c6f7473a446ccab51d8e87

XbankUsdcStrategy : 0x057fac9dee4a9a92c5537a60dd4ed6accf3ab75a74872177b771384b9d992642

XbankEthStrategy : 0x027e8e3d393926f359d7a34ff56874040f04a04e848c72b6eb8b798950702be3

## Future Development

- [ ] Move into ERC4626 Vault Standart
- [ ] SafeMath implementation for Uint256
- [ ] Reentrency guard
- [ ] More AMM Strategies
- [ ] More Lending Strategies
- [ ] Unit Tests

## Starting Up The UI

Go to UI directory with:

```bash
cd UI
```

Install dependencies with:

```bash
yarn install
```

Then start the development server:

```bash
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) with a browser where you have Argent X installed to interact with the dapp.

This was developed early stages of Cairo
