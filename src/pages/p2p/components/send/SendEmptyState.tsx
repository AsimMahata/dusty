import React from "react";
import { UploadCloud, Plus } from "lucide-react";
import { P2P_STRINGS } from "../../constants/constants";

interface SendEmptyStateProps {
    onSelectFiles: () => void;
}

export const SendEmptyState: React.FC<SendEmptyStateProps> = ({ onSelectFiles }) => {
    return (
        <div className="p2p-dropzone" onClick={onSelectFiles}>
            <div className="p2p-empty-icon-wrapper">
                <UploadCloud size={44} className="p2p-empty-icon" />
            </div>
            <h4 className="p2p-dropzone-title">Click to select files or drop here</h4>
            <p className="p2p-empty-hint">{P2P_STRINGS.SEND_SUBTITLE}</p>
            <button
                type="button"
                className="p2p-btn p2p-btn-primary"
                onClick={(e) => {
                    e.stopPropagation();
                    onSelectFiles();
                }}
            >
                <Plus size={16} />
                {P2P_STRINGS.SELECT_FILES_BTN}
            </button>
        </div>
    );
};

