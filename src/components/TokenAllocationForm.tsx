import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useSetAllocation } from '@/hooks/useSetAllocation';

export function TokenAllocationForm() {
  const { address } = useAccount();
  const { setAllocation, isPending } = useSetAllocation();
  
  const [tokenAddress, setTokenAddress] = useState('');
  const [allocation, setAllocationValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (!tokenAddress || !allocation) {
        throw new Error('Please fill in all fields');
      }

      if (!tokenAddress.startsWith('0x') || tokenAddress.length !== 42) {
        throw new Error('Invalid token address format');
      }

      const allocationValue = parseFloat(allocation);
      if (isNaN(allocationValue) || allocationValue < 0 || allocationValue > 100) {
        throw new Error('Allocation must be between 0 and 100');
      }

      // Convert percentage to basis points (e.g., 5% -> 500 basis points)
      const basisPoints = Math.floor(allocationValue * 100);
      
      // This will trigger the wallet confirmation
      await setAllocation(tokenAddress as `0x${string}`, BigInt(basisPoints));
      
      // Reset form after successful transaction
      setTokenAddress('');
      setAllocationValue('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    }
  };

  return (
    <div className="bg-background-light rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="tokenAddress" className="block text-gray-400 mb-1">
            Token Address
          </label>
          <input
            id="tokenAddress"
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder="0x..."
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
            disabled={isPending}
          />
        </div>
        
        <div>
          <label htmlFor="allocation" className="block text-gray-400 mb-1">
            Allocation (%)
          </label>
          <input
            id="allocation"
            type="number"
            value={allocation}
            onChange={(e) => setAllocationValue(e.target.value)}
            placeholder="0-100"
            step="0.01"
            min="0"
            max="100"
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            disabled={isPending}
          />
          <p className="text-gray-400 text-sm mt-1">
            Enter a value between 0 and 100. Setting to 0 will remove the token from the portfolio.
          </p>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-primary hover:bg-primary-600 disabled:bg-primary-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl"
        >
          {isPending ? 'Confirm in Wallet...' : 'Set Allocation'}
        </button>
      </form>
    </div>
  );
} 