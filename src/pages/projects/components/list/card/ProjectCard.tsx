import React from 'react';
import { PROJECT_STATUS } from '../../../../../constants/projectStatus';
import { ProjectCardCover } from './ProjectCardCover';
import { ProjectCardHeader } from './ProjectCardHeader';
import { ProjectCardTags } from './ProjectCardTags';
import { ProjectCardActions } from './ProjectCardActions';
import type { Project } from "../../../../../types/projects";

interface ProjectCardProps {
    project: Project;
    isSelected: boolean;
    onClick: (project: Project) => void;
    onOpenVSCode?: (e: React.MouseEvent, project: Project) => void;
    onThreeDotClick?: (e: React.MouseEvent, project: Project) => void;
    style?: React.CSSProperties;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
    project,
    isSelected,
    onClick,
    onOpenVSCode,
    onThreeDotClick,
    style
}) => {
    const projectStatus = PROJECT_STATUS.getDefinition(project.status);

    return (
        <div
            className={`project-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onClick(project)}
            style={{ ...style, borderBottom: `2px solid ${projectStatus.color}` }}
        >
            <ProjectCardCover project={project} />

            <div className="project-card-info">
                <ProjectCardHeader project={project} onThreeDotClick={onThreeDotClick} />
                <ProjectCardTags project={project} />

                <div className="project-card-meta">
                    <span>Updated {project.last_modified || "Today"}</span>
                </div>

                <ProjectCardActions project={project} onClick={onClick} onOpenVSCode={onOpenVSCode} />
            </div>
        </div>
    );
};
