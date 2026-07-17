import React, { useEffect, useRef, useMemo } from 'react';
import type { Project } from '../../../../types/types';
import { getProjectContextMenuItems } from '../../actions/menuActions';

interface ProjectContextMenuProps {
    project: Project;
    x: number;
    y: number;
    onClose: () => void;
    onPinToggle: (project: Project) => void;
    onChangeStatus: (project: Project) => void;
    onEditTags: (project: Project) => void;
    onRename: (project: Project) => void;
    onDelete: (project: Project) => void;
}

export const ProjectContextMenu: React.FC<ProjectContextMenuProps> = ({
    project,
    x,
    y,
    onClose,
    onPinToggle,
    onChangeStatus,
    onEditTags,
    onRename,
    onDelete
}) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const style: React.CSSProperties = {
        position: 'fixed',
        left: Math.min(x, window.innerWidth - 220),
        top: Math.min(y, window.innerHeight - 350),
        zIndex: 10000,
    };

    const menuItems = useMemo(() => getProjectContextMenuItems(
        project, onClose, onPinToggle, onChangeStatus, onEditTags, onRename, onDelete
    ), [project, onClose, onPinToggle, onChangeStatus, onEditTags, onRename, onDelete]);

    return (
        <div className="context-menu" style={style} ref={menuRef}>
            {menuItems.map((item, index) => {
                if (item.separator) {
                    return <div key={index} className="context-menu-separator" />;
                }
                return (
                    <div 
                        key={index} 
                        className={`context-menu-item ${item.danger ? 'danger' : ''}`} 
                        onClick={item.onClick}
                    >
                        <span className="context-menu-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </div>
                );
            })}
        </div>
    );
};
