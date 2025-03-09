// src/components/BrowserView.tsx
import { DeepChat } from 'deep-chat-react';
import { url } from 'inspector';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSignMessage } from 'wagmi';

interface ChatMessage {
  text: string;
  role: 'user' | 'ai';
}

export const BrowserView: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const chatElementRef = useRef<any>(null);
  const { signMessageAsync } = useSignMessage();

  const { state } = useLocation();
  const { walletAddress } = useParams<{ walletAddress: string }>();
  const browserURL= `https://browmia-operator-1.duckdns.org:4433/?token=${walletAddress}&url=wss://browmia-operator-1.duckdns.org:4433/proxy`
  const agentURL= `wss://browmia-operator-1.duckdns.org:4433/ws?token=${walletAddress}`


  useEffect(() => {
    let websocket: WebSocket | null = null;
    let retryTimeout: NodeJS.Timeout | null = null;
    if (chatElementRef.current) {

  chatElementRef.current.connect = {
    websocket: true,
    handler: (_:any, signals:any) => {
      const connectWebSocket = () => {

      try {
        websocket = new WebSocket(agentURL);
        websocket.onopen = () => {
          signals.onOpen(); // enables the user to send messages
        };
        websocket.onmessage = (message) => {
          const response:ChatMessage = {text: message.data, role: 'ai'}
          //setMessages(prev => [...prev, response])
          
          signals.onResponse(response); // displays a text message from the server
        };
        websocket.onclose = (event) => {          
          signals.onClose(); // stops the user from sending messages

         retryTimeout = setTimeout(() => {
            console.log('Reconnecting...')
            connectWebSocket();
          }, 5000);
        };
        websocket.onerror = (error) => {          
          signals.onResponse({error: 'Failed to connect. Retrying ...'});
        };
        // triggered when the user sends a message
        signals.newUserMessage.listener = (body:any) => {
          //setMessages(prev => [...prev, {text: body.messages[0].text, role: 'user'}])
          websocket?.send(JSON.stringify({text: body.messages[0].text, timestamp: new Date().toISOString()}));
        };
      } catch (e) {
        signals.onResponse({error: 'error'}); // displays an error message
        signals.onClose(); // stops the user from sending messages
      }
    }
    connectWebSocket();

    },
    
  }

}



return () => {
  if (websocket) {
    websocket.close();
  }
  if (retryTimeout) {
    clearTimeout(retryTimeout);
  }
}


}, [agentURL]);
  const decryptChat = async () => {
        await signMessageAsync({ message: 'I want to decrypt chat history' });   
    setIsDecrypted(true);
  };

  return (
    <div className="browser-container">
      <div className={`chat-sidebar ${isChatOpen ? 'open' : 'collapsed'}`}>
        <button 
          className={`toggle-chat ${isChatOpen ? 'open' : 'collapsed'}`}
          title={`${isChatOpen ? 'Close' : 'Open'} sidebar`}
          onClick={(e) =>{e.preventDefault(); setIsChatOpen(!isChatOpen)}}
        >
          {isChatOpen ? '◀' : '🤖'}
        </button>
        
        
          <div className="chat-container" style={!isChatOpen ? {display:'none'}:{}}>
            <div className="encrypted-overlay">
              {!isDecrypted && (
                <div className="decryption-prompt">
                  <LockIcon />
                  <button onClick={decryptChat}>Decrypt Chat History</button>
                </div>
              )}
              <div className={`chat-messages ${!isDecrypted ? 'blurred' : ''}`}>
                <DeepChat
                  ref={chatElementRef}
                  history={messages}
                  avatars={true}
                  messageStyles={{default: {user: {bubble: {"backgroundColor": "#ff2020"}}}}}
                  submitButtonStyles={{
                    submit: {
                      svg: {
                        styles: {
                          default: {
                            filter: "brightness(0) saturate(100%) invert(15%) sepia(50%) saturate(6203%) hue-rotate(352deg) brightness(111%) contrast(127%)"
                          }
                        }
                      }
                    }
                  }}
                  textInput={{
                    styles: {
                      container: {
                        "border": "1px solid #ffd9d9",
                        "backgroundColor": "#fffcfc"
                      }
                    },
                    placeholder: {"text": "Insert your question here..."}
                  }}
                  auxiliaryStyle="
                    ::-webkit-scrollbar-thumb {
                      background-color: red;
                    }"
  

                />
              </div>
            </div>
          </div>
        

        
      </div>

      <iframe
        src={browserURL}
        className="browser-iframe"
        title="Decentralized Browser"
        style={{ marginLeft: isChatOpen ? '350px' : '50px' }}
      />
    </div>
  );
};


const LockIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00f7ff"
    strokeWidth="2"
  >
    <path d="M12 17v-2m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    <path d="M19 11V8a7 7 0 1 0-14 0v3" />
    <rect x="5" y="11" width="14" height="10" rx="2" />
  </svg>
);