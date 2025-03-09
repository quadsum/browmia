import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './Home';
import Explore from './Explore';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Logo } from './components/Logo';
import { BrowserView } from './BrowserView';
import { RegisterOperatorModal } from './components/RegisterOperatorModal';


const App: React.FC = () => {
  const location = useLocation();
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  return (
    <div className="App">
      <header>
        <Logo />
        {location.pathname === '/explore' && (
          <button 
            className="register-operator-button"
            onClick={() => setRegisterModalOpen(true)}
          >
            Register Operator
          </button>
        )}
        <ConnectButton />

      </header>

      <RegisterOperatorModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setRegisterModalOpen(false)} 
      />

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