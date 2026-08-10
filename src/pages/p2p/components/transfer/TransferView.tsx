import React from "react";
import { ArrowDownCircle, XCircle, HardDrive } from "lucide-react";
import { TransferFileProgressItem } from "./TransferFileProgress";
import { TransferOverallProgress } from "./TransferOverallProgress";
import { cancelTransfer } from "../../../../personalities/introverts/p2p/p2p";
import { P2P_STRINGS } from "../../constants/constants";
import type { ActiveTransfer } from "../../../../personalities/ambiverts/p2p";

interface TransferViewProps {
    transfer: ActiveTransfer | null;
    onCancelComplete?: () => void;
}

export const TransferView: React.FC<TransferViewProps> = ({ transfer, onCancelComplete }) => {
    const handleCancel = async () => {
        await cancelTransfer();
        if (onCancelComplete) {
            onCancelComplete();
        }
    };

    const senderName = transfer?.sender_name || "Device";
    const files = transfer?.files || [
        { name: "movie.mkv", progress: 68 },
        { name: "song.mp3", progress: 100 },
    ];
    const overallProgress = transfer?.overall_progress ?? 72;

    return (
        <div className="p2p-workbench-container">
            <div className="transfer-card">
                <div className="transfer-header">
                    <div className="transfer-peer-group">
                        <div className="transfer-peer-icon">
                            <ArrowDownCircle size={32} style={{ color: "var(--accent)" }} />
                        </div>
                        <div>
                            <div className="transfer-peer-name">
                                {P2P_STRINGS.RECEIVING_FROM} {senderName}
                            </div>
                            <div className="transfer-peer-status">
                                <span className="status-live-dot" />
                                {P2P_STRINGS.TRANSFER_IN_PROGRESS}
                            </div>
                        </div>
                    </div>

                    <button className="p2p-btn p2p-btn-danger" onClick={handleCancel}>
                        <XCircle size={16} /> {P2P_STRINGS.CANCEL_BTN}
                    </button>
                </div>

                <div className="transfer-files-group">
                    <div className="transfer-section-title">
                        <HardDrive size={16} style={{ color: "var(--text-secondary)" }} />
                        <span>Incoming Files ({files.length})</span>
                    </div>
                    {files.map((file, idx) => (
                        <TransferFileProgressItem key={idx} file={file} />
                    ))}
                </div>

                <TransferOverallProgress progress={overallProgress} />
            </div>
        </div>
    );
};

