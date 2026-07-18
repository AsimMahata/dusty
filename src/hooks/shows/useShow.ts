import { useState, useEffect, useMemo } from 'react';
import { useCommon } from '../useCommon';
import { invoke } from '@tauri-apps/api/core';
import { CMD_SCAN_SHOWS, CMD_UPDATE_BAN_STATUS, CMD_UPDATE_SHOW_STATUS, CMD_RENAME_SHOW, CMD_UPDATE_PIN_STATUS, CMD_UPDATE_MAL_ID } from '../../constants/commands';
import type { ShowResult, ShowStatus, ActionItem } from '../../types/types';
import { LOCAL_STORAGE_LAST_WATCHED, STATUS_PRIORITY, TABS, type ShowSortMethod, type ShowTab, type ShowTabStatus } from '../../pages/shows/constants/constants';
import { logger } from '../../utility/logger';
import { DEFAULT_STARTING_PATH } from '../../constants/defaults';
import { LABELS } from '../../constants/labels';
import { PIN_ICON_16, EYE_ICON_16, CHECK_CIRCLE_ICON_16, CALENDAR_ICON_16, PAUSE_CIRCLE_ICON_16, X_CIRCLE_ICON_16, ROTATE_CCW_ICON_16, BAN_ICON_16, SHIELD_CHECK_ICON_16, ICONS } from '../../constants/icon';
import { COLORS, ACTIONS_SEPARATOR } from '../../constants/color';
import { hashString } from '../../pages/shows/actions/hashString';
import { useMal } from './useMal';
import { SEARCH_ICON_16 } from '../../constants/icon';

let cachedAllShows: ShowResult[] | null = null;

const getDefaultTab = () => {
    return TABS[1];
}

