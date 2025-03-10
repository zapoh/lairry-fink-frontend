import { useReadContract, useChainId } from 'wagmi';
import { FUND_CONTRACT_ABI, FUND_CONTRACT_ADDRESS } from '@/constants/contracts';
import { useEffect, useState } from 'react';

interface Token {
  address: string;
  symbol: string;
  balance: string;
}

export function useContractTokens() {
  const chainId = useChainId();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Start with false to show placeholders immediately
  const [isError, setIsError] = useState(false);

  // Get portfolio from contract
  const { data: portfolio, isError: isPortfolioError, isLoading: isPortfolioLoading } = useReadContract({
    address: FUND_CONTRACT_ADDRESS,
    abi: FUND_CONTRACT_ABI,
    functionName: 'getPortfolio',
    chainId,
    query: {
      enabled: Boolean(chainId),
      retry: 1,
    }
  });

  useEffect(() => {
    // Only set loading to true if we're actually loading data
    if (isPortfolioLoading) {
      setIsLoading(true);
    }

    if (isPortfolioError) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    if (!isPortfolioLoading && portfolio) {
      try {
        // Based on the contract, getPortfolio returns a tuple of arrays:
        // [tokenAddresses[], allocations[], symbols[], balances[], values[]]
        const [tokenAddresses, allocations, symbols, balances] = portfolio as unknown as [
          readonly `0x${string}`[],
          readonly bigint[],
          readonly string[],
          readonly bigint[]
        ];
        
        const formattedTokens: Token[] = [];
        
        for (let i = 0; i < tokenAddresses.length; i++) {
          formattedTokens.push({
            address: tokenAddresses[i],
            symbol: symbols[i] || 'Unknown',
            balance: balances[i].toString(),
          });
        }
        
        setTokens(formattedTokens);
        setIsLoading(false);
      } catch (error) {
        console.error('Error formatting token data:', error);
        setIsError(true);
        setIsLoading(false);
      }
    } else if (!isPortfolioLoading) {
      // If we're not loading and have no data, just set loading to false
      setIsLoading(false);
    }
  }, [portfolio, isPortfolioLoading, isPortfolioError]);

  return {
    tokens,
    isLoading,
    isError
  };
} 