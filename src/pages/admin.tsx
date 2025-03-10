import { useAccount } from 'wagmi';
import { Header } from '@/components/Header';
import { PortfolioComposition } from '@/components/PortfolioComposition';
import { Footer } from '@/components/Footer';
import { TokenAllocationForm } from '@/components/TokenAllocationForm';
import { ContractTokens } from '@/components/ContractTokens';

export default function AdminPage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {isConnected ? (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-primary">ETF Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold text-gray-100 mb-4">Set Token Allocation</h2>
                <TokenAllocationForm />
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-gray-100 mb-4">Current ETF Composition</h2>
                <PortfolioComposition />
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-100 mb-4">Received Unallocated Tokens</h2>
              <ContractTokens />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-500">Admin Access Required</h1>
              <p className="text-gray-400 mt-2">Please connect your wallet to access the admin dashboard.</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 