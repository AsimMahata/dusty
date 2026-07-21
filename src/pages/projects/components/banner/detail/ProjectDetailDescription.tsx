import React from 'react';
import type { Project } from "../../../../../types/projects";

interface ProjectDetailDescriptionProps {
    project: Project;
}

export const ProjectDetailDescription: React.FC<ProjectDetailDescriptionProps> = ({ project }) => {
    if (!project.description) return null;

    return (
        <div className="project-banner-description">
            {project.description}
        </div>
    );
};
