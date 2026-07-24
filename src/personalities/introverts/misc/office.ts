import { scanMiscIPC, syncScanMiscIPC, scanMiscTreeIPC, syncScanMiscTreeIPC, resetMiscCacheIPC } from '../../ambiverts/misc';
import type { MiscDir } from "../../../pages/misc/types/types";
import type { FileInfo } from '../../../types/core';

export async function scanOffice(sync: boolean = false): Promise<FileInfo[]> {
    if (sync) {
        return await syncScanMiscIPC("office");
    }
    return await scanMiscIPC("office");
}

export async function scanOfficeTree(sync: boolean = false): Promise<MiscDir[]> {
    if (sync) {
        return await syncScanMiscTreeIPC<MiscDir>("office");
    }
    return await scanMiscTreeIPC<MiscDir>("office");
}

export async function syncScanOffice(): Promise<FileInfo[]> {
    return await syncScanMiscIPC("office");
}

export async function resetOfficeCacheTable(): Promise<void> {
    await resetMiscCacheIPC("office");
}
