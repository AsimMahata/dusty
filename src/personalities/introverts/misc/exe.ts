import { scanExeIPC, syncScanExeIPC, resetExeCacheTableIPC } from '../../ambiverts/exe';
import type { FileInfo } from "../../../types/media";

export async function scanExe(sync: boolean = false): Promise<FileInfo[]> {
    if (sync) {
        return await syncScanExeIPC();
    }
    return await scanExeIPC();
}

export async function syncScanExe(): Promise<FileInfo[]> {
    return await syncScanExeIPC();
}

export async function resetExeCacheTable(): Promise<void> {
    await resetExeCacheTableIPC();
}
