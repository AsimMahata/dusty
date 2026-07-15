import React, { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { invoke } from '@tauri-apps/api/core';


export const Lab: React.FC = () => {
  const [tokenInput, setTokenInput] = useState('');
  const [tokenizedResult, setTokenizedResult] = useState<string[]>([]);
  const [isTokenizing, setIsTokenizing] = useState(false);

  const handleTokenize = async () => {
    if (!tokenInput.trim()) return;
    
    setIsTokenizing(true);
    try {
      const result: string[] = await invoke('tokenize', { input: tokenInput });
      setTokenizedResult(result);
    } catch (error) {
      console.error('Failed to tokenize:', error);
    } finally {
      setIsTokenizing(false);
    }
  };

  return (
    <PageLayout title="Experiment Zone (Lab)" hideSearch showCloseButton>
      <div className="lab-container" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <section className="lab-section" style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text)' }}>Tokenize Test</h2>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Enter a file name or string to tokenize..."
              style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
              onKeyDown={(e) => e.key === 'Enter' && handleTokenize()}
            />
            <button 
              onClick={handleTokenize}
              disabled={isTokenizing}
              style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              {isTokenizing ? 'Processing...' : 'Tokenize'}
            </button>
          </div>
          
          {tokenizedResult.length > 0 && (
            <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ marginTop: 0, fontSize: '1rem', color: 'var(--text-muted)' }}>Result:</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                {tokenizedResult.map((token, idx) => (
                  <span key={idx} style={{ background: 'var(--primary-dark, #3b82f640)', color: 'var(--primary-light, #93c5fd)', padding: '0.25rem 0.75rem', borderRadius: '16px', fontSize: '0.875rem' }}>
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
