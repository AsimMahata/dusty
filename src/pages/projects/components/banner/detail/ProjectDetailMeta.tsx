import React from 'react';
import type { Project } from "../../../../../types/projects";

interface ProjectDetailMetaProps {
    project: Project;
}

export const ProjectDetailMeta: React.FC<ProjectDetailMetaProps> = ({ project }) => {
    return (
        <div className="project-banner-meta-grid">
            <div className="meta-column">
                <span className="meta-label">Framework</span>
                <span className="meta-value">{project.project_type || "Unknown"}</span>
            </div>
            <div className="meta-column">
                <span className="meta-label">Git Branch</span>
                <span className="meta-value">{project.git_branch || "main"}</span>
            </div>
            <div className="meta-column">
                <span className="meta-label">Size</span>
                <span className="meta-value">{project.size || "Unknown"}</span>
            </div>
            <div className="meta-column">
                <span className="meta-label">Last Opened</span>
                <span className="meta-value">{project.last_opened || "Today"}</span>
            </div>
            <div className="meta-column">
                <span className="meta-label">Last Modified</span>
                <span className="meta-value">{project.last_modified || "Today"}</span>
            </div>
        </div>
    );
};
