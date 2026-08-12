import toast from "react-hot-toast";
import {
    getP2PStateIPC,
    selectSendFilesIPC,
    startSendIPC,
    addFileToStashIPC,
    addShowToStashIPC,
    searchForSendersIPC,
    getPendingTransfersIPC,
    acceptTransferIPC,
    rejectTransferIPC,
    cancelTransferIPC,
    getP2PHistoryIPC,
    startManualReceiveIPC,
    stopManualReceiveIPC,
    getManualReceiveStatusIPC,
    startManualSendIPC,
} from "../../ambiverts/p2p";
import type { P2PBackendState, PendingTransfer, ManualReceiveStatus } from "../../ambiverts/p2p";
import type { ShowResult } from "../../../pages/shows/types/types";
import { logger } from "../../../utility/logger";

export async function getP2PState(): Promise<P2PBackendState> {
    try {
        return await getP2PStateIPC();
    } catch (err) {
        logger.error("Failed to fetch P2P state", err);
        return { mode: "send", active_transfer: null };
    }
}

export async function selectSendFiles(): Promise<string[]> {
    try {
        return await selectSendFilesIPC();
    } catch (err) {
        logger.error("Failed to select files", err);
        toast.error("Failed to open file picker");
        return [];
    }
}

export async function startSend(files?: string[]): Promise<boolean> {
    try {
        await startSendIPC(files);
        toast.success("Starting transfer...");
        return true;
    } catch (err) {
        logger.error("Failed to start send", err);
        toast.error("Failed to start transfer");
        return false;
    }
}

export async function addFileToStash(path: string): Promise<boolean> {
    try {
        await addFileToStashIPC(path);
        toast.success("Added to sending stash");
        return true;
    } catch (err) {
        logger.error("Failed to add file to stash", err);
        toast.error("Failed to add file to stash");
        return false;
    }
}

export async function addShowToStash(show: ShowResult): Promise<boolean> {
    try {
        await addShowToStashIPC(show);
        toast.success(`Added "${show.title}" to stash`);
        return true;
    } catch (err) {
        logger.error("Failed to add show to stash", err);
        toast.error("Failed to add show to stash");
        return false;
    }
}

export async function searchForSenders(): Promise<PendingTransfer[]> {
    try {
        return await searchForSendersIPC();
    } catch (err) {
        logger.error("Failed to search for senders", err);
        toast.error("Error searching for devices");
        return [];
    }
}

export async function getPendingTransfers(): Promise<PendingTransfer[]> {
    try {
        return await getPendingTransfersIPC();
    } catch (err) {
        logger.error("Failed to get pending transfers", err);
        return [];
    }
}

export async function acceptTransfer(id: string): Promise<boolean> {
    try {
        await acceptTransferIPC(id);
        toast.success("Transfer accepted");
        return true;
    } catch (err) {
        logger.error(`Failed to accept transfer ${id}`, err);
        toast.error("Failed to accept transfer");
        return false;
    }
}

export async function rejectTransfer(id: string): Promise<boolean> {
    try {
        await rejectTransferIPC(id);
        toast("Transfer rejected", { icon: "ℹ️" });
        return true;
    } catch (err) {
        logger.error(`Failed to reject transfer ${id}`, err);
        toast.error("Failed to reject transfer");
        return false;
    }
}

export async function cancelTransfer(silent = false): Promise<boolean> {
    try {
        await cancelTransferIPC();
        if (!silent) {
            toast("Transfer cancelled", { icon: "🛑" });
        }
        return true;
    } catch (err) {
        logger.error("Failed to cancel transfer", err);
        toast.error("Failed to cancel transfer");
        return false;
    }
}

export async function finishTransfer(): Promise<boolean> {
    return cancelTransfer(true);
}

export async function getP2PHistory() {
    try {
        return await getP2PHistoryIPC();
    } catch (err) {
        logger.error("Failed to fetch P2P history", err);
        return [];
    }
}

export async function startManualReceive(): Promise<ManualReceiveStatus | null> {
    try {
        const res = await startManualReceiveIPC();
        toast.success("Manual listener started");
        return res;
    } catch (err) {
        logger.error("Failed to start manual receive", err);
        toast.error("Failed to start manual receive");
        return null;
    }
}

export async function stopManualReceive(): Promise<boolean> {
    try {
        await stopManualReceiveIPC();
        toast("Manual listener stopped", { icon: "ℹ️" });
        return true;
    } catch (err) {
        logger.error("Failed to stop manual receive", err);
        toast.error("Failed to stop manual receive");
        return false;
    }
}

export async function getManualReceiveStatus(): Promise<ManualReceiveStatus> {
    try {
        return await getManualReceiveStatusIPC();
    } catch (err) {
        logger.error("Failed to get manual receive status", err);
        return { is_listening: false, ip_address: null, port: null };
    }
}

export async function startManualSend(receiverIp: string, files?: string[]): Promise<boolean> {
    try {
        await startManualSendIPC(receiverIp, files);
        toast.success("Initiating direct IP connection...");
        return true;
    } catch (err) {
        logger.error(`Failed to connect to direct IP ${receiverIp}`, err);
        toast.error(typeof err === "string" ? err : "Failed to connect to receiver IP");
        return false;
    }
}


