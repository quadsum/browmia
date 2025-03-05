import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { ProviderCard } from "./components/ProviderCard";
import { useNavigate } from "react-router-dom";

interface Provider {
  name: string;
  description: string;
  uptime: number;
  address: string
}

const providers: Provider[] = [
  {
    address: '0xbeef',
    name: "Browmia Foundation",
    description: "Privacy-focused AI browser with built-in ad blocker, proxy and crypto wallet",
    uptime: 99.9,
  },
  {
    address: '0xabc',
    name: "Freenet",
    description: "Censorship-resistant AI browser with LLM support",
    uptime: 99.9,
  },
];

const App: React.FC = () => {
  const navigate = useNavigate();

  const [currentProviders, setCurrentProviders] = useState<Provider[]>(providers);
  const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const handleLaunch = async (providerName: string, model: string) => {
    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }
    
    try {

      // Prepare the message to sign
      const message = `
      I accept the Browmia Terms of Service at https://app.browmia.xyz/terms

      URI https://app.browmia.xyz
      Version 1
      Chain ID
      Provider ${providerName}
      Nonce 0000000
      Issued at ${Date.now()}
      `;
      // Sign the message
      const signature = await signMessageAsync({ message });

      //console.log("Signature:", signature);

      // Simulate API call (replace with actual backend endpoint)
      // const response = await fetch("", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     provider: providerName,
      //     address: address,
      //     config: {model},
      //     signature: signature,
      //     message: message,
      //   }),
      // });

      //if (response.ok) {
        const browserURL= `https://browmia-agent.duckdns.org/?token=${signature}`
        const agentURL= `wss://browmia-agent.duckdns.org/ws?token=${signature}`
        navigate(`/browser/${address}`, {state: {browserURL, agentURL}})

      // } else {
      //   console.error("Failed to launch. Please try again.");
      // }
    } catch (error) {
      console.error("Error during launch:", error);
    }
  };


  return (
    <div className="App">
      <div className="container">
      <h1 className="marketplace-title">Explore Providers</h1>

      {providers.map((provider, index) => (
        <ProviderCard key={index} provider={provider} onLaunch={handleLaunch} />
      ))}
      </div>

    </div>
  );
};

export default App;