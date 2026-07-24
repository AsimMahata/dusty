import { scanMiscIPC, syncScanMiscIPC, scanMiscTreeIPC, syncScanMiscTreeIPC, resetMiscCacheIPC } from '../../ambiverts/misc';
import type { MiscDir } from "../../../pages/misc/types/types";
import type { FileInfo } from '../../../types/core';

export async function scanExe(sync: boolean = false): Promise<FileInfo[]> {
    if (sync) {
        return await syncScanMiscIPC("exe");
    }
    return await scanMiscIPC("exe");
}

export async function scanExeTree(sync: boolean = false): Promise<MiscDir[]> {
    if (sync) {
        return await syncScanMiscTreeIPC<MiscDir>("exe");
    }
    return await scanMiscTreeIPC<MiscDir>("exe");
}

export async function syncScanExe(): Promise<FileInfo[]> {
    return await syncScanMiscIPC("exe");
}

export async function resetExeCacheTable(): Promise<void> {
    await resetMiscCacheIPC("exe");
}
