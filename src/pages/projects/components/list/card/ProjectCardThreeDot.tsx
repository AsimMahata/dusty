import React from 'react';
import { PROJECT_MENU_MORE_ICON } from '../../../../../constants/icon';
import type { Project } from "../../../../../types/projects";

interface ProjectCardThreeDotProps {
    project: Project;
    onThreeDotClick?: (e: React.MouseEvent, project: Project) => void;
}

export const ProjectCardThreeDot: React.FC<ProjectCardThreeDotProps> = ({ project, onThreeDotClick }) => {
    return (
        <button 
            className="project-card-menu-btn" 
            onClick={(e) => {
                e.stopPropagation();
                onThreeDotClick?.(e, project);
            }}
        >
            {PROJECT_MENU_MORE_ICON}
        </button>
    );
};
