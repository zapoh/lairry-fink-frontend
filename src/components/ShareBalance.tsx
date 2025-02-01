import { useShareBalance } from '@/hooks/useShareBalance';
import { useSharePrice } from '@/hooks/useSharePrice';
import { useDeposit } from '@/hooks/useDeposit';
import { useWithdraw } from '@/hooks/useWithdraw';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import { Modal } from './Modal';

export function ShareBalance() {
  const { isConnected } = useAccount();
  const { shareBalance, isError, isLoading } = useShareBalance();
  const { formattedPrice, isLoading: isPriceLoading } = useSharePrice();
  const { deposit, isPending: isDepositPending } = useDeposit();
  const { withdraw, isPending: isWithdrawPending } = useWithdraw();
  
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
    if (!ethAmount || Number(ethAmount) <= 0 || !formattedPrice) {
      setEstimatedShares('0');
      return;
    }
    // Calculate shares using current share price
    const shares = (Number(ethAmount) * 100_000_000) / formattedPrice;
    setEstimatedShares(Math.floor(shares).toLocaleString());
  };

  if (!isConnected) {
    return null;
  }

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

  const sharesValue = Number(shareBalance) * formattedPrice;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-2xl font-bold text-gray-400">
          My Shares: {Number(shareBalance).toLocaleString()}
        </div>
        <div className="text-2xl font-bold text-gray-400">
          Shares Value: {sharesValue.toFixed(4)} ETH
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setIsDepositOpen(true)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
        >
          Deposit
        </button>
        <button
          onClick={() => setIsWithdrawOpen(true)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
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
          <p className="text-gray-400">
            Deposit ETH to mint ETF Shares to gain exposure to the current portfolio and all future airdrops
          </p>
          
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
        title="Withdraw Shares"
      >
        <div className="space-y-4">
          <div className="text-sm text-gray-400 mb-2">
            Available Shares: {Number(shareBalance).toLocaleString()}
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