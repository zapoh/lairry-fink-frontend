import { useReadContract, useChainId, useAccount } from 'wagmi';
import { FUND_CONTRACT_ABI, FUND_CONTRACT_ADDRESS } from '@/constants/contracts';

export function useShareBalance() {
  const chainId = useChainId();
  const { address } = useAccount();

  const { data, isError, isLoading } = useReadContract({
    address: FUND_CONTRACT_ADDRESS,
    abi: FUND_CONTRACT_ABI,
    functionName: 'getShareBalance',
    args: [address || '0x0'],
    chainId,
    query: {
      enabled: Boolean(chainId && address),
    }
  });

  return {
    shareBalance: data || 0n,
    isError,
    isLoading
  };
} 