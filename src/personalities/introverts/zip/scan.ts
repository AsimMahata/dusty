import { scanMiscIPC, syncScanMiscIPC, scanMiscTreeIPC, syncScanMiscTreeIPC } from '../../ambiverts/misc';
import type { MiscDir } from "../../../pages/misc/types/types";
import type { FileInfo } from '../../../types/core';

export async function scanZip(sync: boolean = false): Promise<FileInfo[]> {
    if (sync) {
        return await syncScanMiscIPC("zip");
    }
    return await scanMiscIPC("zip");
}

export async function scanZipTree(sync: boolean = false): Promise<MiscDir[]> {
    if (sync) {
        return await syncScanMiscTreeIPC<MiscDir>("zip");
    }
    return await scanMiscTreeIPC<MiscDir>("zip");
}
