import React, { useEffect, useState } from "react";
import { Send, Plus, UploadCloud, Clock, XCircle, CheckCircle2, RotateCcw } from "lucide-react";
import { SendEmptyState } from "./SendEmptyState";
import { startSend, selectSendFiles, cancelTransfer } from "../../../../personalities/introverts/p2p/p2p";
import { P2P_STRINGS } from "../../constants/constants";
import type { OutgoingRequestState } from "../../../../personalities/ambiverts/p2p";
import { SendFileList } from "./SendFileList";

interface SendViewProps {
    outgoingRequest?: OutgoingRequestState | null;
    onRefreshState?: () => void;
}

export const SendView: React.FC<SendViewProps> = ({ outgoingRequest, onRefreshState }) => {
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [nowSecs, setNowSecs] = useState<number>(Math.floor(Date.now() / 1000));

    useEffect(() => {
        const interval = setInterval(() => {
            setNowSecs(Math.floor(Date.now() / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSelectFiles = async () => {
        const picked = await selectSendFiles();
        if (picked && picked.length > 0) {
            setSelectedFiles((prev) => Array.from(new Set([...prev, ...picked])));
        }
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSend = async () => {
        if (selectedFiles.length === 0) return;
        setIsSending(true);
        try {
            const success = await startSend(selectedFiles);
            if (success) {
                onRefreshState?.();
            }
        } finally {
            setIsSending(false);
        }
    };

    const handleCancelRequest = async () => {
        await cancelTransfer();
        onRefreshState?.();
    };

    const handleRetry = async () => {
        if (!outgoingRequest || outgoingRequest.files.length === 0) return;
        const filesToRetry = [...outgoingRequest.files];
        await cancelTransfer();
        const success = await startSend(filesToRetry);
        if (success) {
            onRefreshState?.();
        }
    };

    // If there is an active/persisted outgoing request in stash
    if (outgoingRequest) {
        const isStashed = outgoingRequest.status === "STASHED";
        const deadline = outgoingRequest.created_at + outgoingRequest.timeout_secs;
        const remainingSecs = Math.max(0, deadline - nowSecs);
        const isWaiting = outgoingRequest.status === "WAITING_FOR_ACCEPTANCE" || outgoingRequest.status === "REQUEST_SENT";
        const isTimedOut = outgoingRequest.status === "TIMED_OUT" || (isWaiting && remainingSecs <= 0);
        const isAccepted = outgoingRequest.status === "ACCEPTED" || outgoingRequest.status === "INITIALIZING_TRANSFER";
        const isFailed = outgoingRequest.status === "FAILED";

        const handleSendStash = async () => {
            setIsSending(true);
            try {
                const success = await startSend();
                if (success) {
                    onRefreshState?.();
                }
            } finally {
                setIsSending(false);
            }
        };

        if (isStashed) {
            return (
                <div className="p2p-card">
                    <div className="p2p-card-header">
                        <div>
                            <h3 className="p2p-card-title">
                                <UploadCloud size={20} style={{ color: "var(--accent)" }} />
                                Outgoing Stash Available
                            </h3>
                            <p className="p2p-subtitle">Items added to stash from action menus</p>
                        </div>
                    </div>

                    <SendFileList items={outgoingRequest.items} files={outgoingRequest.files} />

                    <div className="p2p-action-group" style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
                        <button
                            className="p2p-btn p2p-btn-primary p2p-btn-lg"
                            onClick={handleSendStash}
                            disabled={isSending}
                        >
                            <Send size={16} />
                            {isSending ? P2P_STRINGS.SENDING_BTN : "Send Stash to Nearby Devices"}
                        </button>
                        <button
                            className="p2p-btn p2p-btn-secondary p2p-btn-lg"
                            onClick={handleCancelRequest}
                        >
                            Clear Stash
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="p2p-card">
                <div className="p2p-card-header">
                    <div>
                        <h3 className="p2p-card-title">
                            <UploadCloud size={20} style={{ color: "var(--accent)" }} />
                            Active Outgoing Request
                        </h3>
                        <p className="p2p-subtitle">Request state persisted from backend</p>
                    </div>

                    {isWaiting && !isTimedOut && (
                        <div className="p2p-status-badge warning" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Clock size={14} />
                            Timeout: {remainingSecs}s
                        </div>
                    )}
                </div>

                {isTimedOut ? (
                    <div style={{
                        padding: "16px",
                        marginBottom: "16px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        color: "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px"
                    }}>
                        <XCircle size={24} />
                        <div>
                            <div style={{ fontWeight: 600 }}>Request timed out</div>
                            <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>
                                No receiver connected within the 60-second deadline.
                            </div>
                        </div>
                    </div>
                ) : isFailed ? (
                    <div style={{
                        padding: "16px",
                        marginBottom: "16px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        color: "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px"
                    }}>
                        <XCircle size={24} />
                        <div>
                            <div style={{ fontWeight: 600 }}>Transfer failed</div>
                            <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>
                                Connection or transfer encountered an error.
                            </div>
                        </div>
                    </div>
                ) : isAccepted ? (
                    <div style={{
                        padding: "16px",
                        marginBottom: "16px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(34, 197, 94, 0.1)",
                        border: "1px solid rgba(34, 197, 94, 0.3)",
                        color: "#22c55e",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px"
                    }}>
                        <CheckCircle2 size={24} />
                        <div>
                            <div style={{ fontWeight: 600 }}>
                                {outgoingRequest.receiver_name || "Receiver"} has accepted the request.
                            </div>
                            <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>
                                Initializing transfer...
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{
                        padding: "16px",
                        marginBottom: "16px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        color: "#3b82f6",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px"
                    }}>
                        <Clock size={24} />
                        <div>
                            <div style={{ fontWeight: 600 }}>Request sent - Waiting for acceptance...</div>
                            <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>
                                Waiting for a receiver to accept your files on the local network.
                            </div>
                        </div>
                    </div>
                )}

                <SendFileList items={outgoingRequest.items} files={outgoingRequest.files} />

                <div className="p2p-action-group" style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
                    {isTimedOut || isFailed ? (
                        <>
                            <button
                                className="p2p-btn p2p-btn-primary p2p-btn-lg"
                                onClick={handleRetry}
                            >
                                <RotateCcw size={16} />
                                Retry Request
                            </button>
                            <button
                                className="p2p-btn p2p-btn-secondary p2p-btn-lg"
                                onClick={handleCancelRequest}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            className="p2p-btn p2p-btn-secondary p2p-btn-lg"
                            onClick={handleCancelRequest}
                        >
                            <XCircle size={16} />
                            Cancel Request
                        </button>
                    )}
                </div>
            </div>
        );
    }


    // Default Normal Send UI (when no active request exists)
    return (
        <div className="p2p-card">
            <div className="p2p-card-header">
                <div>
                    <h3 className="p2p-card-title">
                        <UploadCloud size={20} style={{ color: "var(--accent)" }} />
                        {P2P_STRINGS.SEND_TITLE}
                    </h3>
                    <p className="p2p-subtitle">{P2P_STRINGS.SEND_SUBTITLE}</p>
                </div>
                {selectedFiles.length > 0 && (
                    <button className="p2p-btn p2p-btn-secondary" onClick={handleSelectFiles}>
                        <Plus size={16} />
                        {P2P_STRINGS.ADD_MORE_FILES_BTN}
                    </button>
                )}
            </div>

            {selectedFiles.length === 0 ? (
                <SendEmptyState onSelectFiles={handleSelectFiles} />
            ) : (
                <>
                    <SendFileList files={selectedFiles} onRemoveFile={handleRemoveFile} />
                    <div className="p2p-action-group">
                        <button
                            className="p2p-btn p2p-btn-primary p2p-btn-lg"
                            onClick={handleSend}
                            disabled={isSending}
                        >
                            <Send size={16} />
                            {isSending ? P2P_STRINGS.SENDING_BTN : "Send to Nearby Devices"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
