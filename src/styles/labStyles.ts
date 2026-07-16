import type { CSSProperties } from 'react';
import { COLORS } from '../constants/color';

export const LAB_CONTAINER: CSSProperties = {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
};

export const LAB_SECTION: CSSProperties = {
    background: 'var(--bg-secondary)',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
};

export const LAB_SECTION_TITLE: CSSProperties = {
    marginTop: 0,
    marginBottom: '1rem',
    color: 'var(--text-primary)',
};

export const LAB_INPUT_ROW: CSSProperties = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
};

export const LAB_INPUT: CSSProperties = {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-card)',
    color: 'var(--text-primary)',
};

export const LAB_BUTTON: CSSProperties = {
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    background: 'var(--accent, #3b82f6)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
};

export const LAB_RESULT_CONTAINER: CSSProperties = {
    background: 'var(--bg-card)',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
};

export const LAB_RESULT_TITLE: CSSProperties = {
    marginTop: 0,
    fontSize: '1rem',
    color: 'var(--text-secondary)',
};

export const LAB_TAGS_CONTAINER: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '1rem',
};

export const LAB_TAG: CSSProperties = {
    background: COLORS.TRANSPARENT.BLUE_20,
    color: '#93c5fd',
    padding: '0.25rem 0.75rem',
    borderRadius: '16px',
    fontSize: '0.875rem',
};
