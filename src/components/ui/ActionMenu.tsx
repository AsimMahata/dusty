import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { ContextMenu } from './ContextMenu';
import type { ActionItem } from '../../types/types';

interface ActionMenuProps {
    actions: ActionItem[];
    icon?: React.ReactNode;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ actions, icon }) => {
    const [menuPos, setMenuPos] = useState<{ x: number, y: number } | null>(null);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setMenuPos({ x: e.clientX, y: e.clientY });
    };

    if (!actions || actions.length === 0) return null;

    return (
        <>
            <button
                onClick={handleClick}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
                {icon || <MoreVertical size={16} />}
            </button>

            {menuPos && (
                <ContextMenu
                    x={menuPos.x}
                    y={menuPos.y}
                    actions={actions}
                    onClose={() => setMenuPos(null)}
                />
            )}
        </>
    );
};
