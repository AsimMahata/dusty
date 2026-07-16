import type { CSSProperties } from 'react';

const ACTION_BUTTON_BASE_STYLE: CSSProperties = {
    padding: '0.4rem 1rem',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
};

export function getActionButtonStyle(
    bg: string,
    isConfirming: boolean,
    borderColor: string,
    boxShadowColor: string
): CSSProperties {
    return {
        ...ACTION_BUTTON_BASE_STYLE,
        backgroundColor: bg,
        border: isConfirming
            ? `1px solid ${borderColor}`
            : "1px solid transparent",
        minWidth: isConfirming ? "120px" : "80px",
        transform: isConfirming ? "scale(1.05)" : "scale(1)",
        boxShadow: isConfirming
            ? `0 0 15px ${boxShadowColor}`
            : "none",
    };
}

const SETTINGS_BUTTON_BASE_STYLE: CSSProperties = {
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    fontWeight: 500,
    transition: 'background 0.2s',
    fontSize: '0.95rem',
};

export function getSettingsButtonStyle(
    bg: string,
    isAnyResetting: boolean
): CSSProperties {
    return {
        ...SETTINGS_BUTTON_BASE_STYLE,
        background: bg,
        cursor: isAnyResetting ? 'not-allowed' : 'pointer',
        opacity: isAnyResetting ? 0.7 : 1,
    };
}
