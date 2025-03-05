// Create src/components/SettingsModal.tsx
import React, { useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  onSelect: (model: string) => void;
}

const LLM_OPTIONS = [
  'OpenAI',
  'Anthropic',
  'Gemini',
  'DeepSeek V3',
  'DeepSeek R1',
  'Nillion SecretLLM (Olama)'
];



export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  selectedModel,
  onSelect
}) => {
  if (!isOpen) return null;

 
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Select LLM Model</h3>
        <div className="model-list">
          {LLM_OPTIONS.map((model) => (
            <div
              key={model}
              className={`model-option ${selectedModel === model ? 'selected' : ''}`}
              onClick={() => {onSelect(model); onClose()}}
            >
              {model}
            </div>
          ))}
        </div>
        <button className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};