import React, { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { invoke } from '@tauri-apps/api/core';
import { CMD_TOKENIZE } from '../constants/commands';
import { LAB_CONTAINER, LAB_SECTION, LAB_SECTION_TITLE, LAB_INPUT_ROW, LAB_INPUT, LAB_BUTTON, LAB_RESULT_CONTAINER, LAB_RESULT_TITLE, LAB_TAGS_CONTAINER, LAB_TAG } from '../styles/labStyles';


export const Lab: React.FC = () => {
  const [tokenInput, setTokenInput] = useState('');
  const [tokenizedResult, setTokenizedResult] = useState<string[]>([]);
  const [isTokenizing, setIsTokenizing] = useState(false);

  const handleTokenize = async () => {
    if (!tokenInput.trim()) return;
    
    setIsTokenizing(true);
    try {
      const result: string[] = await invoke(CMD_TOKENIZE, { input: tokenInput });
      setTokenizedResult(result);
    } catch (error) {
      console.error('Failed to tokenize:', error);
    } finally {
      setIsTokenizing(false);
    }
  };

  return (
    <PageLayout title="Experiment Zone (Lab)" hideSearch showCloseButton>
      <div className="lab-container" style={LAB_CONTAINER}>
        <section className="lab-section" style={LAB_SECTION}>
          <h2 style={LAB_SECTION_TITLE}>Tokenize Test</h2>
          <div style={LAB_INPUT_ROW}>
            <input 
              type="text" 
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Enter a file name or string to tokenize..."
              style={LAB_INPUT}
              onKeyDown={(e) => e.key === 'Enter' && handleTokenize()}
            />
            <button 
              onClick={handleTokenize}
              disabled={isTokenizing}
              style={LAB_BUTTON}
            >
              {isTokenizing ? 'Processing...' : 'Tokenize'}
            </button>
          </div>
          
          {tokenizedResult.length > 0 && (
            <div style={LAB_RESULT_CONTAINER}>
              <h3 style={LAB_RESULT_TITLE}>Result:</h3>
              <div style={LAB_TAGS_CONTAINER}>
                {tokenizedResult.map((token, idx) => (
                  <span key={idx} style={LAB_TAG}>
                    {token}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
};
