import { getSystemInfoIPC } from '../../ambiverts/system';
import { getOverviewStatsIPC } from '../../ambiverts/overview';
import { logger } from '../../../utility/logger';
import type { StorageInfo, OverviewStats, HomeDashboardData } from "../../../pages/home/types/types";

export async function fetchHomeDashboardData(): Promise<HomeDashboardData> {
    const defaultStorageInfo: StorageInfo = {
        used: '0 B', free: '0 B', total: '0 B',
        segments: [
            { color: 'green', percent: 0 },
            { color: 'yellow', percent: 0 },
            { color: 'orange', percent: 0 },
        ]
    };
    const defaultStats: OverviewStats = { shows: 0, projects: 0, songs: 0, videos: 0 };

    try {
        const [info, backendStats] = await Promise.all([
            getSystemInfoIPC().catch(e => {
                logger.error("Failed to get system info", e);
                return null;
            }),
            getOverviewStatsIPC().catch(e => {
                logger.error("Failed to get overview stats", e);
                return null;
            })
        ]);

        let profileName = 'User';
        if (info && info.username) {
            const rawName = info.username as string;
            profileName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        }

        let storageInfo = defaultStorageInfo;
        if (info && info.disks) {
            let totalDiskSpace = 0;
            let availableDiskSpace = 0;
            for (const disk of info.disks) {
                totalDiskSpace += disk.total_space;
                availableDiskSpace += disk.available_space;
            }
            const usedDiskSpace = totalDiskSpace - availableDiskSpace;

            const formatBytes = (bytes: number) => {
                if (bytes === 0) return '0 B';
                const k = 1024;
                const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
            };

            const usedPercent = totalDiskSpace > 0 ? (usedDiskSpace / totalDiskSpace) * 100 : 0;

            storageInfo = {
                used: formatBytes(usedDiskSpace),
                free: formatBytes(availableDiskSpace),
                total: formatBytes(totalDiskSpace),
                segments: [
                    { color: 'green', percent: Math.min(usedPercent, 50) },
                    { color: 'yellow', percent: Math.max(0, Math.min(usedPercent - 50, 30)) },
                    { color: 'orange', percent: Math.max(0, usedPercent - 80) },
                ]
            };
        }

        let overviewStats = defaultStats;
        if (backendStats) {
            overviewStats = {
                shows: backendStats.shows || 0,
                projects: backendStats.projects || 0,
                songs: backendStats.songs || 0,
                videos: backendStats.videos || 0
            };
        }

        return {
            profileName,
            systemData: info,
            storageInfo,
            overviewStats
        };
    } catch (err) {
        logger.error("Failed to get system info", err);
        return {
            profileName: 'User',
            systemData: null,
            storageInfo: defaultStorageInfo,
            overviewStats: defaultStats
        };
    }
}
