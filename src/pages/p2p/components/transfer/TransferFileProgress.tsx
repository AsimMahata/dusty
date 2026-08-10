import React from "react";
import { FileText } from "lucide-react";
import type { TransferFileProgress as TransferFileProgressType } from "../../../../personalities/ambiverts/p2p";

interface TransferFileProgressProps {
    file: TransferFileProgressType;
}

export const TransferFileProgressItem: React.FC<TransferFileProgressProps> = ({ file }) => {
    return (
        <div className="progress-section">
            <div className="progress-label">
                <span className="file-progress-name">
                    <FileText size={15} style={{ color: "var(--accent)" }} />
                    {file.name}
                </span>
                <span className="file-progress-percent">{Math.round(file.progress)}%</span>
            </div>
            <div className="progress-bar-bg">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${file.progress}%` }}
                />
            </div>
        </div>
    );
};

