import React, { useState, useEffect } from 'react';
import { PageLayout } from '../components/PageLayout';
import { NormalShows } from './shows/NormalShows';
import { BannedShows } from './shows/BannedShows';
import { invoke } from '@tauri-apps/api/core';
import type { ShowResult } from '../types/types';
import { logger } from '../utility/logger';

let cachedAllShows: ShowResult[] | null = null;

export const Shows: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'normal' | 'banned'>('normal');
    const [isItemSelected, setIsItemSelected] = useState(false);
    const [allShows, setAllShows] = useState<ShowResult[]>(cachedAllShows || []);

    const fetchShows = async () => {
        setIsRefreshing(true);
        if (allShows.length === 0) setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 600));
            let shows: ShowResult[] = await invoke('scan_shows', { path: "C:\\" });
            cachedAllShows = shows;
            setAllShows(shows);
            logger.info('all shows fetched', shows);
        } catch (error) {
            logger.error(`Failed to fetch shows: ${String(error)}`);
        } finally {
            setIsRefreshing(false);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!cachedAllShows) {
            fetchShows();
        }
    }, []);

    const updateShowStatus = (showId: string, isBanned: boolean) => {
        const newShows = allShows.map(show => 
            show.id === showId ? { ...show, is_banned: isBanned } : show
        );
        cachedAllShows = newShows;
        setAllShows(newShows);
    };

    const renderContent = () => {
        if (activeTab === 'normal') {
            return (
                <NormalShows 
                    searchQuery={searchQuery} 
                    shows={allShows.filter(s => !s.is_banned)}
                    onItemSelected={setIsItemSelected}
                    onStatusChange={(id) => updateShowStatus(id, true)}
                />
            );
        }
        
        return (
            <BannedShows 
                searchQuery={searchQuery} 
                shows={allShows.filter(s => s.is_banned)}
                onItemSelected={setIsItemSelected}
                onStatusChange={(id) => updateShowStatus(id, false)}
            />
        );
    };

    return (
        <PageLayout 
            title="Shows" 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            hideSearch={isItemSelected}
            onRefresh={fetchShows}
            isRefreshing={isRefreshing}
            isLoading={isLoading}
        >
            {!isItemSelected && (
                <div className="tabs-container">
                    <button 
                        className={`tab-btn ${activeTab === 'normal' ? 'active' : ''}`}
                        onClick={() => setActiveTab('normal')}
                    >
                        Shows
                    </button>
                    {/* Always the last option */}
                    <button 
                        className={`tab-btn ${activeTab === 'banned' ? 'active' : ''}`}
                        onClick={() => setActiveTab('banned')}
                    >
                        Banned
                    </button>
                </div>
            )}

            <div className="tab-content">
                {renderContent()}
            </div>
        </PageLayout>
    );
};
