import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { phantomWallet } from '@rainbow-me/rainbowkit/wallets';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { WagmiProvider, http } from "wagmi";
import { monadTestnet, holesky } from "wagmi/chains";
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import '@rainbow-me/rainbowkit/styles.css'





const wagmiConfig = getDefaultConfig({
  wallets: [    {
    groupName: 'Recommended',
    wallets: [phantomWallet],
  },],
  appName: 'Browmia',
  projectId: 'Browmia',
  chains: [monadTestnet, holesky],
  transports: {
    [holesky.id]: http('https://holesky.drpc.org'),
    [monadTestnet.id]: http('https://testnet-rpc.monad.xyz'),
  },
})


const queryClient = new QueryClient()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
      <BrowserRouter>
        <App />
        </BrowserRouter>
      </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
