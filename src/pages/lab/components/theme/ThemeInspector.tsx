import React, { useState } from 'react';
import { Palette, Copy, Check } from 'lucide-react';
import { COLOR_TOKENS } from '../../constants/constants';

export const ThemeInspector: React.FC = () => {
    const [copiedToken, setCopiedToken] = useState<string | null>(null);

    const handleCopy = (varName: string) => {
        navigator.clipboard.writeText(`var(${varName})`);
        setCopiedToken(varName);
        setTimeout(() => setCopiedToken(null), 2000);
    };

    return (
        <div>
            <div className="db-inspector-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Palette size={20} style={{ color: 'var(--accent)' }} />
                    <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>
                        Design System & Theme Tokens
                    </h3>
                </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Dusty design system CSS variables and typography tokens. Click any token card to copy its `var(...)` CSS reference to the clipboard.
            </p>

            {/* Color Swatches Grid */}
            <h4 className="api-input-label" style={{ marginBottom: '12px' }}>Color Palette Swatches</h4>
            <div className="theme-grid" style={{ marginBottom: '32px' }}>
                {COLOR_TOKENS.map((token) => (
                    <div
                        key={token.name}
                        className="theme-color-card"
                        onClick={() => handleCopy(token.name)}
                        style={{ cursor: 'pointer' }}
                        title="Click to copy CSS variable reference"
                    >
                        <div
                            className="theme-color-swatch"
                            style={{ background: `var(${token.name}, ${token.value})` }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <code style={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>{token.name}</code>
                            {copiedToken === token.name ? (
                                <Check size={14} style={{ color: '#0dbc79' }} />
                            ) : (
                                <Copy size={14} style={{ color: 'var(--text-muted)' }} />
                            )}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{token.description}</span>
                    </div>
                ))}
            </div>

            {/* Typography Scale */}
            <h4 className="api-input-label" style={{ marginBottom: '12px' }}>Typography Hierarchy</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '20px' }}>
                <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>H1 Page Heading (1.25rem / 20px - SemiBold)</span>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                        The Quick Brown Fox Jumps Over The Lazy Dog
                    </h1>
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>H2 Section Title (1.0rem / 16px - Medium)</span>
                    <h2 style={{ fontSize: '1.0rem', fontWeight: 500, color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                        The Quick Brown Fox Jumps Over The Lazy Dog
                    </h2>
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Body Text (0.875rem / 14px - Regular)</span>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                        Dusty workspace provides high-fidelity media organization, developer tooling, project exploration, and terminal integration.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ThemeInspector;
