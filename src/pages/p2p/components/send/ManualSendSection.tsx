import React, { useState } from "react";
import { Send, Globe } from "lucide-react";
import toast from "react-hot-toast";
import { startManualSend } from "../../../../personalities/introverts/p2p/p2p";

interface ManualSendSectionProps {
    files?: string[];
}

export const ManualSendSection: React.FC<ManualSendSectionProps> = ({ files = [] }) => {
    const [ipInput, setIpInput] = useState("");
    const [connecting, setConnecting] = useState(false);

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = ipInput.trim();
        if (!trimmed) {
            toast.error("Please enter a valid receiver IP address");
            return;
        }

        setConnecting(true);
        try {
            await startManualSend(trimmed, files);
        } finally {
            setConnecting(false);
        }
    };

    return (
        <div className="manual-section-card">
            <div className="manual-header">
                <div className="manual-title-area">
                    <Globe size={18} style={{ color: "var(--accent)" }} />
                    <h4>Manual Direct IP Connection</h4>
                </div>
            </div>

            <form onSubmit={handleConnect} className="manual-send-form">
                <div className="manual-ip-input-group">
                    <label htmlFor="receiver-ip-input" className="manual-ip-label">
                        Receiver IP:
                    </label>
                    <input
                        id="receiver-ip-input"
                        type="text"
                        className="p2p-ip-input"
                        placeholder="e.g. 10.2.29.103"
                        value={ipInput}
                        onChange={(e) => setIpInput(e.target.value)}
                        disabled={connecting}
                    />
                    <button
                        type="submit"
                        className="p2p-btn p2p-btn-primary"
                        disabled={connecting || !ipInput.trim()}
                    >
                        <Send size={16} />
                        {connecting ? "Connecting..." : "Try Connecting"}
                    </button>
                </div>
            </form>
        </div>
    );
};
