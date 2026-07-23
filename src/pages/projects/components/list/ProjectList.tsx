import React from 'react';
import { ProjectCard } from './card/ProjectCard';
import { ProjectEmptyState } from './ProjectEmptyState';
import type { ProjectHook } from "../../../../types/projects";
import type { Project } from "../../../../types/projects";

interface ProjectListProps {
    projectHook: ProjectHook;
}

export const ProjectList: React.FC<ProjectListProps> = ({ projectHook }) => {
    const { displayProjects, selectedItem, setSelectedItem, setContextMenu, startExploring } = projectHook;

    const handleThreeDotClick = (e: React.MouseEvent, project: Project) => {
        e.stopPropagation();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            project
        });
    };

    if (displayProjects.length === 0) {
        return <ProjectEmptyState />;
    }

    return (
        <div className="projects-grid">
            {displayProjects.map((project, index) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    isSelected={selectedItem?.id === project.id}
                    onClick={(p) => setSelectedItem(selectedItem?.id === p.id ? null : p)}
                    onOpen={(p) => {
                        setSelectedItem(p);
                        startExploring(p.path);
                    }}
                    onThreeDotClick={handleThreeDotClick}
                    style={{ animationDelay: `${index * 0.05}s` }}
                />
            ))}
        </div>
    );
};
