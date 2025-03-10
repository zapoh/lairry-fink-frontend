import { useWriteContract } from 'wagmi';
import { FUND_CONTRACT_ABI, FUND_CONTRACT_ADDRESS } from '@/constants/contracts';

export function useSetAllocation() {
  const { writeContract, isPending, isError } = useWriteContract();

  const setAllocation = async (tokenAddress: `0x${string}`, allocation: bigint) => {
    const hash = await writeContract({
      address: FUND_CONTRACT_ADDRESS,
      abi: FUND_CONTRACT_ABI,
      functionName: 'setAllocation',
      args: [tokenAddress, allocation],
    });

    return hash;
  };

  return {
    setAllocation,
    isPending,
    isError
  };
} 