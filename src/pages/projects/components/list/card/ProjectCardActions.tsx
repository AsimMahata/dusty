import React, { useMemo } from 'react';
import type { Project } from '../../../../../types/types';
import { ProjectCardActionIcon } from './ProjectCardActionIcon';
import { getProjectCardActions } from '../../../actions/cardActions';

interface ProjectCardActionsProps {
    project: Project;
    onClick: (project: Project) => void;
    onOpenVSCode?: (e: React.MouseEvent, project: Project) => void;
}

export const ProjectCardActions: React.FC<ProjectCardActionsProps> = ({ project, onClick, onOpenVSCode }) => {
    const actions = useMemo(() => getProjectCardActions(onClick, onOpenVSCode), [onClick, onOpenVSCode]);

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
