import React from 'react';
import type { Project } from "../../../../../types/projects";

interface ProjectDetailMetaProps {
    project: Project;
}

const getFrameworkColor = (framework?: string): string => {
    if (!framework) return 'var(--text-primary)';
    switch (framework) {
        case 'React': return '#61dafb';
        case 'Next.js': return '#ffffff';
        case 'Vue': return '#42b883';
        case 'Angular': return '#dd0031';
        case 'Svelte': return '#ff3e00';
        case 'Astro': return '#ff5d01';
        case 'SolidJS': return '#446b9e';
        case 'Tauri': return '#ffc107';
        case 'Electron': return '#9feaf9';
        case 'Flutter': return '#02569b';
        case 'Django': return '#092e20';
        case 'Flask': return '#ffffff';
        case 'FastAPI': return '#059669';
        case 'Spring Boot': return '#6db33f';
        case 'Express': return '#828282';
        case 'NestJS': return '#ea2845';
        case 'Rails': return '#cc0000';
        case 'Laravel': return '#ff2d20';
        case '.NET': return '#512bd4';
        default: return 'var(--text-primary)';
    }
};

const getBranchColor = (branch?: string): string => {
    if (!branch) return 'var(--text-primary)';
    const b = branch.toLowerCase();
    if (b === 'main' || b === 'master' || b === 'production') {
        return '#4ade80'; // Bright green for main/production branches
    }
    return '#a855f7'; // Purple/violet for other branches
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
