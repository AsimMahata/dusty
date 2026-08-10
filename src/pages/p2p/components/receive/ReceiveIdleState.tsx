import React from "react";
import { Radio } from "lucide-react";
import { P2P_STRINGS } from "../../constants/constants";

export const ReceiveIdleState: React.FC = () => {
    return (
        <div className="p2p-empty-state">
            <div className="p2p-empty-icon-wrapper">
                <Radio size={44} className="p2p-empty-icon" />
            </div>
            <h4>{P2P_STRINGS.NO_DEVICES_SEARCHED}</h4>
            <p className="p2p-empty-hint">{P2P_STRINGS.CLICK_SEARCH_HINT}</p>
        </div>
    );
};

