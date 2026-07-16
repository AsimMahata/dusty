import { useState, useEffect } from 'react';
import { useCommon } from '../useCommon';
import { invoke } from '@tauri-apps/api/core';
import type { ShowResult, ShowStatus } from '../../types/types';
import { logger } from '../../utility/logger';
import { DEFAULT_STARTING_PATH } from '../../constants/defaults';

let cachedAllShows: ShowResult[] | null = null;

export const useShow = () => {

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

    const updateBanStatus = async (showId: string, isBanned: boolean): Promise<boolean> => {
        try {
            await invoke('update_ban_status', { showId: showId, newBanStatus: isBanned });
            const newShows = allShows.map(show =>
                show.id === showId ? { ...show, banned: isBanned } : show
            );
            cachedAllShows = newShows;
            setAllShows(newShows);
            logger.info("SHOW_BAN_STATUS_UPDATE_SUCESS", showId, isBanned);
            return true;
        } catch (err) {
            logger.error("SHOW_BAN_STATUS_UPDATE_FAILED", err);
            return false;
        }
    };

    const updateShowStatusOnDatabase = async (showId: string, status: ShowStatus): Promise<boolean> => {
        return invoke('update_show_status', { showId: showId, newStatus: status });
    }

    const updateShowVisualStatus = async (showId: string, status: ShowStatus): Promise<boolean> => {
        try {
            await updateShowStatusOnDatabase(showId, status);
            const newShows = allShows.map(show =>
                show.id === showId ? { ...show, status } : show
            );
            cachedAllShows = newShows;
            setAllShows(newShows);
            logger.info("SHOW_STATUS_UPDATE_SUCESS", showId, status);
            return true;
        } catch (err) {
            logger.error("SHOW_STATUS_UPDATE_FAILED", err);
            return false;
        }
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

    const handleTogglePin = async (id: string) => {
        const show = allShows.find(s => s.id === id);
        if (show) {
            try {
                await invoke('update_pin_status', { showId: id, newPinStatus: !show.pinned });
                const newShows = allShows.map(s =>
                    s.id === id ? { ...s, pinned: !s.pinned } : s
                );
                cachedAllShows = newShows;
                setAllShows(newShows);
            } catch (err) {
                logger.error(`Failed to toggle pin for show ${id}: ${String(err)}`);
            }
        }
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
        updateShowStatus: updateBanStatus,
        updateShowVisualStatus,
        updateShowTitle,
        handleTogglePin,
        getCommonRenderedActions
    };
};
