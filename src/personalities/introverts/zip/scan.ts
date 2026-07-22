import { scanZipIPC, syncScanZipIPC } from '../../ambiverts/zip';
import type { FileInfo } from "../../../types/media";

export async function scanZip(sync: boolean = false): Promise<FileInfo[]> {
    if (sync) {
        return await syncScanZipIPC();
    }
    return await scanZipIPC();
}
