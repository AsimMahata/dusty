import { scanMiscIPC, syncScanMiscIPC, scanMiscTreeIPC, syncScanMiscTreeIPC, resetMiscCacheIPC } from '../../ambiverts/misc';
import type { FileInfo } from "../../../types/media";
import type { OfficeDir } from "../../../types/office";

export async function scanOffice(sync: boolean = false): Promise<FileInfo[]> {
    if (sync) {
        return await syncScanMiscIPC("office");
    }
    return await scanMiscIPC("office");
}

export async function scanOfficeTree(sync: boolean = false): Promise<OfficeDir[]> {
    if (sync) {
        return await syncScanMiscTreeIPC<OfficeDir>("office");
    }
    return await scanMiscTreeIPC<OfficeDir>("office");
}

export async function syncScanOffice(): Promise<FileInfo[]> {
    return await syncScanMiscIPC("office");
}

export async function resetOfficeCacheTable(): Promise<void> {
    await resetMiscCacheIPC("office");
}
