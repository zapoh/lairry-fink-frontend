import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { FUND_CONTRACT_ABI, FUND_CONTRACT_ADDRESS } from '@/constants/contracts';

export function useWithdraw() {
  const { writeContract, isError, isPending } = useWriteContract();
  const { address } = useAccount();

  const withdraw = async (shares: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    const hash = await writeContract({
      address: FUND_CONTRACT_ADDRESS,
      abi: FUND_CONTRACT_ABI,
      functionName: 'withdraw',
      args: [BigInt(shares), address], // Convert shares to BigInt and use connected wallet address
    });

    return hash;
  };

  return {
    withdraw,
    isError,
    isPending
  };
} 