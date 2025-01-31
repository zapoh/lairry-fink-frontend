'use client';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { http, createConfig, WagmiConfig } from 'wagmi';
import { sepolia } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import '@rainbow-me/rainbowkit/styles.css';

// Ensure we're using Sepolia testnet
const chains = [sepolia] as const;

const config = createConfig({
  chains,
  transports: {
    [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`),
  },
});

const { wallets } = getDefaultWallets({
  appName: 'Lairry Fink ETF',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
});

export function Web3Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
} 