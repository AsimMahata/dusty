import React from 'react';
import { Check, X } from 'lucide-react';

interface EditTitleProps {
    value: string;
    onChange: (value: string) => void;
    onConfirm: () => void;
    onCancel: () => void;
    disabled?: boolean;
}

export const EditTitle: React.FC<EditTitleProps> = ({
    value,
    onChange,
    onConfirm,
    onCancel,
    disabled
}) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoFocus
                style={{
                    background: 'var(--bg-secondary, #2a2a2a)',
                    color: 'white',
                    border: '1px solid var(--border-color, #444)',
                    borderRadius: '6px',
                    padding: '0.4rem 0.8rem',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    outline: 'none',
                    width: '100%',
                    maxWidth: '600px'
                }}
                disabled={disabled}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') onConfirm();
                    if (e.key === 'Escape') onCancel();
                }}
            />
            <button 
                onClick={onConfirm} 
                disabled={disabled} 
                style={{ background: 'transparent', border: 'none', color: '#4ade80', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
            >
                <Check size={20} />
            </button>
            <button 
                onClick={onCancel} 
                disabled={disabled} 
                style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
            >
                <X size={20} />
            </button>
        </div>
    );
};
