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

    if (selectedItem) {
        const gitStatus = GIT_STATUS.getDefinition(selectedItem.git_status);
        const projectStatus = PROJECT_STATUS.getDefinition(selectedItem.status);

        return (
            <div className="project-banner active-project" style={{ borderBottom: `2px solid ${projectStatus.color}` }}>
                {selectedItem.cover_image ? (
                    <div className="project-banner-bg" style={{ backgroundImage: `url(${selectedItem.cover_image})` }} />
                ) : (
                    <div className="project-banner-bg fallback-bg" style={{ background: generateTagGradient(selectedItem.tags) }} />
                )}
                
                <div className="project-banner-content">
                    <div className="project-banner-header">
                        {selectedItem.logo ? (
                            <img src={selectedItem.logo} alt="Logo" className="project-banner-logo" />
                        ) : (
                            <div className="project-banner-logo-placeholder"><Folder size={48} opacity={0.8} /></div>
                        )}
                        <div className="project-banner-title">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <h1>{selectedItem.title}</h1>
                                <button 
                                    className="project-btn icon-only" 
                                    title="Reveal in File Explorer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        invoke('cmd_open_file', { path: selectedItem.path }).catch(console.error);
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
                        {selectedItem.pinned && <div className="project-banner-pinned"><Star size={14} fill="currentColor" style={{ marginRight: '4px', position: 'relative', top: '2px' }}/>Pinned</div>}
                    </div>

                    <div className="project-banner-tags">
                        {selectedItem.tags?.map((tagString, index) => {
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
                        {(!selectedItem.tags || selectedItem.tags.length === 0) && (
                            <span className="project-banner-tag empty">No tags</span>
                        )}
                    </div>

                    {selectedItem.description && (
                        <div className="project-banner-description">
                            {selectedItem.description}
                        </div>
                    )}

                    <div className="project-banner-meta-grid">
                        <div className="meta-column">
                            <span className="meta-label">Framework</span>
                            <span className="meta-value">{selectedItem.project_type || "Unknown"}</span>
                        </div>
                        <div className="meta-column">
                            <span className="meta-label">Git Branch</span>
                            <span className="meta-value">{selectedItem.git_branch || "main"}</span>
                        </div>
                        <div className="meta-column">
                            <span className="meta-label">Size</span>
                            <span className="meta-value">{selectedItem.size || "Unknown"}</span>
                        </div>
                        <div className="meta-column">
                            <span className="meta-label">Last Opened</span>
                            <span className="meta-value">{selectedItem.last_opened || "Today"}</span>
                        </div>
                        <div className="meta-column">
                            <span className="meta-label">Last Modified</span>
                            <span className="meta-value">{selectedItem.last_modified || "Today"}</span>
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
                            <button className="project-btn primary" onClick={() => hook.startExploring(selectedItem.path)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '90px' }}>Open</button>
                            <button className="project-btn">VSCode</button>
                            <button className="project-btn">GitHub</button>
                            <button className="project-btn" onClick={() => setEditingTagsProject(selectedItem)}>Edit Tags</button>
                            <button className="project-btn" onClick={() => hook.setSelectedItem(null)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', width: '90px' }}>Close</button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Default generic banner
    const pinnedCount = allProjects.filter(p => p.pinned).length;
    return (
        <div className="project-banner default-banner">
            <div className="project-banner-bg" style={{ 
                background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(79, 70, 229, 0.2) 100%)',
                opacity: 1 
            }} />
            <div className="project-banner-content center-content">
                <h1>Projects</h1>
                <div className="project-stats">
                    <div className="stat-item">
                        <span className="stat-value">{allProjects.length}</span>
                        <span className="stat-label">Projects</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">{pinnedCount}</span>
                        <span className="stat-label">Pinned</span>
                    </div>
                </div>
                <p className="project-quote">"Every great application begins with an empty folder."</p>
            </div>
        </div>
    );
};
