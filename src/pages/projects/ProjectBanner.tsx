import React from 'react';
import { useProject } from '../../hooks/projects/useProject';
import { invoke } from '@tauri-apps/api/core';
import type { Project } from '../../types/types';

import { PROJECT_TAGS } from '../../constants/projectTags';
import { GIT_STATUS, PROJECT_STATUS } from '../../constants/projectStatus';
import { Folder, Star, ArrowLeft, X, ExternalLink } from 'lucide-react';
import { generateTagGradient } from '../../utility/gradient';

interface ProjectBannerProps {
    hook: ReturnType<typeof useProject>;
}

export const ProjectBanner: React.FC<ProjectBannerProps> = ({ hook }) => {
    const { selectedItem, allProjects, setSelectedItem, setEditingTagsProject } = hook;

    const pinnedCount = allProjects.filter(p => p.pinned).length;

    const statusCounts = allProjects.reduce((acc, p) => {
        const key = p.status || 'default';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const statusEntries = Object.entries(PROJECT_STATUS.STATUSES)
        .filter(([key]) => key !== 'default')
        .map(([key, def]) => ({
            ...def,
            count: statusCounts[key] || 0,
        }))
        .filter(entry => entry.count > 0);

    return (
        <div className="project-banner-wrapper">
            {selectedItem ? (
                <div className="active-project-panel-container">
                    <ActiveProjectPanel hook={hook} project={selectedItem} />
                </div>
            ) : (
                <div className="project-banner default-banner">
                    <div className="project-banner-bg" style={{ 
                        background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(79, 70, 229, 0.08) 50%, rgba(10, 10, 12, 0) 100%)',
                        opacity: 1 
                    }} />
                    <div className="project-banner-content default-banner-content">
                        <div className="default-banner-top">
                            <div className="default-banner-icon">
                                <Folder size={28} />
                            </div>
                            <div className="default-banner-info">
                                <h1 className="default-banner-title">Projects</h1>
                                <div className="default-banner-pills">
                                    <span className="default-banner-pill">
                                        <span className="pill-value">{allProjects.length}</span> projects
                                    </span>
                                    {pinnedCount > 0 && (
                                        <span className="default-banner-pill pinned">
                                            <Star size={12} fill="currentColor" />
                                            <span className="pill-value">{pinnedCount}</span> pinned
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {statusEntries.length > 0 && (
                            <div className="default-banner-statuses">
                                {statusEntries.map(entry => (
                                    <div key={entry.id} className="default-status-chip">
                                        <span className="status-dot" style={{ background: entry.color }} />
                                        <span className="status-chip-label">{entry.label}</span>
                                        <span className="status-chip-count">{entry.count}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

/* ── Active Project Panel (slide-down) ── */

interface ActiveProjectPanelProps {
    hook: ReturnType<typeof useProject>;
    project: Project;
}

const ActiveProjectPanel: React.FC<ActiveProjectPanelProps> = ({ hook, project }) => {
    const { setSelectedItem, setEditingTagsProject } = hook;
    const gitStatus = GIT_STATUS.getDefinition(project.git_status);
    const projectStatus = PROJECT_STATUS.getDefinition(project.status);

    return (
        <div className="active-project-panel" style={{ borderBottom: `2px solid ${projectStatus.color}` }}>
            {project.cover_image ? (
                <div className="project-banner-bg" style={{ backgroundImage: `url(${project.cover_image})` }} />
            ) : (
                <div className="project-banner-bg fallback-bg" style={{ background: generateTagGradient(project.tags) }} />
            )}

            <div className="active-panel-content">
                <div className="project-banner-header">
                    {project.logo ? (
                        <img src={project.logo} alt="Logo" className="project-banner-logo" />
                    ) : (
                        <div className="project-banner-logo-placeholder"><Folder size={48} opacity={0.8} /></div>
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
                                <ExternalLink size={16} />
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
                    {project.pinned && <div className="project-banner-pinned"><Star size={14} fill="currentColor" style={{ marginRight: '4px', position: 'relative', top: '2px' }}/>Pinned</div>}
                </div>

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

                {project.description && (
                    <div className="project-banner-description">
                        {project.description}
                    </div>
                )}

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

                {hook.explorePath ? (
                    <div className="project-banner-actions">
                        <button className="project-btn" onClick={hook.handleExploreBack} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '90px' }}>
                            <ArrowLeft size={14} /> Back
                        </button>
                        
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 0.75rem', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                                {hook.explorePath}
                            </span>
                        </div>
                        
                        <button className="project-btn" onClick={hook.closeExplorer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginLeft: 'auto', width: '90px' }}>
                            <X size={14} /> Close
                        </button>
                    </div>
                ) : (
                    <div className="project-banner-actions">
                        <button className="project-btn primary" onClick={() => hook.startExploring(project.path)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '90px' }}>Open</button>
                        <button className="project-btn">VSCode</button>
                        <button className="project-btn">GitHub</button>
                        <button className="project-btn" onClick={() => setEditingTagsProject(project)}>Edit Tags</button>
                        <button className="project-btn" onClick={() => setSelectedItem(null)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', width: '90px' }}>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
};
