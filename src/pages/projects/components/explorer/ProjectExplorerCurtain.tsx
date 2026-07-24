import React from 'react';
import { FileExplorer } from '../../../../components/fileexplorer/FileExplorer';
import type { ProjectHook } from '../../types/types';

interface ProjectExplorerCurtainProps {
    projectHook: ProjectHook;
}

export const ProjectExplorerCurtain: React.FC<ProjectExplorerCurtainProps> = ({ projectHook }) => {
    if (!projectHook.explorePath) return null;

    return (
        <div className="explorer-curtain-container">
            <div className="explorer-curtain">
                <FileExplorer
                    currentPath={projectHook.explorePath}
                    onBack={projectHook.handleExploreBack}
                    onItemClick={projectHook.handleExploreItemClick}
                    inline={true}
                />
            </div>
        </div>
    );
};
