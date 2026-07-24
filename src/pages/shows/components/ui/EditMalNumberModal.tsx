import React from 'react';
import { useShow } from '../../hooks/useShow';

interface EditMalNumberModalProps {
    showHook: ReturnType<typeof useShow>;
}

export const EditMalNumberModal: React.FC<EditMalNumberModalProps> = ({
    showHook,
}) => {
    const { setMalNumber, showEditMalId, currentEditShow, malNumber, handleSaveMalId, handleCancelEditMalId } = showHook;
    if (!showEditMalId || !currentEditShow) return null;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveMalId();
        } else if (e.key === 'Escape') {
            handleCancelEditMalId();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleCancelEditMalId}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">Edit MAL ID</h2>
                <p className="modal-message">
                    Set the MyAnimeList ID for <strong>{currentEditShow.title}</strong>
                </p>
                <input
                    type="number"
                    className="mal-id-input"
                    value={malNumber ?? ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        setMalNumber(val === '' ? null : Number(val));
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. 21"
                    autoFocus
                    min={1}
                />
                <div className="modal-actions">
                    <button className="btn-cancel" onClick={handleCancelEditMalId}>
                        Cancel
                    </button>
                    <button className="btn-confirm primary" onClick={handleSaveMalId}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};
