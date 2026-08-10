import React from "react";
import { ReceiveDeviceCard } from "./ReceiveDeviceCard";
import { P2P_STRINGS } from "../../constants/constants";
import type { PendingTransfer } from "../../../../personalities/ambiverts/p2p";

interface ReceiveDeviceListProps {
    transfers: PendingTransfer[];
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
}

export const ReceiveDeviceList: React.FC<ReceiveDeviceListProps> = ({
    transfers,
    onAccept,
    onReject,
}) => {
    if (transfers.length === 0) {
        return (
            <div className="p2p-empty-state">
                <p>{P2P_STRINGS.NO_SENDERS_FOUND}</p>
            </div>
        );
    }

    return (
        <div className="device-list">
            {transfers.map((item) => (
                <ReceiveDeviceCard
                    key={item.id}
                    item={item}
                    onAccept={onAccept}
                    onReject={onReject}
                />
            ))}
        </div>
    );
};
