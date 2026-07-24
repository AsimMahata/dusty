import { openFileInExplorer, openInVsCode } from '../../../personalities/introverts/filesystem/filesystem';
import { openTerminal } from '../../../personalities/introverts/terminal/terminal';

import type { Project } from '../types/types';
import type { ContextMenuItem } from '../types/types';
import { openProjectGithub } from '../../../personalities/introverts/projects/projects';
import { PROJECT_MENU_DELETE_ICON, PROJECT_MENU_EXPLORER_ICON, PROJECT_MENU_GITHUB_ICON, PROJECT_MENU_RENAME_ICON, PROJECT_MENU_STAR_FILLED_ICON, PROJECT_MENU_STAR_ICON, PROJECT_MENU_STATUS_ICON, PROJECT_MENU_TAGS_ICON, PROJECT_MENU_TERMINAL_ICON, PROJECT_MENU_VSCODE_ICON } from '../constants/constants';
export const getProjectContextMenuItems = (
    project: Project,
    onClose: () => void,
    onPinToggle: (project: Project) => void,
    onChangeStatus: (project: Project) => void,
    onEditTags: (project: Project) => void,
    onRename: (project: Project) => void,
    onDelete: (project: Project) => void
): ContextMenuItem[] => {
    return [
        {
            icon: project.pinned ? PROJECT_MENU_STAR_FILLED_ICON : PROJECT_MENU_STAR_ICON,
            label: project.pinned ? "Unpin Project" : "Pin Project",
            onClick: () => { onPinToggle(project); onClose(); }
        },
        {
            icon: PROJECT_MENU_STATUS_ICON,
            label: "Change Status",
            onClick: () => { onChangeStatus(project); onClose(); }
        },
        { separator: true },
        {
            icon: PROJECT_MENU_EXPLORER_ICON,
            label: "Reveal in Explorer",
            onClick: () => { void openFileInExplorer(project.path); onClose(); }
        },
        {
            icon: PROJECT_MENU_TERMINAL_ICON,
            label: "Open Terminal",
            onClick: () => { void openTerminal(project.path); onClose(); }
        },
        {
            icon: PROJECT_MENU_VSCODE_ICON,
            label: "Open VSCode",
            onClick: () => { void openInVsCode(project.path); onClose(); }
        },
        {
            icon: PROJECT_MENU_GITHUB_ICON,
            label: "Open GitHub",
            onClick: () => { void openProjectGithub(project.git_info); onClose(); }
        },
        { separator: true },
        {
            icon: PROJECT_MENU_TAGS_ICON,
            label: project.tags && project.tags.length > 0 ? "Edit Tags" : "Scan Tags",
            onClick: () => { onEditTags(project); onClose(); }
        },
        {
            icon: PROJECT_MENU_RENAME_ICON,
            label: "Rename",
            onClick: () => { onRename(project); onClose(); }
        },
        { separator: true },
        {
            icon: PROJECT_MENU_DELETE_ICON,
            label: "Delete",
            onClick: () => { onDelete(project); onClose(); },
            danger: true
        }
    ];
};
