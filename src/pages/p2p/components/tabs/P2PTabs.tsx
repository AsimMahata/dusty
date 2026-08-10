import React from "react";
import { Send, Download } from "lucide-react";
import { P2P_STRINGS } from "../../constants/constants";
import type { P2PTabType } from "../../constants/constants";

interface P2PTabsProps {
    activeTab: P2PTabType;
    onTabChange: (tab: P2PTabType) => void;
}

export const P2PTabs: React.FC<P2PTabsProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="tabs-container">
            <button
                type="button"
                className={`tab-btn ${activeTab === "send" ? "active" : ""}`}
                onClick={() => onTabChange("send")}
            >
                <Send size={16} />
                <span>{P2P_STRINGS.SEND_TITLE}</span>
            </button>
            <button
                type="button"
                className={`tab-btn ${activeTab === "receive" ? "active" : ""}`}
                onClick={() => onTabChange("receive")}
            >
                <Download size={16} />
                <span>{P2P_STRINGS.RECEIVE_TITLE}</span>
            </button>
        </div>
    );
};

