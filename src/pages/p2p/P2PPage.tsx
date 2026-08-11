import React, { useEffect, useState } from "react";
import { PageLayout } from "../../components/layout/PageLayout";
import { P2PTabs } from "./components/tabs/P2PTabs";
import { SendView } from "./components/send/SendView";
import { ReceiveView } from "./components/receive/ReceiveView";
import { TransferView } from "./components/transfer/TransferView";
import { getP2PState } from "../../personalities/introverts/p2p/p2p";
import { P2P_STRINGS } from "./constants/constants";
import type { P2PTabType } from "./constants/constants";
import type { P2PBackendState } from "../../personalities/ambiverts/p2p";
import { Share2, Wifi } from "lucide-react";
import "./css/P2P.css";

export const P2PPage: React.FC = () => {
    const [backendState, setBackendState] = useState<P2PBackendState>({
        mode: "send",
        active_transfer: null,
    });
    const [activeTab, setActiveTab] = useState<P2PTabType>("send");

    const fetchState = async () => {
        const state = await getP2PState();
        setBackendState(state);
    };

    useEffect(() => {
        fetchState();
        const interval = setInterval(fetchState, 1000);
        return () => clearInterval(interval);
    }, []);

    if (backendState.mode === "transfer") {
        return (
            <PageLayout title="P2P Transfer" >
                <TransferView
                    transfer={backendState.active_transfer}
                    onCancelComplete={fetchState}
                />
            </PageLayout>
        );
    }

    return (
        <PageLayout title="P2P"  hideSearch>
            <div className="p2p-workbench-container">
                {/* Header Banner */}
                <div className="p2p-header-banner">
                    <div>
                        <h2 className="p2p-header-title">
                            <Share2 size={24} style={{ color: "var(--accent)" }} />
                            {P2P_STRINGS.PAGE_TITLE}
                        </h2>
                        <p className="p2p-header-subtitle">
                            {P2P_STRINGS.PAGE_SUBTITLE}
                        </p>
                    </div>

                    <div className="p2p-status-badge success">
                        <Wifi size={14} />
                        Local Network Ready
                    </div>
                </div>

                {/* Tab Bar Navigation */}
                <P2PTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Main Tab Content */}
                <div className="tab-content">
                    {activeTab === "send" ? (
                        <SendView
                            outgoingRequest={backendState.outgoing_request}
                            onRefreshState={fetchState}
                        />
                    ) : (
                        <ReceiveView />
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default P2PPage;

