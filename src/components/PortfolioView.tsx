import React from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useNetAssetValue } from '@/hooks/useNetAssetValue';
import { useSharePrice } from '@/hooks/useSharePrice';
import { useSharesOutstanding } from '@/hooks/useSharesOutstanding';
import { formatEther } from 'viem';
import { ShareBalance } from '@/components/ShareBalance';

export function PortfolioView() {
  const { portfolio, isError, isLoading } = usePortfolio();
  const { netAssetValue, isLoading: isLoadingNAV } = useNetAssetValue();
  const { formattedPrice, isLoading: isLoadingPrice } = useSharePrice();
  const { sharesOutstanding, isLoading: isLoadingShares } = useSharesOutstanding();

  if (isLoading || isLoadingNAV || isLoadingPrice || isLoadingShares) {
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

  return (
    <div className="space-y-6">
      <ShareBalance />
      {/* Key Metrics Bar */}
      <div className="grid grid-cols-3 gap-4 bg-gray-900 p-4 rounded-lg">
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

      {/* Portfolio Table */}
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Portfolio Composition</h2>
        <div className="space-y-4">
          {portfolio.length === 0 ? (
            <div className="text-gray-400">
              No assets in portfolio
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
} 