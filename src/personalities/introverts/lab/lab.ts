import { tokenizeIPC, getAllTableDataIPC } from "../../ambiverts/lab";

export async function tokenize(input: string): Promise<string[]> {
    return await tokenizeIPC(input);
}

export async function getAllTableData(): Promise<Record<string, any[]>> {
    return await getAllTableDataIPC();
}
