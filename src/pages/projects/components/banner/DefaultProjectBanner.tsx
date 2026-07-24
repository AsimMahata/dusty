import React from 'react';
import { getProjectBannerStats } from '../../actions/info';
import type { Project } from '../../types/types';
import { PROJECT_BANNER_FOLDER_ICON, PROJECT_PINNED_STAR_ICON_12 } from '../../constants/constants';

interface DefaultProjectBannerProps {
    allProjects: Project[];
}

export const DefaultProjectBanner: React.FC<DefaultProjectBannerProps> = ({ allProjects }) => {
    const { pinnedCount, statusEntries, totalCount } = getProjectBannerStats(allProjects);

    return (
        <div className="project-banner default-banner">
            <div className="project-banner-bg default-banner-gradient" />
            <div className="project-banner-content default-banner-content">
                <div className="default-banner-top">
                    <div className="default-banner-icon">
                        {PROJECT_BANNER_FOLDER_ICON}
                    </div>
                    <div className="default-banner-info">
                        <h1 className="default-banner-title">Projects</h1>
                        <div className="default-banner-pills">
                            <span className="default-banner-pill">
                                <span className="pill-value">{totalCount}</span> projects
                            </span>
                            {pinnedCount > 0 && (
                                <span className="default-banner-pill pinned">
                                    {PROJECT_PINNED_STAR_ICON_12}
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
    );
};
