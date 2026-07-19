import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchHomeDashboardData } from '../../../introverts/home/home';
import type { MediaItem, UserProfile, StorageInfo, OverviewStats } from '../../../contexts/DustyContext';

interface HomeContextType {
    profile: UserProfile;
    systemStatus: string;
    heroBanner: string[];
    heroLogo: string;
    overviewStats: OverviewStats;
    storageInfo: StorageInfo;
    continueWatching: MediaItem[];
    watchEpisode: (showTitle: string, episodeTitle: string, image?: string) => void;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export const HomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<UserProfile>({ name: 'User', avatar: '/icon.png' });
    const [storageInfo, setStorageInfo] = useState<StorageInfo>({
        used: '0 B', free: '0 B', total: '0 B',
        segments: [
            { color: 'green', percent: 0 },
            { color: 'yellow', percent: 0 },
            { color: 'orange', percent: 0 },
        ]
    });
    const [overviewStats, setOverviewStats] = useState<OverviewStats>({ shows: 0, projects: 0, songs: 0, videos: 0 });

    useEffect(() => {
        fetchHomeDashboardData().then(data => {
            setProfile(prev => ({ ...prev, name: data.profileName }));
            setStorageInfo(data.storageInfo);
            setOverviewStats(data.overviewStats);
        });
    }, []);

    const systemStatus = 'Filesystem is up to date.';
    const heroBanner = ['/banner.jpg'];
    const heroLogo = '/icon.png';
    
    const [continueWatching, setContinueWatching] = useState<MediaItem[]>([
        { id: '1', title: 'Frieren', subtitle: 'Episode 18', progressPercent: 60, image: '/banner.jpg' },
        { id: '2', title: 'One Piece', subtitle: 'Episode 1136', progressPercent: 30, image: '/banner.jpg' },
        { id: '3', title: 'Trigun', subtitle: 'Episode 2', progressPercent: 85, image: '/banner.jpg' },
    ]);

    const watchEpisode = (showTitle: string, episodeTitle: string, image: string = '/banner.jpg') => {
        setContinueWatching(prev => {
            const existingIndex = prev.findIndex(item => item.title === showTitle);
            const newItem = {
                id: existingIndex >= 0 ? prev[existingIndex].id : Date.now().toString(),
                title: showTitle,
                subtitle: episodeTitle,
                progressPercent: Math.floor(Math.random() * 100),
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
        <HomeContext.Provider value={{
            profile, systemStatus, heroBanner, heroLogo, overviewStats, storageInfo, continueWatching, watchEpisode
        }}>
            {children}
        </HomeContext.Provider>
    );
};

export const useHomeContext = () => {
    const context = useContext(HomeContext);
    if (!context) throw new Error("useHomeContext must be used within a HomeProvider");
    return context;
};
