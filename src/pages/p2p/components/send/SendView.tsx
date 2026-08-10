import React, { useState } from "react";
import { Send, Plus, UploadCloud } from "lucide-react";
import { SendEmptyState } from "./SendEmptyState";
import { SendFileList } from "./SendFileList";
import { startSend, selectSendFiles } from "../../../../personalities/introverts/p2p/p2p";
import { P2P_STRINGS } from "../../constants/constants";

export const SendView: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [isSending, setIsSending] = useState(false);

    const handleSelectFiles = async () => {
        const picked = await selectSendFiles();
        if (picked && picked.length > 0) {
            setSelectedFiles((prev) => Array.from(new Set([...prev, ...picked])));
            return;
        }

        const input = document.createElement("input");
        input.type = "file";
        input.multiple = true;
        input.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.files) {
                const filenames = Array.from(target.files).map((f) => f.name);
                setSelectedFiles((prev) => Array.from(new Set([...prev, ...filenames])));
            }
        };
        input.click();
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSend = async () => {
        if (selectedFiles.length === 0) return;
        setIsSending(true);
        try {
            await startSend(selectedFiles);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="p2p-card">
            <div className="p2p-card-header">
                <div>
                    <h3 className="p2p-card-title">
                        <UploadCloud size={20} style={{ color: "var(--accent)" }} />
                        {P2P_STRINGS.SEND_TITLE}
                    </h3>
                    <p className="p2p-subtitle">{P2P_STRINGS.SEND_SUBTITLE}</p>
                </div>
                {selectedFiles.length > 0 && (
                    <button className="p2p-btn p2p-btn-secondary" onClick={handleSelectFiles}>
                        <Plus size={16} />
                        {P2P_STRINGS.ADD_MORE_FILES_BTN}
                    </button>
                )}
            </div>

            {selectedFiles.length === 0 ? (
                <SendEmptyState onSelectFiles={handleSelectFiles} />
            ) : (
                <>
                    <SendFileList files={selectedFiles} onRemoveFile={handleRemoveFile} />
                    <div className="p2p-action-group">
                        <button
                            className="p2p-btn p2p-btn-primary p2p-btn-lg"
                            onClick={handleSend}
                            disabled={isSending}
                        >
                            <Send size={16} />
                            {isSending ? P2P_STRINGS.SENDING_BTN : "Send to Nearby Devices"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

