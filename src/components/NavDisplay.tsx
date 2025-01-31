import { useNetAssetValue } from '@/hooks/useNetAssetValue';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';

export function NavDisplay() {
  const { isConnected } = useAccount();
  const { netAssetValue, isError, isLoading } = useNetAssetValue();
  
  // If not connected, show placeholder
  if (!isConnected) {
    return (
      <div className="text-right">
        <span className="text-gray-600">NAV: </span>
        <span className="font-bold">--.---- ETH</span>
      </div>
    );
  }

  // If error, show error state
  if (isError) {
    return (
      <div className="text-right">
        <span className="text-gray-600">NAV: </span>
        <span className="font-bold text-red-500">Error</span>
      </div>
    );
  }

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="text-right">
        <span className="text-gray-600">NAV: </span>
        <span className="font-bold animate-pulse">Loading...</span>
      </div>
    );
  }
  
  // Format NAV to 4 decimal places
  const formattedNav = Number(formatEther(netAssetValue)).toFixed(4);
  
  return (
    <div className="text-right">
      <span className="text-gray-600">NAV: </span>
      <span className="font-bold">{formattedNav} ETH</span>
    </div>
  );
} 