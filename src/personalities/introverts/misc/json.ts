import { scanMiscIPC, syncScanMiscIPC, scanMiscTreeIPC, syncScanMiscTreeIPC, resetMiscCacheIPC } from '../../ambiverts/misc';
import type { FileInfo } from "../../../types/media";
import type { JsonDir } from "../../../types/json";

export async function scanJson(sync: boolean = false): Promise<FileInfo[]> {
    if (sync) {
        return await syncScanMiscIPC("json");
    }
    return await scanMiscIPC("json");
}

export async function scanJsonTree(sync: boolean = false): Promise<JsonDir[]> {
    if (sync) {
        return await syncScanMiscTreeIPC<JsonDir>("json");
    }
    return await scanMiscTreeIPC<JsonDir>("json");
}

export async function syncScanJson(): Promise<FileInfo[]> {
    return await syncScanMiscIPC("json");
}

export async function resetJsonCacheTable(): Promise<void> {
    await resetMiscCacheIPC("json");
}
