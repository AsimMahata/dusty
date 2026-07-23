import React from 'react';
import { PROJECT_STATUS } from '../../../../constants/projectStatus';
import { Check } from 'lucide-react';
import type { ProjectWorkflowStatus } from "../../../../types/projects";
import type { Project } from "../../../../types/projects";

interface ChangeStatusDialogProps {
    project: Project;
    onClose: () => void;
    onSave: (status: ProjectWorkflowStatus) => void;
}

export const ChangeStatusDialog: React.FC<ChangeStatusDialogProps> = ({ project, onClose, onSave }) => {
    const statuses = Object.values(PROJECT_STATUS.STATUSES);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="modal-title">Change Status for {project.title}</h2>
                <div className="modal-message">Select the current workflow status of this project.</div>
                
                <div className="status-dialog-list">
                    {statuses.map(status => {
                        const isSelected = project.status === status.id;
                        return (
                            <button
                                key={status.id}
                                className={`tag-select-btn ${isSelected ? 'selected' : ''}`}
                                onClick={() => onSave(status.id as ProjectWorkflowStatus)}
                                style={{
                                    '--tag-color': status.color,
                                    '--tag-bg': isSelected ? `${status.color}20` : 'transparent',
                                    '--tag-border': isSelected ? status.color : 'var(--border-color)'
                                } as React.CSSProperties}
                            >
                                <span className="tag-select-check">
                                    {isSelected ? <Check size={14} /> : ''}
                                </span>
                                <span className="tag-icon">{status.icon}</span>
                                <span className="tag-label">{status.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="modal-actions" style={{ marginTop: '24px' }}>
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};
