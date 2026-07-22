import { getAllTablesIPC, resetTableIPC, resyncTableIPC } from "../../ambiverts/table";

export async function getAllTables(): Promise<string[]> {
    return await getAllTablesIPC();
}

export async function resetTable(tableName: string): Promise<boolean> {
    return await resetTableIPC(tableName);
}

export async function resyncTable(tableName: string): Promise<boolean> {
    return await resyncTableIPC(tableName);
}
