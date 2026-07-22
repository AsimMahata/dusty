import { scanExeIPC, syncScanExeIPC, scanExeTreeIPC, syncScanExeTreeIPC, resetExeCacheTableIPC } from '../../ambiverts/exe';
import type { FileInfo } from "../../../types/media";
import type { ExecutableDir } from "../../../types/exe";

export async function scanExe(sync: boolean = false): Promise<FileInfo[]> {
    if (sync) {
        return await syncScanExeIPC();
    }
    return await scanExeIPC();
}

export async function scanExeTree(sync: boolean = false): Promise<ExecutableDir[]> {
    if (sync) {
        return await syncScanExeTreeIPC();
    }
    return await scanExeTreeIPC();
}

export async function syncScanExe(): Promise<FileInfo[]> {
    return await syncScanExeIPC();
}

export async function resetExeCacheTable(): Promise<void> {
    await resetExeCacheTableIPC();
}
