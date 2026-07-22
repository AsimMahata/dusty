import { scanZipIPC, syncScanZipIPC, scanZipTreeIPC, syncScanZipTreeIPC } from '../../ambiverts/zip';
import type { FileInfo } from "../../../types/media";
import type { ZipDir } from "../../../types/zip";

export async function scanZip(sync: boolean = false): Promise<FileInfo[]> {
    if (sync) {
        return await syncScanZipIPC();
    }
    return await scanZipIPC();
}

export async function scanZipTree(sync: boolean = false): Promise<ZipDir[]> {
    if (sync) {
        return await syncScanZipTreeIPC();
    }
    return await scanZipTreeIPC();
}
