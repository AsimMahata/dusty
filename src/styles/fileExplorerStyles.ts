import type { CSSProperties } from 'react';

export const EXPLORER = {
    CONTAINER: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    } as CSSProperties,

    HEADER_INFO: {
        overflow: 'hidden',
        flex: 1,
    } as CSSProperties,

    TITLE: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    } as CSSProperties,

    REVEAL_BTN: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        display: 'flex',
        color: 'var(--text-secondary)',
    } as CSSProperties,

    SUBTITLE: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    } as CSSProperties,

    CLOSE_BTN: {
        marginLeft: 'auto',
    } as CSSProperties,

    LIST_CONTAINER: {
        flex: 1,
        overflowY: 'auto',
    } as CSSProperties,

    EMPTY_STATE: {
        textAlign: 'center',
        padding: '2rem',
        color: 'var(--text-secondary)',
    } as CSSProperties,
};
