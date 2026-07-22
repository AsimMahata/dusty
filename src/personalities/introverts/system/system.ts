import { getSystemInfoIPC } from "../../ambiverts/system";
import type { SystemInfoData } from "../../../types/system";

export async function getSystemInfo(): Promise<SystemInfoData> {
    return await getSystemInfoIPC();
}
