import React from "react";
import { Radio } from "lucide-react";
import { P2P_STRINGS } from "../../constants/constants";

export const ReceiveSearchingState: React.FC = () => {
    return (
        <div className="p2p-empty-state searching-state-container">
            <div className="radar-pulse-container">
                <div className="radar-ring ring-1"></div>
                <div className="radar-ring ring-2"></div>
                <div className="radar-ring ring-3"></div>
                <Radio size={36} className="radar-icon" />
            </div>
            <h4>{P2P_STRINGS.SEARCHING_FOR_SENDERS}</h4>
            <p className="p2p-empty-hint">Scanning local network for devices broadcasting files...</p>
        </div>
    );
};

