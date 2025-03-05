// Update ProviderCard component with memoization
import React, { useState } from 'react';
import { SettingsIcon } from './SettingsIcon';
import { SettingsModal } from './SettingsModal';

interface ProviderCardProps {
  provider: {
    name: string;
    description: string;
    uptime: number;
  };
  onLaunch: (providerName: string, selectedModel: string) => void;

}



export const ProviderCard = React.memo<ProviderCardProps>(({ provider, onLaunch }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Nillion SecretLLM (Olama)');


  const handleLaunch = () => {
    onLaunch(provider.name, selectedModel);
  };

  return (
    <div className="card">
      <div className="settings-button" onClick={() => setIsSettingsOpen(true)}>
        <SettingsIcon />
      </div>
      
      <div className="status-indicator"></div>
      <h2>{provider.name}</h2>
      <p>{provider.description}</p>
      <button className="launch-button" onClick={handleLaunch}>
        Launch Browser
      </button>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedModel={selectedModel}
        onSelect={setSelectedModel}
      />
    </div>
  );
});