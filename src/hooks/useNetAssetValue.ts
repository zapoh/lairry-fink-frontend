import { useReadContract, useChainId } from 'wagmi';
import { FUND_CONTRACT_ABI, FUND_CONTRACT_ADDRESS } from '@/constants/contracts';

export function useNetAssetValue() {
  const chainId = useChainId();

  const { data, isError, isLoading } = useReadContract({
    address: FUND_CONTRACT_ADDRESS,
    abi: FUND_CONTRACT_ABI,
    functionName: 'getNetAssetValue',
    chainId,
    query: {
      enabled: Boolean(chainId), // Only run query when chainId is available
    }
  }) as { data: bigint | undefined, isError: boolean, isLoading: boolean };

  // Check if we're on the wrong network
  const isWrongNetwork = chainId !== Number(process.env.NEXT_PUBLIC_CHAIN_ID);

  return {
    netAssetValue: data || 0n,
    isError: isError || isWrongNetwork,
    isLoading: isLoading && !isWrongNetwork
  };
} 