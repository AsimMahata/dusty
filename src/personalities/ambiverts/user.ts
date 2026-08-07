import { invoke, convertFileSrc } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";

export interface User {
    id: string;
    display_name: string;
    avatar: string | null;
    hostname: string;
    device_name: string;
    created_at: number;
    updated_at: number;
}

export interface DeviceInfo {
    hostname: string;
    os: string;
    device_name: string;
}

const CMD_GET_USER = "get_user";
const CMD_SAVE_USER = "save_user";
const CMD_UPDATE_DISPLAY_NAME = "update_display_name";
const CMD_UPDATE_AVATAR = "update_avatar";
const CMD_RESET_USER = "reset_user";
const CMD_GET_DEVICE_INFO = "get_device_info";
const CMD_UPLOAD_AVATAR_FROM_PATH = "upload_avatar_from_path";
const CMD_SELECT_AVATAR_FILE = "select_avatar_file";
export async function getUserIPC(): Promise<User> {
    try {
        let result = await invoke<User>(CMD_GET_USER);
        logger.info(`getUserIPC success: ${JSON.stringify(result)}`);
        return result;
    } catch (error) {
        logger.error(`getUserIPC error: ${error}`);
        throw error;
    }
}

export async function saveUserIPC(user: User): Promise<boolean> {
    try {
        await invoke<void>(CMD_SAVE_USER, { user });
        return true;
    } catch (error) {
        logger.error(`saveUserIPC error: ${error}`);
        throw error;
    }
}

export async function updateDisplayNameIPC(displayName: string): Promise<User> {
    try {
        let result = await invoke<User>(CMD_UPDATE_DISPLAY_NAME, { displayName });
        logger.info(`updateDisplayNameIPC success: ${JSON.stringify(result)}`);
        return result;
    } catch (error) {
        logger.error(`updateDisplayNameIPC error: ${error}`);
        throw error;
    }
}

export async function updateAvatarIPC(avatar: string | null): Promise<User> {
    try {
        let result = await invoke<User>(CMD_UPDATE_AVATAR, { avatar });
        logger.info(`updateAvatarIPC success: ${JSON.stringify(result)}`);
        return result;
    } catch (error) {
        logger.error(`updateAvatarIPC error: ${error}`);
        throw error;
    }
}

export async function resetUserIPC(): Promise<User> {
    try {
        let result = await invoke<User>(CMD_RESET_USER);
        return result;
    } catch (error) {
        logger.error(`resetUserIPC error: ${error}`);
        throw error;
    }
}

export async function getDeviceInfoIPC(): Promise<DeviceInfo> {
    try {
        let result = await invoke<DeviceInfo>(CMD_GET_DEVICE_INFO);
        return result;
    } catch (error) {
        logger.error(`getDeviceInfoIPC error: ${error}`);
        throw error;
    }
}

export async function selectAvatarFileIPC(): Promise<string | null> {
    try {
        return await invoke<string | null>(CMD_SELECT_AVATAR_FILE);
    } catch (error) {
        logger.error(`selectAvatarFileIPC error: ${error}`);
        throw error;
    }
}

export async function uploadAvatarFromPathIPC(filePath: string): Promise<User> {
    try {
        let result = await invoke<User>(CMD_UPLOAD_AVATAR_FROM_PATH, { filePath });
        logger.info(`uploadAvatarFromPathIPC success: ${JSON.stringify(result)}`);
        return result;
    } catch (error) {
        logger.error(`uploadAvatarFromPathIPC error: ${error}`);
        throw error;
    }
}

export function convertFileSrcIPC(filePath: string): string {
    return convertFileSrc(filePath);
}

