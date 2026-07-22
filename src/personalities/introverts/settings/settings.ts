import { resetDatabaseIPC } from "../../ambiverts/settings";

export async function resetDatabase(): Promise<boolean> {
    return await resetDatabaseIPC();
}
