import { usePublicClient, useWalletClient } from 'wagmi'
import { getContract } from 'viem'
import { FUND_CONTRACT_ABI, FUND_CONTRACT_ADDRESS } from '@/constants/contracts'

export function useContract() {
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  if (!publicClient) {
    return {
      read: null,
      write: null,
    }
  }

  return {
    read: getContract({
      address: FUND_CONTRACT_ADDRESS,
      abi: FUND_CONTRACT_ABI,
      client: publicClient,
    }),
    write: walletClient
      ? getContract({
          address: FUND_CONTRACT_ADDRESS,
          abi: FUND_CONTRACT_ABI,
          client: walletClient,
        })
      : null,
  }
} 