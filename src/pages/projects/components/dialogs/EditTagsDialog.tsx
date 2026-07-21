import React, { useState, useEffect } from 'react';
import { PROJECT_TAGS } from '../../../../constants/projectTags';
import { Check, FileText } from 'lucide-react';
import type { Project } from "../../../../types/projects";
import { scanProjectTags } from '../../../../personalities/introverts/projects/projects';
import { PROJECT_ACTION_LABELS } from '../../constants/constants';

interface EditTagsDialogProps {
    project: Project;
    onClose: () => void;
    onSave: (newTags: string[]) => Promise<boolean>;
}

export const EditTagsDialog: React.FC<EditTagsDialogProps> = ({ project, onClose, onSave }) => {
    const [selectedTags, setSelectedTags] = useState<Set<string>>(
        new Set(project.tags?.map(t => t.toLowerCase()) || [])
    );
    const [scannedTags, setScannedTags] = useState<Set<string>>(new Set());
    const [isScanning, setIsScanning] = useState(false);
    const [hasScanCompleted, setHasScanCompleted] = useState(false);
    const [tagSearch, setTagSearch] = useState("");
    const predefined = PROJECT_TAGS.getAllPredefined();
    const visibleTags = predefined.filter(tag =>
        tag.label.toLowerCase().includes(tagSearch.trim().toLowerCase())
    );

    const handleToggleTag = (tagId: string) => {
        const next = new Set(selectedTags);
        if (next.has(tagId)) {
            next.delete(tagId);
        } else {
            next.add(tagId);
        }
        setSelectedTags(next);
    };

    const handleSave = async () => {
        const didSave = await onSave(Array.from(selectedTags));
        if (didSave) {
            onClose();
        }
    };

    const handleScanTags = async () => {
        setIsScanning(true);
        setHasScanCompleted(false);
        const result = await scanProjectTags(project);
        if (result.length > 0) {
            const scannedSet = new Set(result);
            setScannedTags(scannedSet);
            setSelectedTags(prev => {
                const merged = new Set(prev);
                scannedSet.forEach(tag => merged.add(tag));
                return merged;
            });
        }
        setHasScanCompleted(true);
        setIsScanning(false);
    };

    useEffect(() => {
        if (!project.tags || project.tags.length === 0) {
            void handleScanTags();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getScanButtonLabel = () => {
        if (isScanning) return PROJECT_ACTION_LABELS.SCANNING_TAGS;
        if (hasScanCompleted) return PROJECT_ACTION_LABELS.SCANNED_TAGS;
        return PROJECT_ACTION_LABELS.SCAN_TAGS;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content tag-dialog" onClick={e => e.stopPropagation()}>
                <div className="tag-dialog-heading">
                    <h2 className="modal-title">Edit Tags for {project.title}</h2>
                    <button
                        className={`tag-scan-btn ${hasScanCompleted ? 'scanned' : ''}`}
                        onClick={handleScanTags}
                        disabled={isScanning}
                    >
                        {hasScanCompleted && <FileText size={13} />}
                        {getScanButtonLabel()}
                    </button>
                </div>
                <div className="modal-message">Select the tags that apply to this project.</div>

                <input
                    className="tag-search-input"
                    type="search"
                    value={tagSearch}
                    onChange={(event) => setTagSearch(event.target.value)}
                    placeholder={PROJECT_ACTION_LABELS.SEARCH_TAGS_PLACEHOLDER}
                />
                
                <div className="tags-dialog-list">
                    {visibleTags.map(tag => {
                        const isSelected = selectedTags.has(tag.id);
                        const isScanned = scannedTags.has(tag.id);
                        return (
                            <button
                                key={tag.id}
                                className={`tag-select-btn ${isSelected ? 'selected' : ''} ${isScanned ? 'scanned' : ''}`}
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
                                {isScanned && <span className="tag-scanned-badge">SCAN</span>}
                            </button>
                        );
                    })}
                </div>

                <div className="modal-actions tag-dialog-actions">
                    <button className="btn-cancel" onClick={onClose}>{PROJECT_ACTION_LABELS.CANCEL}</button>
                    <button className="btn-confirm primary" onClick={handleSave}>{PROJECT_ACTION_LABELS.SAVE}</button>
                </div>
            </div>
        </div>
    );
};
