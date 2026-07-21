import type { Episode } from "./media";
import type { ShowResult } from "./shows";
import type { SystemInfoData, StorageInfo, OverviewStats } from "./system";

export interface HomeDashboardData {
    profileName: string;
    systemData: SystemInfoData | null;
    storageInfo: StorageInfo;
    overviewStats: OverviewStats;
}
export interface RecentEpisode {
    show: ShowResult;
    episode: Episode;
}

