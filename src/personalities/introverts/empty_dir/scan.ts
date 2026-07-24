import { scanEmptyDirIPC, syncScanEmptyDirIPC } from '../../ambiverts/empty_dir';
import type { FileInfo } from "../../../types/core";

export async function scanEmptyDir(sync: boolean = false): Promise<FileInfo[]> {
    if (sync) {
        return await syncScanEmptyDirIPC();
    }
    return await scanEmptyDirIPC();
}