export const useShow = () => {

    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();

    const [activeTab, setActiveTab] = useState<ShowTab>(getDefaultTab());
    const [activeShowTab, setActiveShowTab] = useState<ShowTabStatus>('watching');
    const [lastWatchedMap, setLastWatchedMap] = useState<Record<string, number>>(() => {
        try { return JSON.parse(localStorage.getItem(LOCAL_STORAGE_LAST_WATCHED) || '{}'); } 
        catch { return {}; }
    });
    const [sortMethod, setSortMethod] = useState<ShowSortMethod>('last_watched');
    const [sortAscending, setSortAscending] = useState<boolean>(false);
    const [randomSeed, setRandomSeed] = useState<number>(Math.random());
    const [isGridLayout, setIsGridLayout] = useState(false);
    const [selectedShow, setSelectedShow] = useState<ShowResult | null>(null);
    const [isItemSelected, setIsItemSelected] = useState(false);

    const [isAddAnimeOpen, setIsAddAnimeOpen] = useState(false);
    const [addAnimeQuery, setAddAnimeQuery] = useState('');
    const [addAnimeTargetShowId, setAddAnimeTargetShowId] = useState<string | undefined>(undefined);

    const handleOpenAddAnime = (query: string = '', targetShowId?: string) => {
        setAddAnimeQuery(query);
        setAddAnimeTargetShowId(targetShowId);
        setIsAddAnimeOpen(true);
    };

    const [allShows, setAllShows] = useState<ShowResult[]>(cachedAllShows || []);
    const fetchData = async () => {
        setIsRefreshing(true);
        if (allShows.length === 0) setIsLoading(true);
        try {
            let shows: ShowResult[] = await invoke(CMD_SCAN_SHOWS, { path: DEFAULT_STARTING_PATH });
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


    const handleShowOpen = (s: ShowResult) => {
        const newMap = { ...lastWatchedMap, [s.id]: Date.now() };
        setLastWatchedMap(newMap);
        localStorage.setItem(LOCAL_STORAGE_LAST_WATCHED, JSON.stringify(newMap));
        setSelectedShow(s);
    };
    const updateBanStatus = async (showId: string, isBanned: boolean): Promise<boolean> => {
        try {
            await invoke(CMD_UPDATE_BAN_STATUS, { showId: showId, newBanStatus: isBanned });
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
        return invoke(CMD_UPDATE_SHOW_STATUS, { showId: showId, newStatus: status });
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
            const success = await invoke(CMD_RENAME_SHOW, { showId, newName: newTitle });
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
                await invoke(CMD_UPDATE_PIN_STATUS, { showId: id, newPinStatus: !show.pinned });
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
    
    const malHook = useMal({
        allShows,
        updateShowInState: (showId, updates) => {
            const newShows = allShows.map(s => s.id === showId ? { ...s, ...updates } : s);
            cachedAllShows = newShows;
            setAllShows(newShows);
        }
    });

    const {
        showEditMalId,
        currentEditShow,
        malNumber,
        setMalNumber,
        handleEditMalId,
        handleSaveMalId,
        handleCancelEditMalId,
    } = malHook;

    const getActionsForShow = (show: ShowResult): ActionItem[] => {
        const actions: ActionItem[] = [];

        actions.push({
            label: show.pinned ? LABELS.UNPIN : LABELS.PIN,
            icon: PIN_ICON_16,
            color: COLORS.PIN,
            onClick: () => handleTogglePin(show.id)
        });

        actions.push(ACTIONS_SEPARATOR);

        actions.push({
            label: LABELS.EDIT_MAL_ID,
            icon: ICONS.GENERAL.EDIT,
            color: COLORS.BASE.BLUE,
            onClick: () => {
                handleEditMalId(show);
            }
        });

        actions.push({
            label: LABELS.SEARCH_IN_MAL,
            icon: SEARCH_ICON_16,
            color: COLORS.BASE.BLUE,
            onClick: () => {
                handleOpenAddAnime(show.title, show.id);
            }
        });

        actions.push(ACTIONS_SEPARATOR);

        const updateStatus = (status: ShowStatus) => {
            void updateShowVisualStatus(show.id, status);
        };

        actions.push({ label: LABELS.MARK_WATCHING, icon: EYE_ICON_16, color: COLORS.STATUS.SHOW.watching, onClick: () => updateStatus('watching') });
        actions.push({ label: LABELS.MARK_COMPLETED, icon: CHECK_CIRCLE_ICON_16, color: COLORS.STATUS.SHOW.completed, onClick: () => updateStatus('completed') });
        actions.push({ label: LABELS.MARK_PLANNED, icon: CALENDAR_ICON_16, color: COLORS.STATUS.SHOW.planned, onClick: () => updateStatus('planned') });
        actions.push({ label: LABELS.MARK_ON_HOLD, icon: PAUSE_CIRCLE_ICON_16, color: COLORS.STATUS.SHOW.on_hold, onClick: () => updateStatus('on_hold') });
        actions.push({ label: LABELS.MARK_DROPPED, icon: X_CIRCLE_ICON_16, color: COLORS.STATUS.SHOW.dropped, onClick: () => updateStatus('dropped') });
        actions.push({ label: LABELS.MARK_DEFAULT, icon: ROTATE_CCW_ICON_16, color: 'var(--text-muted)', onClick: () => updateStatus('default') });

        actions.push(ACTIONS_SEPARATOR);

        if (activeShowTab !== 'banned') {
            actions.push({
                label: LABELS.BAN_SHOW,
                icon: BAN_ICON_16,
                color: COLORS.BASE.ROSE_900,
                onClick: () => {
                    updateBanStatus(show.id, true);
                }
            });
        } else {
            actions.push({
                label: LABELS.UNBAN_SHOW,
                icon: SHIELD_CHECK_ICON_16,
                color: COLORS.BASE.ROSE_900,
                onClick: () => {
                    updateBanStatus(show.id, false);
                }
            });
        }

        return actions;
    };

    const getCount = (tab: ShowTab) => {
        if (tab.id === 'banned') return allShows.filter(s => s.banned).length;
        if( tab.id === 'seasonal') return allShows.filter(s => s.airing).length;
        const shows = allShows.filter(s => !s.banned);
        if (tab.id === 'all') return shows.length;
        return shows.filter(s => s.status === tab.id).length;
    };

    const filteredShows = useMemo(() => {
        let baseShows = allShows;

        if (activeTab.id === 'banned') {
            baseShows = baseShows.filter(s => s.banned);
        } else {
            baseShows = baseShows.filter(s => !s.banned);

            if (activeTab.id === 'seasonal') {
                baseShows = baseShows.filter(s => s.airing);
            } else if (activeTab.id !== 'all') {
                baseShows = baseShows.filter(s => s.status === activeTab.id);
            }
        }

        if (searchQuery && searchQuery.trim().length > 0) {
            const query = searchQuery.toLowerCase();
            baseShows = baseShows.filter(s => 
                s.title.toLowerCase().includes(query) || 
                (s.get_title && s.get_title.toLowerCase().includes(query))
            );
        }

        return baseShows;
    }, [allShows, activeTab, searchQuery]);
        
      
    const lastWatchedDep =
    sortMethod === "last_watched" ? lastWatchedMap : null;

    const sortedShows = useMemo(() => {
        let result = [...filteredShows];
        
        result.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            
            let cmp = 0;
            if (sortMethod === 'last_watched') {
                const timeA = lastWatchedMap[a.id] || 0;
                const timeB = lastWatchedMap[b.id] || 0;
                cmp = timeA - timeB;
            } else if (sortMethod === 'status') {
                const pA = STATUS_PRIORITY[a.status] || 99;
                const pB = STATUS_PRIORITY[b.status] || 99;
                cmp = pA - pB;
                if (cmp === 0) cmp = a.title.localeCompare(b.title, undefined, { numeric: true });
            } else if (sortMethod === 'random') {
                cmp = hashString(a.id + randomSeed) - hashString(b.id + randomSeed);
            } else if (sortMethod === 'malId') {
                const malA = a.mal_id || 0;
                const malB = b.mal_id || 0;
                cmp = malA - malB;
                if (cmp === 0) cmp = a.title.localeCompare(b.title, undefined, { numeric: true });
            } else {
                cmp = a.title.localeCompare(b.title, undefined, { numeric: true });
            }
            
            return sortAscending ? cmp : -cmp;
        });
        
        return result;
    }, [filteredShows, sortMethod, sortAscending, randomSeed, lastWatchedDep]);

    const handleSortChange = (method: ShowSortMethod) => {
        setSortMethod(method);
        if (method === 'random') {
            setRandomSeed(Math.random());
            setSortAscending(true);
        } else if (method === 'last_watched' || method === 'malId') {
            setSortAscending(false);
        } else {
            setSortAscending(true);
        }
    };

    return {
        title: "Shows",
        searchQuery, setSearchQuery,
        isRefreshing,
        isLoading,
        activeTab, setActiveTab,
        activeShowTab, setActiveShowTab,
        isItemSelected, setIsItemSelected,
        selectedShow,setSelectedShow,
        lastWatchedMap,setLastWatchedMap,handleShowOpen,
        sortMethod,setSortMethod,
        sortAscending,setSortAscending,
        randomSeed,setRandomSeed,
        isGridLayout,setIsGridLayout,
        sortedShows,
        handleSortChange,
        allShows,
        fetchData,
        updateBanStatus,
        updateShowVisualStatus,
        updateShowTitle,
        handleTogglePin,
        getCommonRenderedActions,
        getActionsForShow,
        getCount,
        filteredShows,
        handleEditMalId,
        handleSaveMalId,
        handleCancelEditMalId,
        showEditMalId,
        currentEditShow,
        malNumber,
        setMalNumber,
        isAddAnimeOpen,
        setIsAddAnimeOpen,
        addAnimeQuery,
        setAddAnimeQuery,
        addAnimeTargetShowId,
        handleOpenAddAnime,
    };
};
