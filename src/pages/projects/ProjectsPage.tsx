import React from 'react';
import { useProject } from '../../hooks/projects/useProject';
import { ProjectBanner } from './components/banner/ProjectBanner';
import { ProjectList } from './components/list/ProjectList';
import { ProjectToolbar } from './components/toolbar/ProjectToolbar';
import { ProjectExplorerCurtain } from './components/explorer/ProjectExplorerCurtain';
import { ProjectDialogManager } from './components/dialogs/ProjectDialogManager';
import { PageLayout } from '../../components/layout/PageLayout';
import { FloatingScrollTop } from '../../components/ui/FloatingScrollTop';
import './css/Projects.css';

export const ProjectsPage: React.FC = () => {
    const projectHook = useProject();

    return (
        <PageLayout hook={projectHook} >
            <ProjectBanner projectHook={projectHook} />
            {projectHook.explorePath ? (
                <ProjectExplorerCurtain projectHook={projectHook} />
            ) : (
                <div className="projects-content">
                    <ProjectToolbar projectHook={projectHook} />
                    <ProjectList projectHook={projectHook} />
                </div>
            )}
            <ProjectDialogManager projectHook={projectHook} />
            <FloatingScrollTop />
        </PageLayout>
    );
};
