import React from 'react';
import type { Project } from '../../types/types';

export type SortOption = 
    | "recently_opened"
    | "recently_modified"
    | "alphabetical"
    | "pinned"
    | "git_status"
    | "project_status"
    | "creation_date";

interface ProjectToolbarProps {
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    sortOption: SortOption;
    setSortOption: (s: SortOption) => void;
}

export const ProjectToolbar: React.FC<ProjectToolbarProps> = ({ 
    sortOption, 
    setSortOption 
}) => {
    return (
        <div className="project-toolbar">
            <div className="project-toolbar-spacer"></div>

            <div className="project-sort">
                <select 
                    value={sortOption} 
                    onChange={e => setSortOption(e.target.value as SortOption)}
                    className="project-sort-select"
                >
                    <option value="recently_opened">Recently Opened</option>
                    <option value="recently_modified">Recently Modified</option>
                    <option value="alphabetical">Alphabetical</option>
                    <option value="pinned">Pinned First</option>
                    <option value="git_status">Git Status</option>
                    <option value="project_status">Project Status</option>
                </select>
            </div>
        </div>
    );
};
