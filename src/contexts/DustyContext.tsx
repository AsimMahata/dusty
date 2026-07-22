import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSystemInfo } from '../personalities/introverts/system/system';
import { logger } from '../utility/logger';
import type { SystemInfoData, StorageInfo, OverviewStats, UserProfile } from "../types/system";
import type { MediaItem } from "../types/media";

interface DustyContextType {
    lastOpenedPage: string;
    setLastOpenedPage: (path: string) => void;
    
    // Dummy Data
    profile: UserProfile;
    systemStatus: string;
    heroBanner: string[];
    heroLogo: string;
    overviewStats: OverviewStats;
    storageInfo: StorageInfo;
    systemData: SystemInfoData | null;
    continueWatching: MediaItem[];
    watchEpisode: (showTitle: string, episodeTitle: string, image?: string) => void;
}

const DustyContext = createContext<DustyContextType | undefined>(undefined);

export const DustyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lastOpenedPage, setLastOpenedPage] = useState<string>('/');
    
    // Dynamic State
    const [profile, setProfile] = useState<UserProfile>({ name: 'User', avatar: '/icon.png' });
    const [systemData, setSystemData] = useState<SystemInfoData | null>(null);
    
    const [storageInfo, setStorageInfo] = useState<StorageInfo>({
        used: '0 B',
        free: '0 B',
        total: '0 B',
        segments: [
            { color: 'green', percent: 0 },
            { color: 'yellow', percent: 0 },
            { color: 'orange', percent: 0 },
        ],
    });
    
    useEffect(() => {
        const fetchSystemInfo = async () => {
            try {
                const info = await getSystemInfo();
                setSystemData(info);
                
                if (info && info.username) {
                    const rawName = info.username as string;
                    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
                    setProfile(prev => ({ ...prev, name: formattedName }));
                }

                // Compute Storage Info from all disks
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
                    
                    setStorageInfo({
                        used: formatBytes(usedDiskSpace),
                        free: formatBytes(availableDiskSpace),
                        total: formatBytes(totalDiskSpace),
                        segments: [
                            { color: 'green', percent: Math.min(usedPercent, 50) },
                            { color: 'yellow', percent: Math.max(0, Math.min(usedPercent - 50, 30)) },
                            { color: 'orange', percent: Math.max(0, usedPercent - 80) },
                        ]
                    });
                }

            } catch (err) {
                logger.error("Failed to get system info", err);
            }
        };
        fetchSystemInfo();
    }, []);

    const systemStatus = 'Filesystem is up to date.';
    const heroBanner = ['/banner.jpg'];
    const heroLogo = '/icon.png';
    const overviewStats = { shows: 531, projects: 35, songs: 2410, videos: 486 };
    
    const [continueWatching, setContinueWatching] = useState<MediaItem[]>([
        { id: '1', title: 'Frieren', subtitle: 'Episode 18', progressPercent: 60, image: '/banner.jpg' },
        { id: '2', title: 'One Piece', subtitle: 'Episode 1136', progressPercent: 30, image: '/banner.jpg' },
        { id: '3', title: 'Trigun', subtitle: 'Episode 2', progressPercent: 85, image: '/banner.jpg' },
    ]);

    const watchEpisode = (showTitle: string, episodeTitle: string, image: string = '/banner.jpg') => {
        setContinueWatching(prev => {
            // Ensure we are tracking the SHOW, not allowing duplicate episodes to clutter the list
            const existingIndex = prev.findIndex(item => item.title === showTitle);
            const newItem = {
                id: existingIndex >= 0 ? prev[existingIndex].id : Date.now().toString(),
                title: showTitle,
                subtitle: episodeTitle,
                progressPercent: Math.floor(Math.random() * 100), // dummy progress
                image
            };
            
            if (existingIndex >= 0) {
                const newList = [...prev];
                newList.splice(existingIndex, 1);
                return [newItem, ...newList];
            }
            return [newItem, ...prev].slice(0, 3);
        });
    };

    return (
        <DustyContext.Provider value={{ 
            lastOpenedPage, setLastOpenedPage,
            profile, systemStatus, heroBanner, heroLogo, overviewStats, storageInfo, systemData, continueWatching, watchEpisode
        }}>
            {children}
        </DustyContext.Provider>
    );
};

export const useDusty = () => {
    const context = useContext(DustyContext);
    if (!context) {
        throw new Error("useDusty must be used within a DustyProvider");
    }
    return context;
};


export const RouteTracker: React.FC = () => {
    const location = useLocation();
    const { setLastOpenedPage } = useDusty();

    useEffect(() => {
        if (location.pathname !== '/settings' && location.pathname !== '/lab' && location.pathname !== '/todo') {
            setLastOpenedPage(location.pathname);
        }
    }, [location.pathname, setLastOpenedPage]);

    return null;
};
