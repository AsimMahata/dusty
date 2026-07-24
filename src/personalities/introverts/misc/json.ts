import { scanMiscIPC, syncScanMiscIPC, scanMiscTreeIPC, syncScanMiscTreeIPC, resetMiscCacheIPC } from '../../ambiverts/misc';
import type { MiscDir } from "../../../pages/misc/types/types";
import type { FileInfo } from '../../../types/core';

export async function scanJson(sync: boolean = false): Promise<FileInfo[]> {
    if (sync) {
        return await syncScanMiscIPC("json");
    }
    return await scanMiscIPC("json");
}

export async function scanJsonTree(sync: boolean = false): Promise<MiscDir[]> {
    if (sync) {
        return await syncScanMiscTreeIPC<MiscDir>("json");
    }
    return await scanMiscTreeIPC<MiscDir>("json");
}

export async function syncScanJson(): Promise<FileInfo[]> {
    return await syncScanMiscIPC("json");
}

export async function resetJsonCacheTable(): Promise<void> {
    await resetMiscCacheIPC("json");
}
