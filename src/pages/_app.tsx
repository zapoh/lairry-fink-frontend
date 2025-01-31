import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Web3Provider } from "@/providers/Web3Provider";
import { Inter } from "next/font/google";
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ["latin"] });

// Disable SSR for Web3Provider
const Web3ProviderNoSSR = dynamic(
  () => import('@/providers/Web3Provider').then(mod => mod.Web3Provider),
  { ssr: false }
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3ProviderNoSSR>
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
    </Web3ProviderNoSSR>
  );
}
