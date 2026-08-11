import React from "react";
import { ArrowDownCircle, ArrowUpCircle, XCircle, HardDrive, CheckCircle2, Folder, Clock, Check } from "lucide-react";
import { TransferFileProgressItem } from "./TransferFileProgress";
import { TransferOverallProgress } from "./TransferOverallProgress";
import { cancelTransfer, finishTransfer } from "../../../../personalities/introverts/p2p/p2p";
import { P2P_STRINGS } from "../../constants/constants";
import type { ActiveTransfer } from "../../../../personalities/ambiverts/p2p";

interface TransferViewProps {
    transfer: ActiveTransfer | null;
    onCancelComplete?: () => void;
}

export const TransferView: React.FC<TransferViewProps> = ({ transfer, onCancelComplete }) => {
    const handleExit = async () => {
        await finishTransfer();
        if (onCancelComplete) {
            onCancelComplete();
        }
    };

    const handleCancel = async () => {
        await cancelTransfer();
        if (onCancelComplete) {
            onCancelComplete();
        }
    };

    const isCompleted = transfer?.status === "completed";
    const role = transfer?.role || "receiver";
    const senderName = transfer?.sender_name || "Device";
    const receiverName = transfer?.receiver_name || "Device";
    const files = transfer?.files || [];
    const overallProgress = transfer?.overall_progress ?? 0;
    const timeTaken = transfer?.total_time_secs != null ? `${transfer.total_time_secs} seconds` : "N/A";
    const destPath = transfer?.destination_path || "";
    const totalBytes = transfer?.total_bytes ?? 0;

    const formatBytes = (bytes: number, decimals = 1) => {
        if (!bytes || bytes === 0) return null;
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    const formattedTotalSize = formatBytes(totalBytes);

    if (isCompleted) {
        return (
            <div className="p2p-workbench-container">
                <div className="transfer-card" style={{ padding: "32px", textAlign: "left" }}>
                    {/* Header Icon & Title */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                        <div style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "16px",
                            backgroundColor: "rgba(34, 197, 94, 0.15)",
                            border: "1px solid rgba(34, 197, 94, 0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#22c55e"
                        }}>
                            <CheckCircle2 size={32} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                                {role === "sender" ? "Sending successful" : "Files received successfully"}
                            </h2>
                            <p style={{ margin: "4px 0 0 0", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                                {role === "sender"
                                    ? `Successfully sent ${files.length} file${files.length === 1 ? "" : "s"}${formattedTotalSize ? ` (${formattedTotalSize})` : ""} in ${timeTaken}.`
                                    : `Successfully received ${files.length} file${files.length === 1 ? "" : "s"}${formattedTotalSize ? ` (${formattedTotalSize})` : ""} in ${timeTaken}.`}
                            </p>
                        </div>
                    </div>

                    {/* Receiver Destination Path */}
                    {role === "receiver" && destPath && (
                        <div style={{
                            marginBottom: "20px",
                            padding: "16px",
                            borderRadius: "12px",
                            backgroundColor: "var(--bg-secondary, rgba(255, 255, 255, 0.05))",
                            border: "1px solid var(--border-color, rgba(255, 255, 255, 0.1))"
                        }}>
                            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                                <Folder size={14} style={{ color: "var(--accent)" }} />
                                {files.length} {files.length === 1 ? "file" : "files"} saved to:
                            </div>
                            <div style={{
                                fontFamily: "monospace",
                                fontSize: "0.9rem",
                                wordBreak: "break-all",
                                color: "var(--text-primary)",
                                fontWeight: 600
                            }}>
                                {destPath}
                            </div>
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                        gap: "12px",
                        marginBottom: "24px"
                    }}>
                        <div style={{
                            padding: "12px 16px",
                            borderRadius: "10px",
                            backgroundColor: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 255, 255, 0.08)"
                        }}>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                                <HardDrive size={13} /> Files Shared
                            </div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "4px", color: "var(--text-primary)" }}>
                                {files.length} {files.length === 1 ? "file" : "files"}
                            </div>
                        </div>

                        {formattedTotalSize && (
                            <div style={{
                                padding: "12px 16px",
                                borderRadius: "10px",
                                backgroundColor: "rgba(255, 255, 255, 0.03)",
                                border: "1px solid rgba(255, 255, 255, 0.08)"
                            }}>
                                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                                    Total Size
                                </div>
                                <div style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "4px", color: "var(--text-primary)" }}>
                                    {formattedTotalSize}
                                </div>
                            </div>
                        )}

                        <div style={{
                            padding: "12px 16px",
                            borderRadius: "10px",
                            backgroundColor: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 255, 255, 0.08)"
                        }}>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                                <Clock size={13} /> Time Taken
                            </div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "4px", color: "var(--text-primary)" }}>
                                {timeTaken}
                            </div>
                        </div>

                        <div style={{
                            padding: "12px 16px",
                            borderRadius: "10px",
                            backgroundColor: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 255, 255, 0.08)"
                        }}>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                                {role === "sender" ? "Sent To" : "Received From"}
                            </div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "4px", color: "var(--text-primary)" }}>
                                {role === "sender" ? receiverName : senderName}
                            </div>
                        </div>
                    </div>

                    {/* Files Summary */}
                    <div className="transfer-files-group" style={{ marginBottom: "24px" }}>
                        <div className="transfer-section-title">
                            <HardDrive size={16} style={{ color: "var(--text-secondary)" }} />
                            <span>Transferred Files ({files.length})</span>
                        </div>
                        {files.map((file, idx) => (
                            <div key={idx} style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                backgroundColor: "rgba(255, 255, 255, 0.02)",
                                marginBottom: "6px"
                            }}>
                                <span style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>{file.name}</span>
                                <span style={{ fontSize: "0.8rem", color: "#22c55e", display: "flex", alignItems: "center", gap: "4px" }}>
                                    <Check size={14} /> Completed
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Done Action */}
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button
                            className="p2p-btn p2p-btn-primary p2p-btn-lg"
                            onClick={handleExit}
                            style={{ minWidth: "140px" }}
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p2p-workbench-container">
            <div className="transfer-card">
                <div className="transfer-header">
                    <div className="transfer-peer-group">
                        <div className="transfer-peer-icon">
                            {role === "sender" ? (
                                <ArrowUpCircle size={32} style={{ color: "var(--accent)" }} />
                            ) : (
                                <ArrowDownCircle size={32} style={{ color: "var(--accent)" }} />
                            )}
                        </div>
                        <div>
                            <div className="transfer-peer-name">
                                {role === "sender"
                                    ? `Sending to ${receiverName}`
                                    : `${P2P_STRINGS.RECEIVING_FROM} ${senderName}`}
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
                        <span>{role === "sender" ? "Outgoing Files" : "Incoming Files"} ({files.length})</span>
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


