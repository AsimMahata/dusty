import React from 'react';

import type { ProjectHook } from '../../../types/types';
import { openInVsCode } from '../../../../../personalities/introverts/filesystem/filesystem';
import { openProjectGithub } from '../../../../../personalities/introverts/projects/projects';
import { openTerminal } from '../../../../../personalities/introverts/terminal/terminal';
import { PROJECT_BACK_ARROW_ICON, PROJECT_CLOSE_X_ICON } from '../../../constants/constants';

interface ProjectDetailActionsProps {
    projectHook: ProjectHook;
}

export const ProjectDetailActions: React.FC<ProjectDetailActionsProps> = ({
    projectHook
}) => {
    const {
        explorePath,
        selectedItem,
        handleExploreBack,
        closeExplorer,
        startExploring,
        setEditingTagsProject,
        setSelectedItem,
        gitInfo
    } = projectHook;

    if (!selectedItem) return null;

    if (explorePath) {
        return (
            <div className="project-banner-actions">
                <button className="project-btn" onClick={handleExploreBack} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '90px' }}>
                    {PROJECT_BACK_ARROW_ICON} Back
                </button>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 0.75rem', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                        {explorePath}
                    </span>
                </div>

                <button className="project-btn" onClick={closeExplorer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginLeft: 'auto', width: '90px' }}>
                    {PROJECT_CLOSE_X_ICON} Close
                </button>
            </div>
        );
    }

    return (
        <div className="project-banner-actions">
            <button className="project-btn primary" onClick={() => startExploring(selectedItem.path)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '90px' }}>Open</button>
            <button className="project-btn vscode" onClick={() => void openInVsCode(selectedItem.path)}>VSCode</button>
            <button className="project-btn terminal" onClick={() => void openTerminal(selectedItem.path)}>Terminal</button>
            <button className="project-btn github" onClick={() => void openProjectGithub(gitInfo)}>GitHub</button>
            <button className="project-btn tags" onClick={() => setEditingTagsProject(selectedItem)}>
                {selectedItem.tags && selectedItem.tags.length > 0 ? "Edit Tags" : "Scan Tags"}
            </button>
            <button className="project-btn" onClick={() => setSelectedItem(null)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', width: '90px' }}>Close</button>
        </div>
    );
};
