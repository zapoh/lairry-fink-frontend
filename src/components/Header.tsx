import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FaBook, FaXTwitter } from 'react-icons/fa6';

export function Header() {
  return (
    <header className="border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-white">
        L(ai)rry Fink&apos;s ETF
        </div>
        <div className="flex items-center gap-6">
          <a 
            href="https://docs.lairryfink.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaBook size={20} />
          </a>
          <a 
            href="https://x.com/lairryfink" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaXTwitter size={20} />
          </a>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
} 