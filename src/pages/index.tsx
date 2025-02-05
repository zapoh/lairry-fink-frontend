import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import Head from 'next/head'
import { PortfolioView } from '@/components/PortfolioView'
import { formatEther } from 'ethers'
import { ETFStats } from '@/components/ETFStats'
import { PortfolioComposition } from '@/components/PortfolioComposition'
import { ShareBalance } from '@/components/ShareBalance'
import { Header } from '@/components/Header'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {isConnected ? (
          <div className="space-y-6">
            <ShareBalance />
            <ETFStats />
            <PortfolioComposition />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-gray-100 text-xl">Connect your wallet and deposit ETH to gain diversified exposure to projects handpicked by L(ai)rry Fink.</p>
              <p className="text-gray-100 text-xl">Check out <a href="https://docs.lairryfink.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">DOCS</a> to learn more.</p>
            </div>
            <div className="space-y-6">
              <ETFStats />
              <PortfolioComposition />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
