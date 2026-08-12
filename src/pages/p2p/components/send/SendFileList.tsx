import React from "react";
import { File, Tv, Trash2 } from "lucide-react";
import type { TransferItem } from "../../../../personalities/ambiverts/p2p";

interface SendFileListProps {
    files?: string[];
    items?: TransferItem[];
    onRemoveFile?: (index: number) => void;
}

export const SendFileList: React.FC<SendFileListProps> = ({ files = [], items, onRemoveFile }) => {
    if (items && items.length > 0) {
        return (
            <div className="file-list-container">
                <div className="file-list-header">
                    <span>Stashed Items ({items.length})</span>
                </div>
                <div className="file-list">
                    {items.map((item, idx) => {
                        const isShow = item.type === "show";
                        const name = isShow
                            ? `Show: ${item.show.title} (${item.show.episodes?.length || 0} episodes)`
                            : item.path;

                        return (
                            <div key={idx} className="file-item">
                                <div className="file-item-info">
                                    <div className="file-icon-badge">
                                        {isShow ? (
                                            <Tv size={16} color="var(--accent)" />
                                        ) : (
                                            <File size={16} color="var(--accent)" />
                                        )}
                                    </div>
                                    <span className="file-item-name" title={name}>{name}</span>
                                </div>
                                {onRemoveFile && (
                                    <button
                                        className="file-remove-btn"
                                        onClick={() => onRemoveFile(idx)}
                                        title="Remove item"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

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
                        {onRemoveFile && (
                            <button
                                className="file-remove-btn"
                                onClick={() => onRemoveFile(idx)}
                                title="Remove file"
                            >
                                <Trash2 size={15} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};


