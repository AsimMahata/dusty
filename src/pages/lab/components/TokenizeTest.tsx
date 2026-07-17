import React from 'react';
import { useTokenizeTest } from '../hooks/useTokenizeTest';

export const TokenizeTest: React.FC = () => {
    const { 
        tokenInput, 
        setTokenInput, 
        tokenizedResult, 
        isTokenizing, 
        handleTokenize 
    } = useTokenizeTest();

    return (
        <section className="lab-section">
            <h2 className="lab-section-title">Tokenize Test</h2>
            <div className="lab-input-row">
                <input 
                    type="text" 
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Enter a file name or string to tokenize..."
                    className="lab-input"
                    onKeyDown={(e) => e.key === 'Enter' && handleTokenize()}
                />
                <button 
                    onClick={handleTokenize}
                    disabled={isTokenizing}
                    className="lab-button"
                >
                    {isTokenizing ? 'Processing...' : 'Tokenize'}
                </button>
            </div>
            
            {tokenizedResult.length > 0 && (
                <div className="lab-result-container">
                    <h3 className="lab-result-title">Result:</h3>
                    <div className="lab-tags-container">
                        {tokenizedResult.map((token, idx) => (
                            <span key={idx} className="lab-tag">
                                {token}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};
