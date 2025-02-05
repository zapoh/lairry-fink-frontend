import { useNetAssetValue } from '@/hooks/useNetAssetValue';
import { useSharePrice } from '@/hooks/useSharePrice';
import { useSharesOutstanding } from '@/hooks/useSharesOutstanding';
import { formatEther } from 'viem';

export function ETFStats() {
  const { netAssetValue, isLoading: isLoadingNAV } = useNetAssetValue();
  const { formattedPrice, isLoading: isLoadingPrice } = useSharePrice();
  const { sharesOutstanding, isLoading: isLoadingShares } = useSharesOutstanding();

  if (isLoadingNAV || isLoadingPrice || isLoadingShares) {
    return (
      <div className="animate-pulse text-gray-400">
        Loading metrics...
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-base font-semibold text-gray-400 mb-6">ETF Metrics</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-gray-400 text-sm">Net Asset Value</div>
          <div className="text-white text-xl font-bold">
            {Number(formatEther(netAssetValue)).toFixed(4)} ETH
          </div>
        </div>
        <div className="text-center border-x border-gray-800">
          <div className="text-gray-400 text-sm">Share Price</div>
          <div className="text-white text-xl font-bold">
            {formattedPrice.toFixed(8)} ETH
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 text-sm">Shares Outstanding</div>
          <div className="text-white text-xl font-bold">
            {Number(sharesOutstanding).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
} 