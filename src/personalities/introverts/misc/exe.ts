import { scanMiscIPC, syncScanMiscIPC, scanMiscTreeIPC, syncScanMiscTreeIPC, resetMiscCacheIPC } from '../../ambiverts/misc';
import type { FileInfo } from "../../../types/media";
import type { ExecutableDir } from "../../../types/exe";

export async function scanExe(sync: boolean = false): Promise<FileInfo[]> {
    if (sync) {
        return await syncScanMiscIPC("exe");
    }
    return await scanMiscIPC("exe");
}

export async function scanExeTree(sync: boolean = false): Promise<ExecutableDir[]> {
    if (sync) {
        return await syncScanMiscTreeIPC<ExecutableDir>("exe");
    }
    return await scanMiscTreeIPC<ExecutableDir>("exe");
}

export async function syncScanExe(): Promise<FileInfo[]> {
    return await syncScanMiscIPC("exe");
}

export async function resetExeCacheTable(): Promise<void> {
    await resetMiscCacheIPC("exe");
}
