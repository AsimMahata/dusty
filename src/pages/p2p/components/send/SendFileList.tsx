import React from "react";
import { File, Trash2 } from "lucide-react";

interface SendFileListProps {
    files: string[];
    onRemoveFile: (index: number) => void;
}

export const SendFileList: React.FC<SendFileListProps> = ({ files, onRemoveFile }) => {
    return (
        <div className="file-list-container">
            <div className="file-list-header">
                <span>Selected Files ({files.length})</span>
            </div>
            <div className="file-list">
                {files.map((file, idx) => (
                    <div key={idx} className="file-item">
                        <div className="file-item-info">
                            <div className="file-icon-badge">
                                <File size={16} color="var(--accent)" />
                            </div>
                            <span className="file-item-name" title={file}>{file}</span>
                        </div>
                        <button
                            className="file-remove-btn"
                            onClick={() => onRemoveFile(idx)}
                            title="Remove file"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

