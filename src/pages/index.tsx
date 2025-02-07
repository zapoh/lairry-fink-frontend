import { useAccount } from 'wagmi'
import { ETFStats } from '@/components/ETFStats'
import { PortfolioComposition } from '@/components/PortfolioComposition'
import { ShareBalance } from '@/components/ShareBalance'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 flex flex-col py-8">
        {isConnected ? (
          <div className="space-y-6">
            <ShareBalance />
            <ETFStats />
            <PortfolioComposition />
          </div>
        ) : (
          <div className="h-full flex flex-col py-24 justify-center gap-14">
            <div className="text-center space-y-14">
              <p className="text-gray-100 text-6xl font-bold">
                Fully onchain, AI-controlled ETF.
              </p>
              <p className="text-gray-100 text-4xl font-bold">
                Get diversified exposure to new token launches handpicked by <span className="text-primary">L<span className="text-white">(ai)</span>rry Fink</span>
              </p>
            </div>
            <div className="flex justify-center py-12 gap-20">
              <div className="scale-150 origin-center">
                <ConnectButton />
              </div>
              <a 
                href="https://docs.lairryfink.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="scale-150 origin-center px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200 rounded-xl"
              >
                Learn More
              </a>
            </div>
            <div className="w-full">
              <ETFStats />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
