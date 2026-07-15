import React from 'react';
import { CategoryPage } from '../components/category/CategoryPage';
import { FileExplorer } from '../components/FileExplorer';
import { PageLayout } from '../components/layout/PageLayout';
import { useProject } from '../hooks/projects/useProject';
import { useProjectTab } from '../hooks/projects/useProjectTab';

export const Projects: React.FC = () => {
    const project = useProject();
    const projectTab = useProjectTab(project);

    return (
        <PageLayout
            hook={project}
        >
            {project.selectedItem && project.selectedItem.path ? (
                <FileExplorer 
                    initialPath={project.selectedItem.path} 
                    title={project.selectedItem.title} 
                    onBack={() => project.setSelectedItem(null)} 
                />
            ) : (
                <CategoryPage tab={projectTab} />
            )}
        </PageLayout>
    );
};
