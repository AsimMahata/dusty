import React from 'react';
import { DefaultProjectBanner } from './DefaultProjectBanner';
import { ActiveProjectPanel } from './ActiveProjectPanel';
import type { ProjectHook } from "../../../../types/projects";

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
