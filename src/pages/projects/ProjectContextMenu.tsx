import React, { useEffect, useRef } from 'react';
import { Star, CircleDot, FolderOpen, Terminal, Monitor, Globe, Tags, Pencil, Trash2 } from 'lucide-react';
import type { Project } from '../../types/types';
import { logger } from '../../utility/logger';

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

    // Ensure the menu stays within viewport bounds
    const style: React.CSSProperties = {
        position: 'fixed',
        left: Math.min(x, window.innerWidth - 220),
        top: Math.min(y, window.innerHeight - 350),
        zIndex: 10000,
    };

    return (
        <div className="context-menu" style={style} ref={menuRef}>
            <div className="context-menu-item" onClick={() => { onPinToggle(project); onClose(); }}>
                <span className="context-menu-icon"><Star size={16} fill={project.pinned ? "currentColor" : "none"} /></span>
                <span>{project.pinned ? "Unpin Project" : "Pin Project"}</span>
            </div>
            <div className="context-menu-item" onClick={() => { onChangeStatus(project); onClose(); }}>
                <span className="context-menu-icon"><CircleDot size={16} /></span>
                <span>Change Status</span>
            </div>
            <div className="context-menu-separator" />
            <div className="context-menu-item" onClick={() => { logger.info(`TODO: Reveal in Explorer for project: ${project.title}`); onClose(); }}>
                <span className="context-menu-icon"><FolderOpen size={16} /></span>
                <span>Reveal in Explorer</span>
            </div>
            <div className="context-menu-item" onClick={() => { logger.info(`TODO: Open Terminal for project: ${project.title}`); onClose(); }}>
                <span className="context-menu-icon"><Terminal size={16} /></span>
                <span>Open Terminal</span>
            </div>
            <div className="context-menu-item" onClick={() => { logger.info(`TODO: Open VSCode for project: ${project.title}`); onClose(); }}>
                <span className="context-menu-icon"><Monitor size={16} /></span>
                <span>Open VSCode</span>
            </div>
            <div className="context-menu-item" onClick={() => { logger.info(`TODO: Open GitHub for project: ${project.title}`); onClose(); }}>
                <span className="context-menu-icon"><Globe size={16} /></span>
                <span>Open GitHub</span>
            </div>
            <div className="context-menu-separator" />
            <div className="context-menu-item" onClick={() => { onEditTags(project); onClose(); }}>
                <span className="context-menu-icon"><Tags size={16} /></span>
                <span>Edit Tags</span>
            </div>
            <div className="context-menu-item" onClick={() => { onRename(project); onClose(); }}>
                <span className="context-menu-icon"><Pencil size={16} /></span>
                <span>Rename</span>
            </div>
            <div className="context-menu-separator" />
            <div className="context-menu-item danger" onClick={() => { onDelete(project); onClose(); }}>
                <span className="context-menu-icon"><Trash2 size={16} /></span>
                <span>Delete</span>
            </div>
        </div>
    );
};
