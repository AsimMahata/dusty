import React from 'react';
import { ProjectContextMenu } from '../menu/ProjectContextMenu';
import { ChangeStatusDialog } from './ChangeStatusDialog';
import { EditTagsDialog } from './EditTagsDialog';
import type { ProjectHook } from '../../types/types';

interface ProjectDialogManagerProps {
    projectHook: ProjectHook;
}

export const ProjectDialogManager: React.FC<ProjectDialogManagerProps> = ({ projectHook }) => {
    const {
        contextMenu, setContextMenu,
        changingStatusProject, setChangingStatusProject,
        editingTagsProject, setEditingTagsProject,
        handleTogglePin,
        handleRename,
        handleDelete,
        updateProjectProgressStatus,
        updateProjectTags
    } = projectHook;

    return (
        <>
            {contextMenu && (
                <ProjectContextMenu
                    project={contextMenu.project}
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    onPinToggle={(p) => handleTogglePin(p.id)}
                    onChangeStatus={(p) => setChangingStatusProject(p)}
                    onEditTags={(p) => setEditingTagsProject(p)}
                    onRename={handleRename}
                    onDelete={handleDelete}
                />
            )}

            {changingStatusProject && (
                <ChangeStatusDialog
                    project={changingStatusProject}
                    onClose={() => setChangingStatusProject(null)}
                    onSave={(newStatus) => {
                        updateProjectProgressStatus(changingStatusProject.id, newStatus);
                        setChangingStatusProject(null);
                    }}
                />
            )}

            {editingTagsProject && (
                <EditTagsDialog
                    project={editingTagsProject}
                    onClose={() => setEditingTagsProject(null)}
                    onSave={(newTags) => updateProjectTags(editingTagsProject.id, newTags)}
                />
            )}
        </>
    );
};
