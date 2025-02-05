import { useMemo } from 'react';
import {  getWalletClient } from 'wagmi/actions';
import { FUND_CONTRACT_ABI, FUND_CONTRACT_ADDRESS } from '@/constants/contracts';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

export function useContract() {
  const contract = useMemo(() => {
    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http()
    });

    return {
      read: publicClient.contract({
        address: FUND_CONTRACT_ADDRESS,
        abi: FUND_CONTRACT_ABI,
      }),
      write: async () => {
        const walletClient = await getWalletClient();
        return walletClient?.contract({
          address: FUND_CONTRACT_ADDRESS,
          abi: FUND_CONTRACT_ABI,
        });
      }
    };
  }, []);

  return contract;
} 