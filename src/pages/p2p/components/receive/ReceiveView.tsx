import React, { useEffect, useState } from "react";
import { Search, Radio } from "lucide-react";
import { ReceiveIdleState } from "./ReceiveIdleState";
import { ReceiveSearchingState } from "./ReceiveSearchingState";
import { ReceiveDeviceList } from "./ReceiveDeviceList";
import { ManualReceiveSection } from "./ManualReceiveSection";
import {
    searchForSenders,
    getPendingTransfers,
    acceptTransfer,
    rejectTransfer,
} from "../../../../personalities/introverts/p2p/p2p";
import { P2P_STRINGS } from "../../constants/constants";
import type { PendingTransfer } from "../../../../personalities/ambiverts/p2p";

export const ReceiveView: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "searching" | "results">("idle");
    const [pendingTransfers, setPendingTransfers] = useState<PendingTransfer[]>([]);

    const pollPending = async () => {
        const transfers = await getPendingTransfers();
        if (transfers.length > 0) {
            setPendingTransfers(transfers);
            setStatus("results");
        } else if (status === "results" && pendingTransfers.length === 0) {
            setPendingTransfers([]);
        }
    };

    useEffect(() => {
        pollPending();
        const interval = setInterval(pollPending, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = async () => {
        setStatus("searching");
        try {
            await new Promise((resolve) => setTimeout(resolve, 1200));
            const results = await searchForSenders();
            const combined = [...results];
            const currentPending = await getPendingTransfers();
            for (const p of currentPending) {
                if (!combined.some((c) => c.id === p.id)) {
                    combined.push(p);
                }
            }
            setPendingTransfers(combined);
            setStatus("results");
        } catch {
            setStatus("idle");
        }
    };

    const handleAccept = async (id: string) => {
        await acceptTransfer(id);
    };

    const handleReject = async (id: string) => {
        await rejectTransfer(id);
        setPendingTransfers((prev) => prev.filter((t) => t.id !== id));
    };

    const handleExpired = (id: string) => {
        setPendingTransfers((prev) => prev.filter((t) => t.id !== id));
    };

    const activeValidTransfers = pendingTransfers.filter((t) => {
        if (!t.created_at || !t.timeout_secs) return true;
        const now = Math.floor(Date.now() / 1000);
        return now < t.created_at + t.timeout_secs;
    });

    return (
        <div className="p2p-card">
            <div className="p2p-card-header">
                <div>
                    <h3 className="p2p-card-title">
                        <Radio size={20} style={{ color: "var(--accent)" }} />
                        {P2P_STRINGS.RECEIVE_TITLE}
                    </h3>
                    <p className="p2p-subtitle">{P2P_STRINGS.RECEIVE_SUBTITLE}</p>
                </div>
                <button
                    className="p2p-btn p2p-btn-primary"
                    onClick={handleSearch}
                    disabled={status === "searching"}
                >
                    <Search size={16} />
                    {status === "searching" ? P2P_STRINGS.SEARCHING_BTN : P2P_STRINGS.SEARCH_DEVICES_BTN}
                </button>
            </div>

            {status === "idle" && <ReceiveIdleState />}
            {status === "searching" && <ReceiveSearchingState />}
            {status === "results" && (
                <>
                    <div className="results-header-row">
                        <h4 className="results-header-title">
                            {P2P_STRINGS.DEVICES_SENDERS_TITLE}
                        </h4>
                        <span className="results-count-badge">{activeValidTransfers.length} Found</span>
                    </div>
                    <ReceiveDeviceList
                        transfers={activeValidTransfers}
                        onAccept={handleAccept}
                        onReject={handleReject}
                        onExpired={handleExpired}
                    />
                </>
            )}

            <div style={{ marginTop: "24px" }}>
                <ManualReceiveSection />
            </div>
        </div>
    );
};

