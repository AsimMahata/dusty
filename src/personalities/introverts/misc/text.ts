import { scanMiscIPC, syncScanMiscIPC, scanMiscTreeIPC, syncScanMiscTreeIPC, resetMiscCacheIPC } from '../../ambiverts/misc';
import type { MiscDir } from "../../../pages/misc/types/types";
import type { FileInfo } from '../../../types/core';

export async function scanText(sync: boolean = false): Promise<FileInfo[]> {
    if (sync) {
        return await syncScanMiscIPC("text");
    }
    return await scanMiscIPC("text");
}

export async function scanTextTree(sync: boolean = false): Promise<MiscDir[]> {
    if (sync) {
        return await syncScanMiscTreeIPC<MiscDir>("text");
    }
    return await scanMiscTreeIPC<MiscDir>("text");
}

export async function syncScanText(): Promise<FileInfo[]> {
    return await syncScanMiscIPC("text");
}

export async function resetTextCacheTable(): Promise<void> {
    await resetMiscCacheIPC("text");
}
