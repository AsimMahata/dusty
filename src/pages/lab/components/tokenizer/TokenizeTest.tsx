import React from 'react';
import { FileCode, Sparkles } from 'lucide-react';
import { useTokenizeTest } from '../../hooks/useTokenizeTest';
import { COLORS } from '../../../../constants/color';

const SAMPLE_PRESETS = [
    '[Frieren] Episode 18 1080p.mkv',
    'One.Piece.E1136.2026.Multi.1080p.WEB-DL.x264',
    'My_Project_Build_v1.2.3_final.zip',
    'Chainsaw Man S01E12 Dual Audio 720p HEVC.mp4'
];

export const TokenizeTest: React.FC = () => {
    const {
        tokenInput,
        setTokenInput,
        tokenizedResult,
        isTokenizing,
        handleTokenize
    } = useTokenizeTest();

    return (
        <div>
            <div className="db-inspector-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileCode size={20} style={{ color: 'var(--accent)' }} />
                    <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>
                        String & Filename Tokenizer Suite
                    </h3>
                </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Test the backend tokenizer engine (`dusty::api::lab::tokenize`). It parses media titles, release tags, episode numbers, and file extensions into clean search tokens.
            </p>

            {/* Presets */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <span className="api-input-label">Presets:</span>
                {SAMPLE_PRESETS.map((preset, idx) => (
                    <button
                        key={idx}
                        type="button"
                        className="db-table-pill"
                        onClick={() => {
                            setTokenInput(preset);
                        }}
                    >
                        {preset}
                    </button>
                ))}
            </div>

            {/* Input Row */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <input
                    type="text"
                    className="api-text-input"
                    style={{ flex: 1 }}
                    placeholder="Enter a file name or title string to tokenize..."
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTokenize()}
                />
                <button
                    type="button"
                    className="api-run-btn"
                    onClick={handleTokenize}
                    disabled={isTokenizing}
                >
                    <Sparkles size={16} />
                    <span>{isTokenizing ? 'Parsing...' : 'Tokenize String'}</span>
                </button>
            </div>

            {/* Result Tokens View */}
            {tokenizedResult.length > 0 && (
                <div style={{ background: COLORS.TRANSPARENT.BLACK_20, border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span className="api-input-label">Extracted Tokens ({tokenizedResult.length})</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                        {tokenizedResult.map((token, idx) => (
                            <span
                                key={idx}
                                style={{
                                    padding: '6px 12px',
                                    background: COLORS.TRANSPARENT.ACCENT_15,
                                    border: `1px solid ${COLORS.TRANSPARENT.ACCENT_30}`,
                                    borderRadius: '6px',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.8125rem',
                                    fontFamily: 'monospace'
                                }}
                            >
                                {token}
                            </span>
                        ))}
                    </div>

                    <span className="api-input-label" style={{ display: 'block', marginBottom: '6px' }}>Raw JSON Array</span>
                    <pre className="api-response-viewer" style={{ maxHeight: '140px' }}>
                        {JSON.stringify(tokenizedResult, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default TokenizeTest;
