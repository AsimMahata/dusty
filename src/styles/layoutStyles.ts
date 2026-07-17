import type { CSSProperties } from 'react';
import { COLORS } from '../constants/color';

const FLEX_ROW_CENTER: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
};

const FLEX_ROW_CENTER_GAP_8: CSSProperties = {
    ...FLEX_ROW_CENTER,
    gap: '8px',
};

export const FLEX_COLUMN_GAP_24: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
};

export const PAGE_SECTION_PADDING: CSSProperties = {
    padding: '1rem',
};

export const SETTINGS_SECTION_HEADER: CSSProperties = {
    ...FLEX_ROW_CENTER_GAP_8,
    marginBottom: '1.5rem',
    color: 'var(--text-primary)',
};

export const DANGER_ZONE_CONTAINER: CSSProperties = {
    background: COLORS.TRANSPARENT.DANGER_BG,
    border: `1px solid ${COLORS.TRANSPARENT.DANGER_BORDER}`,
    borderRadius: '8px',
    padding: '1.5rem',
    maxWidth: '600px',
};

export const DANGER_ZONE_HEADER: CSSProperties = {
    ...FLEX_ROW_CENTER_GAP_8,
    marginBottom: '0.75rem',
    fontWeight: 600,
};

export const DANGER_ZONE_TEXT: CSSProperties = {
    color: 'var(--text-secondary)',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
    lineHeight: 1.6,
};

export const SETTINGS_ITEM_CONTAINER: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'var(--bg-card)',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
};

export const SETTINGS_ITEM_TITLE: CSSProperties = {
    margin: '0 0 0.25rem 0',
    color: 'var(--text-primary)',
};

export const SETTINGS_ITEM_DESC: CSSProperties = {
    margin: 0,
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
};
