import { scanMiscIPC, syncScanMiscIPC, scanMiscTreeIPC, syncScanMiscTreeIPC, resetMiscCacheIPC } from '../../ambiverts/misc';
import type { FileInfo } from "../../../types/media";
import type { TextDir } from "../../../types/text";

export async function scanText(sync: boolean = false): Promise<FileInfo[]> {
    if (sync) {
        return await syncScanMiscIPC("text");
    }
    return await scanMiscIPC("text");
}

export async function scanTextTree(sync: boolean = false): Promise<TextDir[]> {
    if (sync) {
        return await syncScanMiscTreeIPC<TextDir>("text");
    }
    return await scanMiscTreeIPC<TextDir>("text");
}

export async function syncScanText(): Promise<FileInfo[]> {
    return await syncScanMiscIPC("text");
}

export async function resetTextCacheTable(): Promise<void> {
    await resetMiscCacheIPC("text");
}
