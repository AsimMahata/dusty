import React from 'react';
import { logger } from '../../../utility/logger';
import { 
    PROJECT_OPEN_ZAP_ICON, 
    PROJECT_OPEN_VSCODE_ICON, 
    PROJECT_OPEN_EXPLORER_ICON, 
    PROJECT_OPEN_GITHUB_ICON 
} from '../../../constants/icon';
import type { Project } from "../../../types/projects";
import type { ProjectAction } from "../../../types/projects";
export const getProjectCardActions = (
    onClick: (project: Project) => void,
    onOpenVSCode?: (e: React.MouseEvent, project: Project) => void
): ProjectAction[] => {
    return [
        {
            id: 'open',
            title: 'Open Project',
            icon: PROJECT_OPEN_ZAP_ICON,
            onClick: (e, project) => { e.stopPropagation(); onClick(project); }
        },
        {
            id: 'vscode',
            title: 'Open in VSCode',
            icon: PROJECT_OPEN_VSCODE_ICON,
            onClick: (e, project) => { e.stopPropagation(); onOpenVSCode?.(e, project); }
        },
        {
            id: 'explorer',
            title: 'Reveal in Explorer',
            icon: PROJECT_OPEN_EXPLORER_ICON,
            onClick: (e, project) => { e.stopPropagation(); logger.todo(`Reveal in Explorer for project: ${project.title}`); }
        },
        {
            id: 'github',
            title: 'Open GitHub',
            icon: PROJECT_OPEN_GITHUB_ICON,
            onClick: (e, project) => { e.stopPropagation(); logger.todo(`Open GitHub for project: ${project.title}`); }
        }
    ];
};
