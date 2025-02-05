import { useReadContract, useChainId } from 'wagmi';
import { FUND_CONTRACT_ABI, FUND_CONTRACT_ADDRESS } from '@/constants/contracts';
import { formatUnits } from 'viem';

export function useSharePrice() {
  const chainId = useChainId();

  const { data, isError, isLoading } = useReadContract({
    address: FUND_CONTRACT_ADDRESS,
    abi: FUND_CONTRACT_ABI,
    functionName: 'getSharePrice',
    chainId,
    query: {
      enabled: Boolean(chainId),
    }
  });

  // Format using 18 decimals (ETH standard)
  const formattedPrice = data ? Number(formatUnits(data, 18)) : 0;

  console.log('Share Price Call:', {
    address: FUND_CONTRACT_ADDRESS,
    chainId,
    rawData: data?.toString(),
    formattedPrice,
    error: isError,
    loading: isLoading
  });

  return {
    sharePrice: data || 0n,
    formattedPrice,
    isError,
    isLoading
  };
} 