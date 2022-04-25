import { useContract } from '@starknet-react/core'
import { Abi } from 'starknet'

import DaiStrategyABI from '~/abi/DaiStrategy.json'
import ETHStrategyABI from '~/abi/EthStrategy.json'
import USDCStrategyABI from '~/abi/UsdcStrategy.json'
import ERC20ABI from '~/abi/erc20.json' 

export function useUSDCTokenContract() {
  return useContract({
    abi: ERC20ABI as Abi,
    address: '0x000cf1f2891ce07dfff3fa1828b5c4cc01ccc603876b913d9e6fc89bad276ba7',
  })
}
export function useETHTokenContract() {
  return useContract({
    abi: ERC20ABI as Abi,
    address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
  })
}

export function useDaiTokenContract() {
  return useContract({
    abi: ERC20ABI as Abi,
    address: '0x04831207050e4b35a50dbb51a389b336c97720f4fd1fdf489b92dab9409baf99',
  })
}

export function useXbankETHStrategyContract() {
  return useContract({
    abi: ETHStrategyABI as Abi,
    address: '0x027e8e3d393926f359d7a34ff56874040f04a04e848c72b6eb8b798950702be3',
  })
}

export function useXbankUSDCStrategyContract() {
  return useContract({
    abi: USDCStrategyABI as Abi,
    address: '0x057fac9dee4a9a92c5537a60dd4ed6accf3ab75a74872177b771384b9d992642',
  })
}

export function useXbankDaiStrategyContract() {
  return useContract({
    abi: DaiStrategyABI as Abi,
    address: '0x02f4d29b173e7edda25bce02f71686f6a753b3cd16c6f7473a446ccab51d8e87',
  })
}