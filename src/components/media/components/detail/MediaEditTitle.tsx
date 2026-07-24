import React from 'react';
import { CHECK_ICON_20, X_ICON_20 } from '../../../../constants/icon';

import { COLORS } from '../../../../constants/color';

interface MediaEditTitleProps {
    value: string;
    onChange: (value: string) => void;
    onConfirm: () => void;
    onCancel: () => void;
    disabled?: boolean;
}

export const MediaEditTitle: React.FC<MediaEditTitleProps> = ({
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
                    background: `var(--bg-secondary, ${COLORS.MEDIA.BG_SECONDARY})`,
                    color: COLORS.BASE.WHITE,
                    border: `1px solid var(--border-color, ${COLORS.MEDIA.BORDER_FALLBACK})`,
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
                style={{ background: 'transparent', border: 'none', color: COLORS.MEDIA.CONFIRM, cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
            >
                {CHECK_ICON_20}
            </button>
            <button 
                onClick={onCancel} 
                disabled={disabled} 
                style={{ background: 'transparent', border: 'none', color: COLORS.MEDIA.CANCEL, cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
            >
                {X_ICON_20}
            </button>
        </div>
    );
};
