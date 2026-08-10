import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";

export type P2PStateMode = "send" | "receive" | "transfer";

export interface TransferFileProgress {
    name: string;
    progress: number;
}

export interface ActiveTransfer {
    id: string;
    sender_name: string;
    files: TransferFileProgress[];
    overall_progress: number;
    status: string;
}

export interface P2PBackendState {
    mode: P2PStateMode;
    active_transfer: ActiveTransfer | null;
}

export interface PendingTransfer {
    id: string;
    sender_name: string;
    files: string[];
}

const CMD_GET_P2P_STATE = "get_p2p_state";
const CMD_SELECT_SEND_FILES = "select_send_files";
const CMD_START_SEND = "start_send";
const CMD_SEARCH_FOR_SENDERS = "search_for_senders";
const CMD_GET_PENDING_TRANSFERS = "get_pending_transfers";
const CMD_ACCEPT_TRANSFER = "accept_transfer";
const CMD_REJECT_TRANSFER = "reject_transfer";
const CMD_CANCEL_TRANSFER = "cancel_transfer";

export async function getP2PStateIPC(): Promise<P2PBackendState> {
    try {
        const result = await invoke<P2PBackendState>(CMD_GET_P2P_STATE);
        return result;
    } catch (error) {
        logger.error(`getP2PStateIPC error: ${error}`);
        throw error;
    }
}

export async function selectSendFilesIPC(): Promise<string[]> {
    try {
        const result = await invoke<string[]>(CMD_SELECT_SEND_FILES);
        return result;
    } catch (error) {
        logger.error(`selectSendFilesIPC error: ${error}`);
        throw error;
    }
}

export async function startSendIPC(files: string[]): Promise<void> {
    try {
        await invoke<void>(CMD_START_SEND, { files });
    } catch (error) {
        logger.error(`startSendIPC error: ${error}`);
        throw error;
    }
}

export async function searchForSendersIPC(): Promise<PendingTransfer[]> {
    try {
        const result = await invoke<PendingTransfer[]>(CMD_SEARCH_FOR_SENDERS);
        return result;
    } catch (error) {
        logger.error(`searchForSendersIPC error: ${error}`);
        throw error;
    }
}

export async function getPendingTransfersIPC(): Promise<PendingTransfer[]> {
    try {
        const result = await invoke<PendingTransfer[]>(CMD_GET_PENDING_TRANSFERS);
        return result;
    } catch (error) {
        logger.error(`getPendingTransfersIPC error: ${error}`);
        throw error;
    }
}

export async function acceptTransferIPC(id: string): Promise<void> {
    try {
        await invoke<void>(CMD_ACCEPT_TRANSFER, { id });
    } catch (error) {
        logger.error(`acceptTransferIPC error: ${error}`);
        throw error;
    }
}

export async function rejectTransferIPC(id: string): Promise<void> {
    try {
        await invoke<void>(CMD_REJECT_TRANSFER, { id });
    } catch (error) {
        logger.error(`rejectTransferIPC error: ${error}`);
        throw error;
    }
}

export async function cancelTransferIPC(): Promise<void> {
    try {
        await invoke<void>(CMD_CANCEL_TRANSFER);
    } catch (error) {
        logger.error(`cancelTransferIPC error: ${error}`);
        throw error;
    }
}
