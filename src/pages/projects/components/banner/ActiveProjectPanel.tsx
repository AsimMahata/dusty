import React from 'react';
import { generateTagGradient } from '../../utility/gradient';
import { ProjectDetailHeader } from './detail/ProjectDetailHeader';
import { ProjectDetailTags } from './detail/ProjectDetailTags';
import { ProjectDetailMeta } from './detail/ProjectDetailMeta';
import { ProjectDetailActions } from './detail/ProjectDetailActions';
import { ProjectDetailDescription } from './detail/ProjectDetailDescription';
import type { ProjectHook } from '../../types/types';
import { PROJECT_STATUS } from '../../constants/constants';

interface ActiveProjectPanelProps {
    projectHook: ProjectHook;
}

export const ActiveProjectPanel: React.FC<ActiveProjectPanelProps> = ({
    projectHook
}) => {
    const project = projectHook.selectedItem;
    const gitInfo = projectHook.gitInfo;
    if (!project) return null;

    const projectStatus = PROJECT_STATUS.getDefinition(project.status);

    return (
        <div className="active-project-panel" style={{ borderBottom: `2px solid ${projectStatus.color}` }}>
            {project.cover_image ? (
                <div className="project-banner-bg" style={{ backgroundImage: `url(${project.cover_image})` }} />
            ) : (
                <div className="project-banner-bg fallback-bg" style={{ background: generateTagGradient(project.tags) }} />
            )}

            <div className="active-panel-content">
                <ProjectDetailHeader project={project} gitInfo={gitInfo} />
                <ProjectDetailTags project={project} />

                <ProjectDetailDescription project={project} />

                <ProjectDetailMeta project={project} />

                <ProjectDetailActions projectHook={projectHook} />
            </div>
        </div>
    );
};
