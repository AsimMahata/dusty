import React from 'react';
import { PROJECT_TAGS } from '../../../../../constants/projectTags';
import type { Project } from "../../../../../types/projects";

interface ProjectCardTagsProps {
    project: Project;
}

export const ProjectCardTags: React.FC<ProjectCardTagsProps> = ({ project }) => {
    return (
        <div className="project-card-tags">
            {project.tags?.slice(0, 3).map((tagString, index) => {
                const tag = PROJECT_TAGS.getDefinition(tagString);
                return (
                    <span 
                        key={index} 
                        className="project-card-tag"
                        style={{ color: tag.color, backgroundColor: `${tag.color}15`, border: `1px solid ${tag.color}30` }}
                    >
                        {tag.icon && <span style={{ marginRight: '4px' }}>{tag.icon}</span>}
                        {tag.label}
                    </span>
                );
            })}
            {(!project.tags || project.tags.length === 0) && (
                <span className="project-card-tag empty-tag">No tags</span>
            )}
            {(project.tags?.length || 0) > 3 && (
                <span className="project-card-tag">+{project.tags!.length - 3}</span>
            )}
        </div>
    );
};
