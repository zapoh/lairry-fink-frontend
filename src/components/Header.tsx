import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FaBook, FaXTwitter } from 'react-icons/fa6';
import { useAccount } from 'wagmi';

export function Header() {
  const { isConnected } = useAccount();

  return (
    <header className="border-b border-background-light">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-primary">
          {isConnected && (
            <>
              L<span className="text-white">(ai)</span>rry Fink
            </>
          )}
        </div>
        <div className="flex items-center gap-10">
          <a 
            href="https://docs.lairryfink.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className=" hover:text-primary-300 transition-colors"
          >
            <FaBook size={20} />
          </a>
          <a 
            href="https://x.com/lairryfink" 
            target="_blank" 
            rel="noopener noreferrer"
            className=" hover:text-primary-300 transition-colors"
          >
            <FaXTwitter size={20} />
          </a>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
} 