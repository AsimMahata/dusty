import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface MediaItem {
  id: string;
  title: string;
  subtitle: string;
  progressPercent: number;
  image: string;
}

export interface StorageInfo {
  used: string;
  free: string;
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

interface DustyContextType {
    lastOpenedPage: string;
    setLastOpenedPage: (path: string) => void;
    
    // Dummy Data
    profile: UserProfile;
    systemStatus: string;
    heroBanner: string;
    heroLogo: string;
    overviewStats: OverviewStats;
    storageInfo: StorageInfo;
    continueWatching: MediaItem[];
    watchEpisode: (showTitle: string, episodeTitle: string, image?: string) => void;
}

const DustyContext = createContext<DustyContextType | undefined>(undefined);

export const DustyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lastOpenedPage, setLastOpenedPage] = useState<string>('/');
    
    // Dummy State
    const profile = { name: 'Asim', avatar: '/icon.png' };
    const systemStatus = 'Filesystem is up to date.';
    const heroBanner = '/banner.jpg';
    const heroLogo = '/icon.png';
    const overviewStats = { shows: 531, projects: 35, songs: 2410, videos: 486 };
    const storageInfo = {
        used: '1.2 TB',
        free: '600 GB',
        segments: [
            { color: 'green' as const, percent: 45 },
            { color: 'yellow' as const, percent: 25 },
            { color: 'orange' as const, percent: 10 },
        ],
    };
    
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
            profile, systemStatus, heroBanner, heroLogo, overviewStats, storageInfo, continueWatching, watchEpisode
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
        if (location.pathname !== '/settings' && location.pathname !== '/lab') {
            setLastOpenedPage(location.pathname);
        }
    }, [location.pathname, setLastOpenedPage]);

    return null;
};
