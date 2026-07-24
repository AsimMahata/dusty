import React from 'react';
import type { Project } from '../../../types/types';
import { COLORS } from '../../../../../constants/color';

interface ProjectDetailMetaProps {
    project: Project;
}

const getFrameworkColor = (framework?: string): string => {
    if (!framework) return 'var(--text-primary)';
    return COLORS.FRAMEWORK[framework] || 'var(--text-primary)';
};

const getBranchColor = (branch?: string): string => {
    if (!branch) return 'var(--text-primary)';
    const b = branch.toLowerCase();
    if (b === 'main' || b === 'master' || b === 'production') {
        return COLORS.BRANCH.MAIN;
    }
    return COLORS.BRANCH.OTHER;
};

export const ProjectDetailMeta: React.FC<ProjectDetailMetaProps> = ({ project }) => {
    const framework = project.project_type || "Unknown";
    const branch = project.git_info?.git_branch || "main";
    const lastOpened = project.last_opened || "Today";
    const lastModified = project.last_modified || "Today";

    return (
        <div className="project-banner-meta-grid">
            <div className="meta-column">
                <span className="meta-label">Framework</span>
                <span className="meta-value" style={{ color: getFrameworkColor(framework) }}>
                    {framework}
                </span>
            </div>
            <div className="meta-column">
                <span className="meta-label">Git Branch</span>
                <span className="meta-value" style={{ color: getBranchColor(branch) }}>
                    {branch}
                </span>
            </div>
            <div className="meta-column">
                <span className="meta-label">Last Opened</span>
                <span className="meta-value">{lastOpened}</span>
            </div>
            <div className="meta-column">
                <span className="meta-label">Last Modified</span>
                <span className="meta-value">{lastModified}</span>
            </div>
        </div>
    );
};
