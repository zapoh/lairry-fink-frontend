import { useState } from 'react';

interface Token {
  address: string;
  symbol: string;
  balance: string;
}

// Placeholder data for demonstration
const placeholderTokens: Token[] = [
  { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'DAI', balance: '25,000.00' },
  { address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', symbol: 'LINK', balance: '1,250.75' },
  { address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', symbol: 'AAVE', balance: '89.50' },
  { address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e', symbol: 'YFI', balance: '2.35' },
  { address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F', symbol: 'SNX', balance: '1,875.20' },
  { address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', symbol: 'MKR', balance: '12.75' },
  { address: '0xc00e94Cb662C3520282E6f5717214004A7f26888', symbol: 'COMP', balance: '45.30' },
  { address: '0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55', symbol: 'BAND', balance: '750.00' },
  { address: '0xD533a949740bb3306d119CC777fa900bA034cd52', symbol: 'CRV', balance: '5,280.15' }
];

export function ContractTokens() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  
  // Use placeholder data directly
  const tokens = placeholderTokens;

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedAddress(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  return (
    <div className="bg-background-light rounded-lg p-6">
      {tokens.length === 0 ? (
        <div className="text-primary-300">
          No unallocated tokens found in contract
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-primary-300 border-b border-background">
                <th className="pb-2 text-left">Token</th>
                <th className="pb-2 text-right">Address</th>
                <th className="pb-2 text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token: Token, index: number) => (
                <tr key={index} className="text-white border-b border-background">
                  <td className="py-3 text-left">{token.symbol}</td>
                  <td 
                    className="py-3 text-right font-mono text-sm cursor-pointer group relative"
                    onClick={() => handleCopyAddress(token.address)}
                  >
                    <span className="hover:text-primary transition-colors">
                      {token.address.substring(0, 6)}...{token.address.substring(token.address.length - 4)}
                    </span>
                    
                    {/* Tooltip */}
                    <span 
                      className={`absolute right-0 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                        copiedAddress === token.address ? 'opacity-100' : ''
                      }`}
                    >
                      {copiedAddress === token.address ? 'Copied!' : 'Click to copy'}
                    </span>
                  </td>
                  <td className="py-3 text-right">{token.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 