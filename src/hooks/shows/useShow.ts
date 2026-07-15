import { useState, useEffect } from 'react';
import { useCommon } from '../useCommon';
import { invoke } from '@tauri-apps/api/core';
import type { ShowResult } from '../../types/types';
import { logger } from '../../utility/logger';
import { useDefaults } from '../../contexts/defaultContext';

let cachedAllShows: ShowResult[] | null = null;

export const useShow = () => {
    const { DEFAULT_STARTING_PATH } = useDefaults();

    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();

    const [activeTab, setActiveTab] = useState<'normal' | 'banned'>('normal');
    const [isItemSelected, setIsItemSelected] = useState(false);
    const [allShows, setAllShows] = useState<ShowResult[]>(cachedAllShows || []);

    const fetchData = async () => {
        setIsRefreshing(true);
        if (allShows.length === 0) setIsLoading(true);
        try {
            let shows: ShowResult[] = await invoke('scan_shows', { path: DEFAULT_STARTING_PATH });
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
            fetchData();
        }
    }, []);

    const updateShowStatus = (showId: string, isBanned: boolean) => {
        const newShows = allShows.map(show =>
            show.id === showId ? { ...show, is_banned: isBanned } : show
        );
        cachedAllShows = newShows;
        setAllShows(newShows);
    };

    const updateShowTitle = async (showId: string, newTitle: string) => {
        try {
            logger.info('requested rename for', { id: showId, newName: newTitle });
            const success = await invoke("rename_show", { showId, newName: newTitle });
            if (!success) {
                logger.error(`Failed to rename show: ${showId}, ${newTitle}`);
                return;
            }
            const newShows = allShows.map(show =>
                show.id === showId ? { ...show, title: newTitle } : show
            );
            cachedAllShows = newShows;
            setAllShows(newShows);
            logger.info('renamed show', { id: showId, newName: newTitle });
        } catch (error) {
            logger.error(`Failed to rename show: ${String(error)}`);
            throw error;
        }
    };

    const handleTogglePin = (showId: string) => {
        logger.warn(`TODO: implement backend command to persist pin status for show ${showId}`);
        const newShows = allShows.map(show =>
            show.id === showId ? { ...show, is_pinned: !show.is_pinned } : show
        );
        cachedAllShows = newShows;
        setAllShows(newShows);
    };

    const getCommonRenderedActions = () => {
        return [];
    }

    return {
        title: "Shows",
        searchQuery, setSearchQuery,
        isRefreshing,
        isLoading,
        activeTab, setActiveTab,
        isItemSelected, setIsItemSelected,
        allShows,
        fetchData,
        updateShowStatus,
        updateShowTitle,
        handleTogglePin,
        getCommonRenderedActions
    };
};
