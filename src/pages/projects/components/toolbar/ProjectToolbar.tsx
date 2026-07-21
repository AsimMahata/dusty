import React from 'react';
import { PROJECT_SORT_OPTIONS } from '../../constants/constants';
import type { ProjectHook } from "../../../../types/projects";

interface ProjectToolbarProps {
    projectHook: ProjectHook;
}

export const ProjectToolbar: React.FC<ProjectToolbarProps> = ({ projectHook }) => {
    return (
        <div className="project-toolbar">
            <div className="project-toolbar-spacer"></div>

            <div className="project-sort">
                <select 
                    value={projectHook.sortOption} 
                    onChange={e => projectHook.setSortOption(e.target.value as any)}
                    className="project-sort-select"
                >
                    {PROJECT_SORT_OPTIONS.map(option => (
                        <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};
