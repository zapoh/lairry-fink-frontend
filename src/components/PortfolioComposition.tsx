import { usePortfolio } from '@/hooks/usePortfolio';
import { useNetAssetValue } from '@/hooks/useNetAssetValue';
import { formatEther } from 'viem';

export function PortfolioComposition() {
  const { portfolio, isLoading, isError } = usePortfolio();
  const { netAssetValue, isLoading: isLoadingNAV } = useNetAssetValue();

  if (isLoading || isLoadingNAV) {
    return (
      <div className="animate-pulse text-primary-300">
        Loading portfolio...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500">
        Error loading portfolio data
      </div>
    );
  }

  return (
    <div className="bg-background-light rounded-lg p-6">
      <h2 className="text-base font-semibold text-primary mb-6">ETF Portfolio Composition</h2>
      <div className="space-y-4">
        {portfolio.length === 0 ? (
          <>
            <div className="grid grid-cols-4 text-sm text-primary-300 border-b border-background pb-2">
              <div>Token</div>
              <div className="text-right">Allocation</div>
              <div className="text-right">Balance</div>
              <div className="text-right">Value</div>
            </div>
            <div className="grid grid-cols-4 text-white">
              <div>Unallocated ETH</div>
              <div className="text-right">100%</div>
              <div className="text-right">{Number(formatEther(netAssetValue)).toFixed(4)}</div>
              <div className="text-right">{Number(formatEther(netAssetValue)).toFixed(4)} ETH</div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-4 text-sm text-primary-300 border-b border-background pb-2">
              <div>Token</div>
              <div className="text-right">Allocation</div>
              <div className="text-right">Balance</div>
              <div className="text-right">Value</div>
            </div>
            
            {portfolio.map((item, index) => (
              <div key={index} className="grid grid-cols-4 text-white">
                <div>{item.symbol}</div>
                <div className="text-right">{item.allocation}%</div>
                <div className="text-right">{item.balance}</div>
                <div className="text-right">{Number(item.value).toFixed(2)} ETH</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
} 