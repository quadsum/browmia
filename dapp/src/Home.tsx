import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import './index.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Background Image */}
      <div className="background-image" />

      {/* Banner Content */}
      <div className="banner">
        <h1 className="main-title">
          The First Decentralized
          <br />
          AI BROWSER MARKETPLACE
        </h1>
        <button className="cta-button" onClick={() => navigate('/explore')}>
          Explore
        </button>
      </div>

      <div className="overlay" />
    </div>
  );
};

export default Home;