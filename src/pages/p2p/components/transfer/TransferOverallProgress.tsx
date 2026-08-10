import React from "react";
import { P2P_STRINGS } from "../../constants/constants";

interface TransferOverallProgressProps {
    progress: number;
}

export const TransferOverallProgress: React.FC<TransferOverallProgressProps> = ({ progress }) => {
    return (
        <div className="progress-section progress-section-overall">
            <div className="progress-label progress-label-bold">
                <span>{P2P_STRINGS.OVERALL_PROGRESS}</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="overall-progress-bar-bg">
                <div
                    className="overall-progress-bar-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};
