import React from "react";
import { Check, X, Laptop, File } from "lucide-react";
import { P2P_STRINGS } from "../../constants/constants";
import type { PendingTransfer } from "../../../../personalities/ambiverts/p2p";

interface ReceiveDeviceCardProps {
    item: PendingTransfer;
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
}

export const ReceiveDeviceCard: React.FC<ReceiveDeviceCardProps> = ({
    item,
    onAccept,
    onReject,
}) => {
    return (
        <div className="device-card">
            <div className="device-info-wrapper">
                <div className="device-avatar">
                    <Laptop size={22} color="var(--accent)" />
                </div>
                <div className="device-info">
                    <div className="device-header-row">
                        <h4>{item.sender_name}</h4>
                        <span className="device-type-badge">Nearby Sender</span>
                    </div>
                    <div className="device-files-title">{P2P_STRINGS.TRYING_TO_SEND}</div>
                    <ul className="device-files-list">
                        {item.files.map((file, i) => (
                            <li key={i}>
                                <File size={14} color="var(--text-secondary)" />
                                <span>{file}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="device-actions">
                <button
                    type="button"
                    className="p2p-btn p2p-btn-success"
                    onClick={() => onAccept(item.id)}
                >
                    <Check size={16} /> {P2P_STRINGS.ACCEPT_BTN}
                </button>
                <button
                    type="button"
                    className="p2p-btn p2p-btn-danger"
                    onClick={() => onReject(item.id)}
                >
                    <X size={16} /> {P2P_STRINGS.REJECT_BTN}
                </button>
            </div>
        </div>
    );
};

