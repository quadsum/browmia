import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import './index.css';

interface BrowserWindow {
  id: number;
  size: number;
  left: number;
  top: number;
  content: React.ReactNode;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [windows, setWindows] = useState<BrowserWindow[]>([]);

  useEffect(() => {
    // Create browser windows
    const contentTypes = [
      <iframe 
        key="yt"
        src="https://www.youtube.com/embed/9bZkp7q19f0?autoplay=1&mute=1&controls=0"
        frameBorder="0"
      />,
      <div key="terminal" style={{
        background: '#000', 
        padding: '10px', 
        color: '#0f0', 
        fontFamily: 'monospace'
      }}>
        {"> Loading AI modules...<br/>> Initializing neural network...<br/>> Establishing decentralized connection..."}
      </div>,
      <iframe
        key="google"
        src="https://www.google.com/search?q=decentralized+ai&igu=1"
        style={{ opacity: 0.3 }}
      />
    ];

    const newWindows = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      size: 200 + Math.random() * 300,
      left: Math.random() * 100,
      top: Math.random() * 100,
      content: contentTypes[Math.floor(Math.random() * contentTypes.length)]
    }));

    setWindows(newWindows);
  }, []);

  return (
    <div className="home">
      <div className="banner">
        <h1 className="main-title">The First Decentralized<br/>AI BROWSER MARKETPLACE</h1>
        <button 
          className="cta-button"
          onClick={() => navigate('/explore')}
        >
          Explore
        </button>
      </div>

      {windows.map((window) => (
        <div 
          key={window.id}
          className="browser-window"
          style={{
            width: `${window.size}px`,
            height: `${window.size}px`,
            left: `${window.left}vw`,
            top: `${window.top}vh`
          }}
        >
          <div className="browser-content">
            {window.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;