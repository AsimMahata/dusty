import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { ShowResult } from "../../pages/shows/types/types";

export type P2PStateMode = "send" | "receive" | "transfer";

export type TransferItem =
    | { type: "file"; path: string }
    | { type: "show"; show: ShowResult };

export interface TransferFileProgress {
    name: string;
    progress: number;
}

export interface ActiveTransfer {
    id: string;
    sender_name: string;
    receiver_name?: string;
    files: TransferFileProgress[];
    overall_progress: number;
    status: string;
    role?: "sender" | "receiver" | string;
    total_time_secs?: number | null;
    destination_path?: string | null;
    total_bytes?: number | null;
    speed_bytes_per_sec?: number;
}

export interface OutgoingRequestState {
    id: string;
    files: string[];
    items?: TransferItem[];
    status: string;
    created_at: number;
    timeout_secs: number;
    receiver_name?: string | null;
}

export interface P2PBackendState {
    mode: P2PStateMode;
    active_transfer: ActiveTransfer | null;
    outgoing_request?: OutgoingRequestState | null;
}

export interface PendingTransfer {
    id: string;
    sender_name: string;
    files: string[];
    items?: TransferItem[];
    created_at: number;
    timeout_secs: number;
}

export interface P2PTransferHistoryRecord {
    id: string;
    direction: "outgoing" | "incoming" | string;
    role: "sender" | "receiver" | string;
    items?: TransferItem[];
    files: string[];
    peer_name: string;
    peer_ip?: string | null;
    started_at: number;
    completed_at: number;
    status: "COMPLETED" | "CANCELLED" | "FAILED" | "TIMED_OUT" | string;
    failure_reason?: string | null;
    total_bytes?: number | null;
    duration_secs?: number | null;
}

const CMD_GET_P2P_STATE = "get_p2p_state";
const CMD_SELECT_SEND_FILES = "select_send_files";
const CMD_START_SEND = "start_send";
const CMD_ADD_FILE_TO_STASH = "add_file_to_stash";
const CMD_ADD_SHOW_TO_STASH = "add_show_to_stash";
const CMD_SEARCH_FOR_SENDERS = "search_for_senders";
const CMD_GET_PENDING_TRANSFERS = "get_pending_transfers";
const CMD_ACCEPT_TRANSFER = "accept_transfer";
const CMD_REJECT_TRANSFER = "reject_transfer";
const CMD_CANCEL_TRANSFER = "cancel_transfer";
const CMD_GET_P2P_HISTORY = "get_p2p_history";

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

export async function startSendIPC(files?: string[]): Promise<void> {
    try {
        await invoke<void>(CMD_START_SEND, { files: files || [] });
    } catch (error) {
        logger.error(`startSendIPC error: ${error}`);
        throw error;
    }
}

export async function addFileToStashIPC(path: string): Promise<OutgoingRequestState> {
    try {
        const result = await invoke<OutgoingRequestState>(CMD_ADD_FILE_TO_STASH, { path });
        return result;
    } catch (error) {
        logger.error(`addFileToStashIPC error: ${error}`);
        throw error;
    }
}

export async function addShowToStashIPC(show: ShowResult): Promise<OutgoingRequestState> {
    try {
        const result = await invoke<OutgoingRequestState>(CMD_ADD_SHOW_TO_STASH, { show });
        return result;
    } catch (error) {
        logger.error(`addShowToStashIPC error: ${error}`);
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

export async function getP2PHistoryIPC(): Promise<P2PTransferHistoryRecord[]> {
    try {
        return await invoke<P2PTransferHistoryRecord[]>(CMD_GET_P2P_HISTORY);
    } catch (error) {
        logger.error(`getP2PHistoryIPC error: ${error}`);
        return [];
    }
}


