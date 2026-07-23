import { scanMiscIPC, syncScanMiscIPC, scanMiscTreeIPC, syncScanMiscTreeIPC } from '../../ambiverts/misc';
import type { FileInfo } from "../../../types/media";
import type { ZipDir } from "../../../types/zip";

export async function scanZip(sync: boolean = false): Promise<FileInfo[]> {
    if (sync) {
        return await syncScanMiscIPC("zip");
    }
    return await scanMiscIPC("zip");
}

export async function scanZipTree(sync: boolean = false): Promise<ZipDir[]> {
    if (sync) {
        return await syncScanMiscTreeIPC<ZipDir>("zip");
    }
    return await scanMiscTreeIPC<ZipDir>("zip");
}
