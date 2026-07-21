import React from 'react';
import type { Project } from "../../../../../types/projects";
import type { ProjectAction } from "../../../../../types/projects";

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
