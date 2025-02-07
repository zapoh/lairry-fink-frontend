import { useShareBalance } from '@/hooks/useShareBalance';
import { useSharePrice } from '@/hooks/useSharePrice';
import { useSharesOutstanding } from '@/hooks/useSharesOutstanding';

import { useDeposit } from '@/hooks/useDeposit';
import { useWithdraw } from '@/hooks/useWithdraw';
import { useAccount, useBalance } from 'wagmi';
import { useState } from 'react';
import { Modal } from './Modal';

const DEPOSIT_FEE = 0.01; // 1% fee
const SCALAR = 100_000; // Initial shares per ETH

export function ShareBalance() {
  const { isConnected, address } = useAccount();
  const { shareBalance, isError, isLoading } = useShareBalance();
  const { formattedPrice, isLoading: isPriceLoading } = useSharePrice();
  const { deposit, isPending: isDepositPending } = useDeposit();
  const { withdraw, isPending: isWithdrawPending } = useWithdraw();
  const { data: ethBalance } = useBalance({
    address,
  });
  
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [estimatedShares, setEstimatedShares] = useState<string>('0');

  const handleDeposit = async () => {
    try {
      setError(null);
      if (!amount || Number(amount) <= 0) {
        throw new Error('Please enter a valid amount');
      }
      await deposit(amount);
      setIsDepositOpen(false);
      setAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    }
  };

  const handleWithdraw = async () => {
    try {
      setError(null);
      if (!amount || Number(amount) <= 0) {
        throw new Error('Please enter a valid number of shares');
      }
      if (Number(amount) > Number(shareBalance)) {
        throw new Error('Cannot withdraw more shares than you own');
      }
      await withdraw(amount);
      setIsWithdrawOpen(false);
      setAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    }
  };

  // Calculate estimated shares whenever amount changes
  const updateEstimatedShares = (ethAmount: string) => {
    if (!ethAmount || Number(ethAmount) <= 0) {
      setEstimatedShares('0');
      return;
    }

    // Apply deposit fee (1%)
    const amountAfterFee = Number(ethAmount) * (1 - DEPOSIT_FEE);
    
    // If no shares outstanding (initial deposit), use SCALAR
    if (!useSharesOutstanding) {
      const initialShares = amountAfterFee * SCALAR;
      setEstimatedShares(Math.floor(initialShares).toLocaleString());
      return;
    }

    // For subsequent deposits, use current share price
    const shares = amountAfterFee / formattedPrice;
    setEstimatedShares(Math.floor(shares).toLocaleString());
  };

  if (isLoading || isPriceLoading) {
    return (
      <div className="space-y-2">
        <div className="text-2xl font-bold animate-pulse">Loading shares...</div>
        <div className="text-2xl font-bold text-gray-400 animate-pulse">Loading value...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-2xl font-bold text-red-500">
        Error loading shares
      </div>
    );
  }

  const sharesValue = isConnected ? Number(shareBalance) * formattedPrice : 0;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-xl font-bold text-gray-100">
          My Shares: {isConnected ? Number(shareBalance).toLocaleString() : '0'}
        </div>
        <div className="text-xl font-bold text-gray-100">
          Shares Value: {isConnected ? sharesValue.toFixed(2) : '0.0000'} ETH
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setIsDepositOpen(true)}
          disabled={!isConnected}
          className="flex-1 bg-primary hover:bg-primary-600 disabled:bg-primary-800 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl"
        >
          Deposit
        </button>
        <button
          onClick={() => setIsWithdrawOpen(true)}
          disabled={!isConnected}
          className="flex-1 border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200 disabled:border-primary-800 disabled:text-primary-800 disabled:cursor-not-allowed font-bold py-3 px-6 rounded-xl"
        >
          Withdraw
        </button>
      </div>

      <Modal
        isOpen={isDepositOpen}
        onClose={() => {
          setIsDepositOpen(false);
          setAmount('');
          setError(null);
          setEstimatedShares('0');
        }}
        title="Deposit ETH"
      >
        <div className="space-y-6">
          <p className="text-gray-300">
            Deposit ETH and mint shares to gain proportional exposure to the current ETF portfolio and all future allocations
          </p>
          
          <div className="text-gray-400 text-sm">
            Available: {ethBalance ? Number(ethBalance.formatted).toFixed(4) : '0.0000'} ETH
          </div>
          
          <div className="space-y-2">
            <div>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  updateEstimatedShares(e.target.value);
                }}
                placeholder="Amount in ETH"
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                step="0.01"
                min="0"
                max={ethBalance ? Number(ethBalance.formatted) : 0}
              />
            </div>
            
            {amount && Number(amount) > 0 && (
              <div className="text-gray-400">
                You will receive approximately: <span className="text-white font-bold">{estimatedShares} shares</span>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <button
            onClick={handleDeposit}
            disabled={isDepositPending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg"
          >
            {isDepositPending ? 'Depositing...' : 'Deposit'}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isWithdrawOpen}
        onClose={() => {
          setIsWithdrawOpen(false);
          setAmount('');
          setError(null);
        }}
        title="Withdraw ETH"
      >
        <div className="space-y-4">
        <div className="text-gray-400">
            Upon withdrawal, your shares will be burned and the proportional underlying assets will be sold at current prices for ETH
          </div>
          <div className="flex items-center justify-between text-sm">
            <button 
              onClick={() => setAmount(shareBalance.toString())}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Available Shares: {Number(shareBalance).toLocaleString()}
            </button>
            <button
              onClick={() => setAmount(shareBalance.toString())}
              className="text-gray-400 hover:text-gray-300 text-sm ml-2"
            >
              max
            </button>
          </div>

          <div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Number of shares"
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              step="1"
              min="1"
              max={Number(shareBalance)}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
          <button
            onClick={handleWithdraw}
            disabled={isWithdrawPending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg"
          >
            {isWithdrawPending ? 'Withdrawing...' : 'Withdraw'}
          </button>
        </div>
      </Modal>
    </div>
  );
} 