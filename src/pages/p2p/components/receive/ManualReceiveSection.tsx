import React, { useEffect, useState } from "react";
import { Radio, Copy, Check, Power, Wifi } from "lucide-react";
import toast from "react-hot-toast";
import {
    getManualReceiveStatus,
    startManualReceive,
    stopManualReceive,
} from "../../../../personalities/introverts/p2p/p2p";
import type { ManualReceiveStatus } from "../../../../personalities/ambiverts/p2p";

export const ManualReceiveSection: React.FC = () => {
    const [status, setStatus] = useState<ManualReceiveStatus>({
        is_listening: false,
        ip_address: null,
        port: null,
    });
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const refreshStatus = async () => {
        const res = await getManualReceiveStatus();
        setStatus(res);
    };

    useEffect(() => {
        refreshStatus();
        const interval = setInterval(refreshStatus, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleStart = async () => {
        setLoading(true);
        try {
            const res = await startManualReceive();
            if (res) {
                setStatus(res);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStop = async () => {
        setLoading(true);
        try {
            const ok = await stopManualReceive();
            if (ok) {
                setStatus({ is_listening: false, ip_address: null, port: null });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCopyIp = () => {
        if (status.ip_address) {
            navigator.clipboard.writeText(status.ip_address);
            setCopied(true);
            toast.success("IP address copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="manual-section-card">
            <div className="manual-header">
                <div className="manual-title-area">
                    <Radio size={18} style={{ color: "var(--accent)" }} />
                    <h4>Manual Receive</h4>
                </div>
                {status.is_listening && (
                    <span className="p2p-status-badge success">
                        <Wifi size={12} /> Listening
                    </span>
                )}
            </div>

            {!status.is_listening ? (
                <div className="manual-action-body">
                    <p className="manual-description">
                        Start a local TCP listener to accept direct IP connections from senders.
                    </p>
                    <button
                        className="p2p-btn p2p-btn-primary"
                        onClick={handleStart}
                        disabled={loading}
                    >
                        <Power size={16} />
                        {loading ? "Starting..." : "Start Listening"}
                    </button>
                </div>
            ) : (
                <div className="manual-action-body listening">
                    <p className="manual-listening-text">Listening for direct connections</p>

                    {status.ip_address && (
                        <div className="manual-ip-box">
                            <span className="ip-label">Your IP:</span>
                            <code className="ip-value">{status.ip_address}</code>
                            <button className="p2p-btn p2p-btn-secondary p2p-btn-sm" onClick={handleCopyIp}>
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                {copied ? "Copied" : "Copy"}
                            </button>
                        </div>
                    )}

                    <button
                        className="p2p-btn p2p-btn-secondary"
                        onClick={handleStop}
                        disabled={loading}
                        style={{ marginTop: "12px" }}
                    >
                        <Power size={16} />
                        {loading ? "Stopping..." : "Stop Listening"}
                    </button>
                </div>
            )}
        </div>
    );
};
