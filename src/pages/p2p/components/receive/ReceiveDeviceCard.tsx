import React, { useEffect, useState } from "react";
import { Check, X, Laptop, File, Tv, Clock } from "lucide-react";
import { P2P_STRINGS } from "../../constants/constants";
import type { PendingTransfer } from "../../../../personalities/ambiverts/p2p";

interface ReceiveDeviceCardProps {
    item: PendingTransfer;
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
    onExpired?: (id: string) => void;
}

export const ReceiveDeviceCard: React.FC<ReceiveDeviceCardProps> = ({
    item,
    onAccept,
    onReject,
    onExpired,
}) => {
    const [nowSecs, setNowSecs] = useState<number>(Math.floor(Date.now() / 1000));

    useEffect(() => {
        const interval = setInterval(() => {
            setNowSecs(Math.floor(Date.now() / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const timeoutSecs = item.timeout_secs || 60;
    const createdAt = item.created_at || nowSecs;
    const expirationTime = createdAt + timeoutSecs;
    const remainingSecs = Math.max(0, expirationTime - nowSecs);
    const isExpired = remainingSecs <= 0;

    useEffect(() => {
        if (isExpired && onExpired) {
            onExpired(item.id);
        }
    }, [isExpired, item.id, onExpired]);

    if (isExpired) {
        return null;
    }

    return (
        <div className="device-card">
            <div className="device-info-wrapper">
                <div className="device-avatar">
                    <Laptop size={22} color="var(--accent)" />
                </div>
                <div className="device-info">
                    <div className="device-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h4>{item.sender_name}</h4>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <span className="p2p-status-badge warning" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.78rem" }}>
                                <Clock size={12} />
                                Expires in {remainingSecs}s
                            </span>
                            <span className="device-type-badge">Nearby Sender</span>
                        </div>
                    </div>
                    <div className="device-files-title">{P2P_STRINGS.TRYING_TO_SEND}</div>
                    <ul className="device-files-list">
                        {item.items && item.items.length > 0
                            ? item.items.map((transferItem, i) => {
                                  const isShow = transferItem.type === "show";
                                  const name = isShow
                                      ? `Show: ${transferItem.show.title} (${transferItem.show.episodes?.length || 0} episodes)`
                                      : transferItem.path;
                                  return (
                                      <li key={i}>
                                          {isShow ? (
                                              <Tv size={14} color="var(--accent)" />
                                          ) : (
                                              <File size={14} color="var(--text-secondary)" />
                                          )}
                                          <span>{name}</span>
                                      </li>
                                  );
                              })
                            : item.files.map((file, i) => (
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
                    disabled={isExpired}
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

