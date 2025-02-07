import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import dynamic from 'next/dynamic';
import Head from 'next/head';

const inter = Inter({ subsets: ["latin"] });

// Disable SSR for Web3Provider
const Web3ProviderNoSSR = dynamic(
  () => import('@/providers/Web3Provider'),
  { ssr: false }
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3ProviderNoSSR>
      <Head>
        <title>L(ai)rry Fink: AI-controlled ETF</title>
      </Head>
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
    </Web3ProviderNoSSR>
  );
}
