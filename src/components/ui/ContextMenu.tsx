import React, { useEffect } from 'react';


export interface ContextMenuAction {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    separator?: boolean;
}

interface ContextMenuProps {
    x: number;
    y: number;
    actions: ContextMenuAction[];
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

    return (
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
                    <div key={idx} className="context-menu-item" onClick={() => { action.onClick(); onClose(); }}>
                        {action.icon && <span className="context-menu-icon">{action.icon}</span>}
                        {action.label}
                    </div>
                );
            })}
        </div>
    );
};
