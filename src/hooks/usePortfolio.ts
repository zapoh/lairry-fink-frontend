import { useReadContracts, useChainId } from 'wagmi';
import { FUND_CONTRACT_ABI, FUND_CONTRACT_ADDRESS } from '@/constants/contracts';
import { formatEther, formatUnits } from 'viem';

export interface PortfolioItem {
  symbol: string;
  allocation: number;    // percentage (0-100)
  balance: string;      // formatted token balance
  value: string;        // formatted ETH value
}

// Token decimals mapping
const TOKEN_DECIMALS: { [address: string]: number } = {
  "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238": 6, // USDC - stored in lowercase
  // Add other token addresses and their decimals as needed
};

export function usePortfolio() {
  const chainId = useChainId();

  const { data: contractData, isError, isLoading } = useReadContracts({
    contracts: [
      {
        address: FUND_CONTRACT_ADDRESS,
        abi: FUND_CONTRACT_ABI,
        functionName: 'getPortfolio',
        chainId,
      },
      {
        address: FUND_CONTRACT_ADDRESS,
        abi: FUND_CONTRACT_ABI,
        functionName: 'getReserveTokenBalance',
        chainId,
      },
      {
        address: FUND_CONTRACT_ADDRESS,
        abi: FUND_CONTRACT_ABI,
        functionName: 'getTotalAllocation',
        chainId,
      }
    ],
  });

  if (!contractData || isError) {
    return {
      portfolio: [] as PortfolioItem[],
      isError,
      isLoading,
    };
  }

  // Extract data from the responses
  const [portfolioData, reserveBalance, totalAllocation] = contractData;
  
  if (!portfolioData.result) {
    return {
      portfolio: [],
      isError,
      isLoading,
    };
  }

  // Destructure the portfolio data
  const [addresses, allocations, symbols, balances, values] = portfolioData.result;

  // Helper function to format token balance based on decimals
  const formatTokenBalance = (balance: bigint, tokenAddress: string, isEth = false): string => {
    // Convert address to lowercase for comparison
    const normalizedAddress = tokenAddress.toLowerCase();
    const decimals = TOKEN_DECIMALS[normalizedAddress] || 18;
    
    console.log('Token decimals lookup:', {
      originalAddress: tokenAddress,
      normalizedAddress,
      foundDecimals: decimals,
      hasMapping: normalizedAddress in TOKEN_DECIMALS
    });
    
    const formatted = formatUnits(balance, decimals);
    
    console.log('Formatting token balance:', {
      tokenAddress,
      decimals,
      rawBalance: balance.toString(),
      formattedUnits: formatted,
      isEth
    });
    
    // Only show decimals for Unallocated ETH
    if (isEth) {
      return Number(formatted).toFixed(4);
    }
    
    // For non-ETH tokens, format as whole numbers
    const numericValue = Number(formatted);
    console.log('Numeric value:', numericValue);
    
    const formattedValue = numericValue.toLocaleString(undefined, {
      maximumFractionDigits: 0
    });
    console.log('Final formatted value:', formattedValue);
    
    return formattedValue || '0'; // Ensure we return '0' instead of empty string
  };

  // Process the allocated tokens data
  const allocatedPortfolio: PortfolioItem[] = symbols.map((symbol, index) => {
    console.log(`Processing ${symbol}:`, {
      address: addresses[index],
      rawBalance: balances[index].toString(),
      allocation: allocations[index].toString()
    });
    
    return {
      symbol,
      allocation: Number(allocations[index]) / 100,
      balance: formatTokenBalance(balances[index], addresses[index]),
      value: Number(formatEther(values[index])).toFixed(4),
    };
  });

  // Update the unallocated ETH push to use decimal formatting
  if (reserveBalance.result && totalAllocation.result) {
    const unallocatedPercent = 100 - (Number(totalAllocation.result) / 100);
    if (Number(reserveBalance.result) > 0n) {
      allocatedPortfolio.push({
        symbol: 'Unallocated ETH',
        allocation: unallocatedPercent,
        balance: formatTokenBalance(reserveBalance.result, FUND_CONTRACT_ADDRESS, true), // true for ETH formatting
        value: Number(formatEther(reserveBalance.result)).toFixed(4),
      });
    }
  }

  return {
    portfolio: allocatedPortfolio,
    isError,
    isLoading,
  };
} 