import { useReadContract, useChainId } from 'wagmi';
import { FUND_CONTRACT_ABI, FUND_CONTRACT_ADDRESS } from '@/constants/contracts';

export function useSharesOutstanding() {
  const chainId = useChainId();

  const { data, isError, isLoading } = useReadContract({
    address: FUND_CONTRACT_ADDRESS,
    abi: FUND_CONTRACT_ABI,
    functionName: 'getSharesOutstanding',
    chainId,
    enabled: Boolean(chainId), // Only run query when chainId is available
  });

  console.log('Shares Outstanding Call:', {
    address: FUND_CONTRACT_ADDRESS,
    chainId,
    data: data?.toString(),
    error: isError,
    loading: isLoading
  });

  // Convert bigint to string then to number to avoid precision issues
  const sharesValue = data ? Number(data.toString()) : 0;

  return {
    sharesOutstanding: sharesValue,
    isError,
    isLoading
  };
} 