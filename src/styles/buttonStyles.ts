import type { CSSProperties } from 'react';



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
