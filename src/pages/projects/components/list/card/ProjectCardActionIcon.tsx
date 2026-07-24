import React from 'react';
import type { Project } from '../../../types/types';
import type { ProjectAction } from '../../../types/types';

interface ProjectCardActionIconProps {
    project: Project;
    action: ProjectAction;
}

export const ProjectCardActionIcon: React.FC<ProjectCardActionIconProps> = ({ project, action }) => {
    return (
        <button
            className="project-card-action-icon"
            title={action.title}
            onClick={(e) => action.onClick(e, project)}
        >
            {action.icon}
        </button>
    );
};
