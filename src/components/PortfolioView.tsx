import { usePortfolio } from '@/hooks/usePortfolio';

export function PortfolioView() {
  const { portfolio, isError, isLoading } = usePortfolio();

  if (isLoading) {
    return (
      <div className="animate-pulse text-gray-400">
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

  if (portfolio.length === 0) {
    return (
      <div className="text-gray-400">
        No assets in portfolio
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Portfolio Composition</h2>
      <div className="space-y-4">
        {/* Header */}
        <div className="grid grid-cols-4 text-sm text-gray-400 border-b border-gray-800 pb-2">
          <div>Token</div>
          <div className="text-right">Allocation</div>
          <div className="text-right">Balance</div>
          <div className="text-right">Value</div>
        </div>
        
        {/* Portfolio Items */}
        {portfolio.map((item, index) => (
          <div key={index} className="grid grid-cols-4 text-white">
            <div>{item.symbol}</div>
            <div className="text-right">{item.allocation}%</div>
            <div className="text-right">{item.balance}</div>
            <div className="text-right">{item.value} ETH</div>
          </div>
        ))}
      </div>
    </div>
  );
} 