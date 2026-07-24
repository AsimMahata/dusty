import type { Episode } from "../../../components/media/types/types";
import type { ShowResult } from "../../shows/types/types";

export interface DiskInfo {
    name: string;
    kind: string;
    file_system: string;
    total_space: number;
    available_space: number;
    is_removable: boolean;
}
export interface CpuInfo {
    name: string;
    cpu_usage: number;
    frequency: number;
}
export interface ProcessInfo {
    pid: string;
    name: string;
    memory: number;
    cpu_usage: number;
}
export interface SystemInfoData {
    username: string | null;
    os_version: string | null;
    hostname: string | null;
    uptime: number;
    total_memory: number;
    used_memory: number;
    total_swap: number;
    used_swap: number;
    cpus: CpuInfo[];
    disks: DiskInfo[];
    processes: ProcessInfo[];
}
export interface StorageInfo {
  used: string;
  free: string;
  total: string;
  segments: {
    color: 'green' | 'yellow' | 'orange';
    percent: number;
  }[];
}
export interface OverviewStats {
  shows: number;
  projects: number;
  songs: number;
  videos: number;
}
export interface UserProfile {
  name: string;
  avatar: string;
}
export interface AppSettings {
    theme: 'dark' | 'light';
    showHiddenFiles: boolean;
    autoUpdate: boolean;
}
export interface BackendStats {
    shows: number | null;
    projects: number | null;
    songs: number | null;
    videos: number | null;
    images: number | null;
    zips: number | null;
    pdfs: number | null;
    empty_dir: number | null;
}

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


