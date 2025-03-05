import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Explore from './Explore';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Logo } from './components/Logo';
import { BrowserView } from './BrowserView';

const App: React.FC = () => {
  return (
    <div className="App">
      <header>
        <Logo />
        <ConnectButton />
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route
          path="/browser/:walletAddress"
          element={<BrowserView/>}
        />
      </Routes>
    </div>
  );
};

export default App;