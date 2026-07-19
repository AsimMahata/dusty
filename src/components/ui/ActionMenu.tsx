import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { ContextMenu } from './ContextMenu';
import type { ActionItem } from '../../types/types';

interface ActionMenuProps {
    actions: ActionItem[];
    icon?: React.ReactNode;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ actions, icon }) => {
    const [menuPos, setMenuPos] = useState<{ x: number, y: number } | null>(null);
    const hoverTimeoutRef = useRef<number | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setMenuPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
        e.currentTarget.style.color = 'var(--text-primary)';
        const x = e.clientX;
        const y = e.clientY;

        if (hoverTimeoutRef.current) {
            window.clearTimeout(hoverTimeoutRef.current);
        }
        
        hoverTimeoutRef.current = window.setTimeout(() => {
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                setMenuPos({ x: rect.left + rect.width / 2, y: rect.bottom });
            } else {
                setMenuPos({ x, y });
            }
        }, 500);
    };

    const handleMouseLeave = (e: React.MouseEvent) => {
        e.currentTarget.style.color = 'var(--text-muted)';
        if (hoverTimeoutRef.current) {
            window.clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                window.clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    if (!actions || actions.length === 0) return null;

    return (
        <>
            <button
                ref={buttonRef}
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
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
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
