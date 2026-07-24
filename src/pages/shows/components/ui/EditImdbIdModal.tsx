import React from 'react';
import { useShow } from '../../hooks/useShow';

interface EditImdbIdModalProps {
    showHook: ReturnType<typeof useShow>;
}

export const EditImdbIdModal: React.FC<EditImdbIdModalProps> = ({
    showHook,
}) => {
    const { setImdbId, showEditImdbId, currentEditShowImdb, imdbId, handleSaveImdbId, handleCancelEditImdbId } = showHook;
    if (!showEditImdbId || !currentEditShowImdb) return null;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveImdbId();
        } else if (e.key === 'Escape') {
            handleCancelEditImdbId();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleCancelEditImdbId}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">Edit IMDB ID</h2>
                <p className="modal-message">
                    Set the IMDB ID for <strong>{currentEditShowImdb.title}</strong>
                </p>
                <input
                    type="text"
                    className="mal-id-input"
                    value={imdbId ?? ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        setImdbId(val === '' ? null : val);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. tt1234567"
                    autoFocus
                />
                <div className="modal-actions">
                    <button className="btn-cancel" onClick={handleCancelEditImdbId}>
                        Cancel
                    </button>
                    <button className="btn-confirm primary" onClick={handleSaveImdbId}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};
