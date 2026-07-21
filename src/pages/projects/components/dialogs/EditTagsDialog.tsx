import React, { useState } from 'react';
import { PROJECT_TAGS } from '../../../../constants/projectTags';
import { Check } from 'lucide-react';
import type { Project } from "../../../../types/projects";

interface EditTagsDialogProps {
    project: Project;
    onClose: () => void;
    onSave: (newTags: string[]) => void;
}

export const EditTagsDialog: React.FC<EditTagsDialogProps> = ({ project, onClose, onSave }) => {
    const [selectedTags, setSelectedTags] = useState<Set<string>>(
        new Set(project.tags?.map(t => t.toLowerCase()) || [])
    );
    const predefined = PROJECT_TAGS.getAllPredefined();

    const handleToggleTag = (tagId: string) => {
        const next = new Set(selectedTags);
        if (next.has(tagId)) {
            next.delete(tagId);
        } else {
            next.add(tagId);
        }
        setSelectedTags(next);
    };

    const handleSave = () => {
        onSave(Array.from(selectedTags));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="modal-title">Edit Tags for {project.title}</h2>
                <div className="modal-message">Select the tags that apply to this project.</div>
                
                <div className="tags-dialog-list">
                    {predefined.map(tag => {
                        const isSelected = selectedTags.has(tag.id);
                        return (
                            <button
                                key={tag.id}
                                className={`tag-select-btn ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleToggleTag(tag.id)}
                                style={{
                                    '--tag-color': tag.color,
                                    '--tag-bg': isSelected ? `${tag.color}20` : 'transparent',
                                    '--tag-border': isSelected ? tag.color : 'var(--border-color)'
                                } as React.CSSProperties}
                            >
                                <span className="tag-select-check">
                                    {isSelected ? <Check size={14} /> : ''}
                                </span>
                                {tag.icon && <span className="tag-icon">{tag.icon}</span>}
                                <span className="tag-label">{tag.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="modal-actions" style={{ marginTop: '24px' }}>
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-confirm primary" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};
