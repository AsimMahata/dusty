import React from "react";
import { P2P_STRINGS } from "../../constants/constants";

interface TransferOverallProgressProps {
    progress: number;
    speedBytesPerSec?: number;
}

export const TransferOverallProgress: React.FC<TransferOverallProgressProps> = ({ progress, speedBytesPerSec }) => {
    const formatSpeed = (bytesPerSec?: number) => {
        if (!bytesPerSec || bytesPerSec <= 0) return "0 Bytes/s";
        const k = 1024;
        const sizes = ["Bytes/s", "KB/s", "MB/s", "GB/s"];
        const i = Math.min(Math.floor(Math.log(bytesPerSec) / Math.log(k)), sizes.length - 1);
        const val = parseFloat((bytesPerSec / Math.pow(k, i)).toFixed(1));
        return `${val} ${sizes[i]}`;
    };

    return (
        <div className="progress-section progress-section-overall">
            <div className="progress-label progress-label-bold" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{P2P_STRINGS.OVERALL_PROGRESS}</span>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    {speedBytesPerSec !== undefined && (
                        <span style={{ fontSize: "0.85rem", color: "var(--accent)", fontWeight: 600 }}>
                            {formatSpeed(speedBytesPerSec)}
                        </span>
                    )}
                    <span>{Math.round(progress)}%</span>
                </div>
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
