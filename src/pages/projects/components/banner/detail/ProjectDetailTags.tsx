import React from 'react';
import { PROJECT_TAGS } from '../../../../../constants/projectTags';
import type { Project } from "../../../../../types/projects";

interface ProjectDetailTagsProps {
    project: Project;
}

export const ProjectDetailTags: React.FC<ProjectDetailTagsProps> = ({ project }) => {
    return (
        <div className="project-banner-tags">
            {project.tags?.map((tagString, index) => {
                const tag = PROJECT_TAGS.getDefinition(tagString);
                return (
                    <span 
                        key={index} 
                        className="project-banner-tag"
                        style={{ color: tag.color, backgroundColor: `${tag.color}15`, border: `1px solid ${tag.color}30` }}
                    >
                        {tag.icon && <span style={{ marginRight: '4px' }}>{tag.icon}</span>}
                        {tag.label}
                    </span>
                );
            })}
            {(!project.tags || project.tags.length === 0) && (
                <span className="project-banner-tag empty">No tags</span>
            )}
        </div>
    );
};
