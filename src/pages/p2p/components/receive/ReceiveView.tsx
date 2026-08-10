import React, { useState } from "react";
import { Search, Radio } from "lucide-react";
import { ReceiveIdleState } from "./ReceiveIdleState";
import { ReceiveSearchingState } from "./ReceiveSearchingState";
import { ReceiveDeviceList } from "./ReceiveDeviceList";
import {
    searchForSenders,
    acceptTransfer,
    rejectTransfer,
} from "../../../../personalities/introverts/p2p/p2p";
import { P2P_STRINGS } from "../../constants/constants";
import type { PendingTransfer } from "../../../../personalities/ambiverts/p2p";

export const ReceiveView: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "searching" | "results">("idle");
    const [pendingTransfers, setPendingTransfers] = useState<PendingTransfer[]>([]);

    const handleSearch = async () => {
        setStatus("searching");
        try {
            await new Promise((resolve) => setTimeout(resolve, 1200));
            const results = await searchForSenders();
            setPendingTransfers(results);
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
                        <span className="results-count-badge">{pendingTransfers.length} Found</span>
                    </div>
                    <ReceiveDeviceList
                        transfers={pendingTransfers}
                        onAccept={handleAccept}
                        onReject={handleReject}
                    />
                </>
            )}
        </div>
    );
};

