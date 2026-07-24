import React from 'react';

import type { GitInfo, Project } from '../types/types';
import type { ProjectAction } from '../types/types';
import { openInVsCode, openFileInExplorer } from '../../../personalities/introverts/filesystem/filesystem';
import { openProjectGithub, getGitInfo } from '../../../personalities/introverts/projects/projects';
import { logger } from '../../../utility/logger';
import { PROJECT_OPEN_EXPLORER_ICON, PROJECT_OPEN_GITHUB_ICON, PROJECT_OPEN_VSCODE_ICON, PROJECT_OPEN_ZAP_ICON } from '../constants/constants';

export const getProjectCardActions = (
    onClick: (project: Project) => void,
    onOpen?: (project: Project) => void,
    onOpenVSCode?: (e: React.MouseEvent, project: Project) => void
): ProjectAction[] => {
    return [
        {
            id: 'open',
            title: 'Open Project',
            icon: PROJECT_OPEN_ZAP_ICON,
            onClick: (e, project) => {
                e.stopPropagation();
                if (onOpen) {
                    onOpen(project);
                } else {
                    onClick(project);
                }
            }
        },
        {
            id: 'vscode',
            title: 'Open in VSCode',
            icon: PROJECT_OPEN_VSCODE_ICON,
            onClick: (e, project) => {
                e.stopPropagation();
                if (onOpenVSCode) {
                    onOpenVSCode(e, project);
                } else {
                    void openInVsCode(project.path);
                }
            }
        },
        {
            id: 'explorer',
            title: 'Reveal in Explorer',
            icon: PROJECT_OPEN_EXPLORER_ICON,
            onClick: (e, project) => {
                e.stopPropagation();
                void openFileInExplorer(project.path);
            }
        },
        {
            id: 'github',
            title: 'Open GitHub',
            icon: PROJECT_OPEN_GITHUB_ICON,
            onClick: async (e, project) => {
                e.stopPropagation();
                let gitInfo: GitInfo | undefined = project.git_info;
                if (!gitInfo || !gitInfo.git_remote_url) {
                    gitInfo = await getGitInfo(project.path);
                }
                if (gitInfo) {
                    void openProjectGithub(gitInfo);
                } else {
                    logger.error(`Failed to get git info for project ${project.title}`);
                }
            }
        }
    ];
};
