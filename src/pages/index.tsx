import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import Head from 'next/head'
import { PortfolioView } from '@/components/PortfolioView'
import { NavDisplay } from '@/components/NavDisplay'


export default function Home() {
  const { isConnected } = useAccount()

  return (
    <>
      <Head>
        <title>Lairry Fink ETF</title>
        <meta name="description" content="DeFi Mutual Fund Interface" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-black">
        <nav className="bg-black border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-white">Lairry Fink ETF</h1>
              </div>
              <div>
                <ConnectButton />
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <NavDisplay />
          </div>
          {!isConnected ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Welcome to DeFi Fund
              </h2>
              <p className="text-gray-400 mb-8">
                Connect your wallet to view the fund dashboard
              </p>
            </div>
          ) : (
            <div className="space-y-8">
            <PortfolioView />
          </div>
          )}
        </main>
      </div>
    </>
  )
}
