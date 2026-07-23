import React from 'react';
import { generateTagGradient } from '../../../../../utility/gradient';
import { PROJECT_FALLBACK_FOLDER_ICON_48, PROJECT_PINNED_STAR_ICON_16 } from '../../../../../constants/icon';
import type { Project } from "../../../../../types/projects";

interface ProjectCardCoverProps {
    project: Project;
}

export const ProjectCardCover: React.FC<ProjectCardCoverProps> = ({ project }) => {
    return (
        <>
            {project.pinned && <div className="project-card-pin-indicator">{PROJECT_PINNED_STAR_ICON_16}</div>}
            {project.cover_image ? (
                <div
                    className="project-card-cover"
                    style={{ backgroundImage: `url(${project.cover_image})` }}
                />
            ) : (
                <div className="project-card-logo-container" style={{ background: generateTagGradient(project.tags) }}>
                    {project.logo ? (
                        <img src={project.logo} alt={project.title} className="project-card-logo" />
                    ) : (
                        <div className="project-card-logo-placeholder">{PROJECT_FALLBACK_FOLDER_ICON_48}</div>
                    )}
                </div>
            )}
        </>
    );
};
