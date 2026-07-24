import React, { useMemo } from 'react';
import { ProjectCardActionIcon } from './ProjectCardActionIcon';
import { getProjectCardActions } from '../../../actions/cardActions';
import type { Project } from '../../../types/types';

interface ProjectCardActionsProps {
    project: Project;
    onClick: (project: Project) => void;
    onOpen?: (project: Project) => void;
    onOpenVSCode?: (e: React.MouseEvent, project: Project) => void;
}

export const ProjectCardActions: React.FC<ProjectCardActionsProps> = ({ project, onClick, onOpen, onOpenVSCode }) => {
    const actions = useMemo(() => getProjectCardActions(onClick, onOpen, onOpenVSCode), [onClick, onOpen, onOpenVSCode]);

    return (
        <div className="project-card-actions">
            {actions.map(action => (
                <ProjectCardActionIcon
                    key={action.id}
                    project={project}
                    action={action}
                />
            ))}
        </div>
    );
};
