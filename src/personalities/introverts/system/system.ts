import { getSystemInfoIPC } from "../../ambiverts/system";
import type { SystemInfoData } from "../../../pages/home/types/types";

export async function getSystemInfo(): Promise<SystemInfoData> {
    return await getSystemInfoIPC();
}
