import React from 'react';
import { invoke } from '@tauri-apps/api/core';
import { GIT_STATUS, PROJECT_STATUS } from '../../../../../constants/projectStatus';
import { PROJECT_FALLBACK_FOLDER_ICON_48, PROJECT_EXTERNAL_LINK_ICON, PROJECT_PINNED_STAR_ICON_14 } from '../../../../../constants/icon';
import type { Project } from "../../../../../types/projects";

interface ProjectDetailHeaderProps {
    project: Project;
}

export const ProjectDetailHeader: React.FC<ProjectDetailHeaderProps> = ({ project }) => {
    const gitStatus = GIT_STATUS.getDefinition(project.git_status);
    const projectStatus = PROJECT_STATUS.getDefinition(project.status);

    return (
        <div className="project-banner-header">
            {project.logo ? (
                <img src={project.logo} alt="Logo" className="project-banner-logo" />
            ) : (
                <div className="project-banner-logo-placeholder">{PROJECT_FALLBACK_FOLDER_ICON_48}</div>
            )}
            <div className="project-banner-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h1>{project.title}</h1>
                    <button 
                        className="project-btn icon-only" 
                        title="Reveal in File Explorer"
                        onClick={(e) => {
                            e.stopPropagation();
                            invoke('cmd_open_file', { path: project.path }).catch(console.error);
                        }}
                        style={{ padding: '0.25rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}
                    >
                        {PROJECT_EXTERNAL_LINK_ICON}
                    </button>
                </div>
                <div className="project-banner-statuses">
                    <span className="project-banner-status" style={{ color: projectStatus.color }}>
                        {projectStatus.icon} {projectStatus.label}
                    </span>
                    <span className="project-banner-status" style={{ color: gitStatus.color }}>
                        {gitStatus.icon} {gitStatus.label}
                    </span>
                </div>
            </div>
            {project.pinned && <div className="project-banner-pinned">{PROJECT_PINNED_STAR_ICON_14}Pinned</div>}
        </div>
    );
};
