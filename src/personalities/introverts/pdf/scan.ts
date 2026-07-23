import { scanMiscIPC, syncScanMiscIPC, scanMiscTreeIPC, syncScanMiscTreeIPC } from '../../ambiverts/misc';
import type { FileInfo } from "../../../types/media";
import type { PdfDir } from "../../../types/pdf";

export async function scanPdf(sync: boolean = false): Promise<FileInfo[]> {
    if (sync) {
        return await syncScanMiscIPC("pdf");
    }
    return await scanMiscIPC("pdf");
}

export async function scanPdfTree(sync: boolean = false): Promise<PdfDir[]> {
    if (sync) {
        return await syncScanMiscTreeIPC<PdfDir>("pdf");
    }
    return await scanMiscTreeIPC<PdfDir>("pdf");
}
