import { useWriteContract } from 'wagmi';
import { FUND_CONTRACT_ABI, FUND_CONTRACT_ADDRESS } from '@/constants/contracts';
import { parseEther } from 'viem';

export function useDeposit() {
  const { writeContract, isError, isPending } = useWriteContract();

  const deposit = async (amount: string) => {
    const value = parseEther(amount);
    
    const hash = await writeContract({
      address: FUND_CONTRACT_ADDRESS,
      abi: FUND_CONTRACT_ABI,
      functionName: 'deposit',
      value,
    });

    return hash;
  };

  return {
    deposit,
    isError,
    isPending
  };
} 