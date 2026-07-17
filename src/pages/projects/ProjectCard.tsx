import React from 'react';
import type { Project } from '../../types/types';
import { PROJECT_TAGS } from '../../constants/projectTags';
import { GIT_STATUS, PROJECT_STATUS } from '../../constants/projectStatus';
import { Folder, Star, Zap, Monitor, FolderOpen, Globe, MoreVertical } from 'lucide-react';
import { generateTagGradient } from '../../utility/gradient';
import { logger } from '../../utility/logger';

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
    const gitStatus = GIT_STATUS.getDefinition(project.git_status);
    const projectStatus = PROJECT_STATUS.getDefinition(project.status);

    return (
        <div 
            className={`project-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onClick(project)}
            style={{ ...style, borderBottom: `2px solid ${projectStatus.color}` }}
        >
            {project.pinned && <div className="project-card-pin-indicator"><Star size={16} fill="currentColor" /></div>}

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
                        <div className="project-card-logo-placeholder"><Folder size={48} opacity={0.8} /></div>
                    )}
                </div>
            )}

            <div className="project-card-info">
                <div className="project-card-header">
                    <h3 className="project-card-title" title={project.title}>
                        {project.title}
                    </h3>
                    <div className="project-card-header-actions">
                        <span 
                            className="project-card-project-status" 
                            title={`Project Status: ${projectStatus.label}`}
                            style={{ color: projectStatus.color }}
                        >
                            {projectStatus.icon}
                        </span>
                        <span 
                            className="project-card-git-status" 
                            title={`Git Status: ${gitStatus.label}`}
                            style={{ color: gitStatus.color }}
                        >
                            {gitStatus.icon}
                        </span>
                        <button 
                            className="project-card-menu-btn" 
                            onClick={(e) => {
                                e.stopPropagation();
                                onThreeDotClick?.(e, project);
                            }}
                        >
                            <MoreVertical size={18} />
                        </button>
                    </div>
                </div>

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

                <div className="project-card-meta">
                    <span>Updated {project.last_modified || "Today"}</span>
                </div>

                <div className="project-card-actions">
                    <button 
                        className="project-card-action-icon"
                        title="Open Project"
                        onClick={(e) => { e.stopPropagation(); onClick(project); }}
                    >
                        <Zap size={18} />
                    </button>
                    <button 
                        className="project-card-action-icon"
                        title="Open in VSCode"
                        onClick={(e) => { e.stopPropagation(); onOpenVSCode?.(e, project); }}
                    >
                        <Monitor size={18} />
                    </button>
                    <button 
                        className="project-card-action-icon"
                        title="Reveal in Explorer"
                        onClick={(e) => { e.stopPropagation(); logger.info(`TODO: Reveal in Explorer for project: ${project.title}`); }}
                    >
                        <FolderOpen size={18} />
                    </button>
                    <button 
                        className="project-card-action-icon"
                        title="Open GitHub"
                        onClick={(e) => { e.stopPropagation(); logger.info(`TODO: Open GitHub for project: ${project.title}`); }}
                    >
                        <Globe size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
