
import { logger } from '../../../utility/logger';
import { 
    PROJECT_MENU_STAR_ICON, PROJECT_MENU_STAR_FILLED_ICON,
    PROJECT_MENU_STATUS_ICON, PROJECT_MENU_EXPLORER_ICON, 
    PROJECT_MENU_TERMINAL_ICON, PROJECT_MENU_VSCODE_ICON, 
    PROJECT_MENU_GITHUB_ICON, PROJECT_MENU_TAGS_ICON, 
    PROJECT_MENU_RENAME_ICON, PROJECT_MENU_DELETE_ICON 
} from '../../../constants/icon';
import type { Project } from "../../../types/projects";
import type { ContextMenuItem } from "../../../types/projects";
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
            onClick: () => { logger.info(`TODO: Reveal in Explorer for project: ${project.title}`); onClose(); }
        },
        {
            icon: PROJECT_MENU_TERMINAL_ICON,
            label: "Open Terminal",
            onClick: () => { logger.info(`TODO: Open Terminal for project: ${project.title}`); onClose(); }
        },
        {
            icon: PROJECT_MENU_VSCODE_ICON,
            label: "Open VSCode",
            onClick: () => { logger.info(`TODO: Open VSCode for project: ${project.title}`); onClose(); }
        },
        {
            icon: PROJECT_MENU_GITHUB_ICON,
            label: "Open GitHub",
            onClick: () => { logger.info(`TODO: Open GitHub for project: ${project.title}`); onClose(); }
        },
        { separator: true },
        {
            icon: PROJECT_MENU_TAGS_ICON,
            label: "Edit Tags",
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
