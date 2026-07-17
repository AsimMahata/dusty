import React from 'react';
import { useProject } from '../../hooks/projects/useProject';
import { ProjectBanner } from './ProjectBanner';
import { ProjectCard } from './ProjectCard';
import { ProjectToolbar } from './ProjectToolbar';
import { ProjectContextMenu } from './ProjectContextMenu';
import { ChangeStatusDialog } from './ChangeStatusDialog';
import { EditTagsDialog } from './EditTagsDialog';
import { PageLayout } from '../../components/layout/PageLayout';
import { FileExplorer } from '../../components/FileExplorer';
import { ArrowUp } from 'lucide-react';
import type { Project } from '../../types/types';
import { logger } from '../../utility/logger';
import './Projects.css';

export const ProjectsPage: React.FC = () => {
    const projectHook = useProject();
    const { 
        selectedItem, setSelectedItem, searchQuery, setSearchQuery,
        sortOption, setSortOption, displayProjects,
        contextMenu, setContextMenu,
        changingStatusProject, setChangingStatusProject,
        editingTagsProject, setEditingTagsProject,
        explorePath,
        handleExploreItemClick
    } = projectHook;

    const [showScrollTop, setShowScrollTop] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.scrollTop > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        const scrollContainer = document.querySelector('.main-content');
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
        }
        return () => scrollContainer?.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        const scrollContainer = document.querySelector('.main-content');
        if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleThreeDotClick = (e: React.MouseEvent, project: Project) => {
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            project
        });
    };

    const handleRename = (project: Project) => {
        logger.info(`TODO: Implement Rename for project: ${project.title}`);
    };

    const handleDelete = (project: Project) => {
        logger.info(`TODO: Implement Delete for project: ${project.title}`);
    };


    return (
        <PageLayout 
            title="Projects" 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onRefresh={projectHook.fetchData}
            isRefreshing={projectHook.isRefreshing}
            isLoading={projectHook.isLoading}
        >
            <ProjectBanner hook={projectHook} />
            {explorePath ? (
                <div className="explorer-curtain-container">
                    <div className="explorer-curtain">
                        <FileExplorer 
                            currentPath={explorePath}
                            onBack={projectHook.handleExploreBack}
                            onItemClick={handleExploreItemClick}
                            inline={true}
                        />
                    </div>
                </div>
            ) : (
                <div className="projects-content">
                    <ProjectToolbar 
                        sortOption={sortOption} 
                        setSortOption={setSortOption} 
                    />
                    
                    <div className="projects-grid">
                        {displayProjects.map((project, index) => (
                            <ProjectCard 
                                key={project.id}
                                project={project}
                                isSelected={selectedItem?.id === project.id}
                                onClick={(p) => setSelectedItem(selectedItem?.id === p.id ? null : p)}
                                onThreeDotClick={handleThreeDotClick}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            />
                        ))}
                        {displayProjects.length === 0 && (
                            <div className="no-projects-found">No projects matched your search.</div>
                        )}
                    </div>
                </div>
            )}
            {contextMenu && (
                <ProjectContextMenu
                    project={contextMenu.project}
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    onPinToggle={(p) => {
                        projectHook.handleTogglePin(p.id);
                        if (selectedItem?.id === p.id) {
                            setSelectedItem({ ...selectedItem, pinned: !selectedItem.pinned });
                        }
                    }}
                    onChangeStatus={(p) => setChangingStatusProject(p)}
                    onEditTags={(p) => setEditingTagsProject(p)}
                    onRename={handleRename}
                    onDelete={handleDelete}
                />
            )}
            {changingStatusProject && (
                <ChangeStatusDialog 
                    project={changingStatusProject}
                    onClose={() => setChangingStatusProject(null)}
                    onSave={(newStatus) => {
                        if (selectedItem?.id === changingStatusProject.id) {
                            setSelectedItem({ ...selectedItem, status: newStatus });
                        }
                        setChangingStatusProject(null);
                    }}
                />
            )}
            {editingTagsProject && (
                <EditTagsDialog
                    project={editingTagsProject}
                    onClose={() => setEditingTagsProject(null)}
                    onSave={(newTags) => {
                        if (selectedItem?.id === editingTagsProject.id) {
                            setSelectedItem({ ...selectedItem, tags: newTags });
                        }
                        setEditingTagsProject(null);
                    }}
                />
            )}

            {showScrollTop && (
                <button 
                    className="floating-scroll-top"
                    onClick={scrollToTop}
                    title="Scroll to Top"
                >
                    <ArrowUp size={24} />
                </button>
            )}
        </PageLayout>
    );
};
