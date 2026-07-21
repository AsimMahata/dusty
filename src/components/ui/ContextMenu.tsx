import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ActionItem } from "../../types/core";

interface ContextMenuProps {
    x: number;
    y: number;
    actions: ActionItem[];
    onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, actions, onClose }) => {
    useEffect(() => {
        const handleClickOutside = () => onClose();
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('contextmenu', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('contextmenu', handleClickOutside);
        };
    }, [onClose]);

    const safeX = Math.min(x, window.innerWidth - 220);
    const safeY = Math.min(y, window.innerHeight - (actions.length * 40));

    return createPortal(
        <div
            className="context-menu"
            style={{ top: safeY, left: safeX }}
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
            {actions.map((action, idx) => {
                if (action.separator) {
                    return <div key={idx} className="context-menu-separator" />;
                }
                return (
                    <div 
                        key={idx} 
                        className="context-menu-item" 
                        onClick={() => { action.onClick(); onClose(); }}
                        style={action.color ? { color: action.color } : undefined}
                    >
                        {action.icon && <span className="context-menu-icon" style={action.color ? { color: action.color } : undefined}>{action.icon}</span>}
                        {action.label}
                    </div>
                );
            })}
        </div>,
        document.body
    );
};
