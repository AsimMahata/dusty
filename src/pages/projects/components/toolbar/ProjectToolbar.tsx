import React from 'react';
import { PROJECT_SORT_OPTIONS, PROJECT_MENU_TAGS_ICON } from '../../constants/constants';
import type { ProjectHook } from '../../types/types';
import { SortOptions } from '../../../../components/ui/sortUi/SortOptions';

interface ProjectToolbarProps {
    projectHook: ProjectHook;
}

export const ProjectToolbar: React.FC<ProjectToolbarProps> = ({ projectHook }) => {
    const isFetching = projectHook.isFetchingAllTags;

    return (
        <div className="project-toolbar">
            <div className="project-toolbar-actions">
                <button
                    className={`project-fetch-tags-btn ${isFetching ? 'fetching' : ''}`}
                    onClick={() => void projectHook.handleFetchAllTags()}
                    disabled={isFetching}
                    title="Fetch tags for all projects"
                >

                    {PROJECT_MENU_TAGS_ICON}
                    <span>{isFetching ? 'Fetching Tags...' : 'Fetch All Tags'}</span>
                </button>
            </div>

            <div className="project-toolbar-spacer"></div>

            <div className="project-sort">
                <SortOptions
                    sortMethod={projectHook.sortOption}
                    sortAscending={projectHook.sortAscending}
                    setSortAscending={projectHook.setSortAscending}
                    handleSortChange={(method) => projectHook.setSortOption(method as any)}
                    options={PROJECT_SORT_OPTIONS}
                    defaultSortMethodLabel="Project Status"
                />
            </div>
        </div>
    );
};

