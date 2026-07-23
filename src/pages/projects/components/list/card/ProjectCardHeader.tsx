import React from 'react';
import { GIT_STATUS, PROJECT_STATUS } from '../../../../../constants/projectStatus';
import type { Project } from "../../../../../types/projects";

interface ProjectCardHeaderProps {
    project: Project;
}

export const ProjectCardHeader: React.FC<ProjectCardHeaderProps> = ({ project }) => {
    //BUG:: fix this thing 
    const gitStatus = GIT_STATUS.getDefinition('none');
    const projectStatus = PROJECT_STATUS.getDefinition(project.status);

    return (
        <div className="project-card-header">
            <h3 className="project-card-title" title={project.title}>
                {project.title}
            </h3>
            <div className="project-card-header-actions">
                <span
                    className="project-card-project-status"
                    title={`Project Status: ${projectStatus.label}`}
                    style={{ color: projectStatus.color }}
                >
                    {projectStatus.icon}
                </span>
                <span
                    className="project-card-git-status"
                    title={`Git Status: ${gitStatus.label}`}
                    style={{ color: gitStatus.color }}
                >
                    {gitStatus.icon}
                </span>
            </div>
        </div>
    );
};
