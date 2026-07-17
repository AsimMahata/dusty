import React from 'react';
import type { ProjectHook } from '../../../../hooks/projects/useProject';
import { DefaultProjectBanner } from './DefaultProjectBanner';
import { ActiveProjectPanel } from './ActiveProjectPanel';

interface ProjectBannerProps {
    projectHook: ProjectHook;
}

export const ProjectBanner: React.FC<ProjectBannerProps> = ({ projectHook }) => {
    return (
        <div className="project-banner-wrapper">
            {projectHook.selectedItem ? (
                <div className="active-project-panel-container">
                    <ActiveProjectPanel projectHook={projectHook} />
                </div>
            ) : (
                <DefaultProjectBanner allProjects={projectHook.allProjects} />
            )}
        </div>
    );
};
