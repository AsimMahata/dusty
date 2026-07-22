import { useState, useEffect, useMemo } from 'react';
import { useCommon } from '../useCommon';
import { fetchShows, updateBanStatus as updateBanStatusIntrovert, updateShowStatus as updateShowStatusIntrovert, updateShowTitle as updateShowTitleIntrovert, toggleShowPin as toggleShowPinIntrovert } from '../../personalities/introverts/show/shows';
import { openFile } from '../../personalities/introverts/filesystem/filesystem';
import { LOCAL_STORAGE_LAST_WATCHED, STATUS_PRIORITY, TABS } from '../../pages/shows/constants/constants';
import { logger } from '../../utility/logger';
import { DEFAULT_STARTING_PATHS } from '../../constants/defaults';
import { LABELS } from '../../constants/labels';
import { PIN_ICON_16, EYE_ICON_16, CHECK_CIRCLE_ICON_16, CALENDAR_ICON_16, PAUSE_CIRCLE_ICON_16, X_CIRCLE_ICON_16, ROTATE_CCW_ICON_16, BAN_ICON_16, SHIELD_CHECK_ICON_16, ICONS } from '../../constants/icon';
import { COLORS, ACTIONS_SEPARATOR } from '../../constants/color';
import { hashString } from '../../pages/shows/actions/hashString';
import { useMal } from './useMal';
import { useImdb } from './useImdb';
import { SEARCH_ICON_16 } from '../../constants/icon';
import { putEpisodeInRecent } from '../../personalities/introverts/home/recentEp';
import type { ShowResult, ShowStatus } from "../../types/shows";
import type { ActionItem } from "../../types/core";
import type { Episode } from "../../types/media";
import type { ShowSortMethod, ShowTab } from "../../types/shows";
import { getActiveTabShowPage, getDefaultTab, setActiveTabShowPage } from '../../session/show/tab';
import { getSortMethodShowPage, getDefaultSortMethod, setSortMethodShowPage, getSortAscendingShowPage, getDefaultSortAscending, setSortAscendingShowPage } from '../../session/show/sort';
import { getIsGridLayoutShowPage, getDefaultIsGridLayout, setIsGridLayoutShowPage } from '../../session/show/layout';


export const useShow = () => {

    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();

    const [activeTab, setActiveTab] = useState<ShowTab>(getDefaultTab());
    const [lastWatchedMap, setLastWatchedMap] = useState<Record<string, number>>(() => {
        try { return JSON.parse(localStorage.getItem(LOCAL_STORAGE_LAST_WATCHED) || '{}'); }
        catch { return {}; }
    });
    const [sortMethod, setSortMethod] = useState<ShowSortMethod>(getDefaultSortMethod());
    const [sortAscending, setSortAscending] = useState<boolean>(getDefaultSortAscending());
    const [randomSeed, setRandomSeed] = useState<number>(Math.random());
    const [isGridLayout, setIsGridLayout] = useState<boolean>(getDefaultIsGridLayout());
    const [selectedShow, setSelectedShow] = useState<ShowResult | null>(null);
    const [isItemSelected, setIsItemSelected] = useState(false);

    const [isAddAnimeOpen, setIsAddAnimeOpen] = useState(false);
    const [isScanAnimeOpen, setIsScanAnimeOpen] = useState(false);
    const [addAnimeQuery, setAddAnimeQuery] = useState('');
    const [addAnimeTargetShowId, setAddAnimeTargetShowId] = useState<string | undefined>(undefined);

    async function fetchSessionData(){
        try {
            const tab = await getActiveTabShowPage();
            setActiveTab(tab);
        } catch (e) {}
        try {
            const method = await getSortMethodShowPage();
            setSortMethod(method);
        } catch (e) {}
        try {
            const ascending = await getSortAscendingShowPage();
            setSortAscending(ascending);
        } catch (e) {}
        try {
            const gridLayout = await getIsGridLayoutShowPage();
            setIsGridLayout(gridLayout);
        } catch (e) {}
    }
    function updateActiveTab(tab:ShowTab) {
        setActiveTab(tab);
        void setActiveTabShowPage(tab);
    }
    function updateSortMethod(method:ShowSortMethod) {
        setSortMethod(method);
        void setSortMethodShowPage(method);
    }
    function updateSortAscending(ascending:boolean) {
        setSortAscending(ascending);
        void setSortAscendingShowPage(ascending);
    }
    function updateIsGridLayout(gridLayout:boolean) {
        setIsGridLayout(gridLayout);
        void setIsGridLayoutShowPage(gridLayout);
    }

    const handleOpenAddAnime = (query: string = '', targetShowId?: string) => {
        setAddAnimeQuery(query);
        setAddAnimeTargetShowId(targetShowId);
        setIsAddAnimeOpen(true);
    };

    const [isAddShowOpen, setIsAddShowOpen] = useState(false);
    const [addShowQuery, setAddShowQuery] = useState('');
    const [addShowTargetShowId, setAddShowTargetShowId] = useState<string | undefined>(undefined);

    const handleOpenAddShow = (query: string = '', targetShowId?: string) => {
        setAddShowQuery(query);
        setAddShowTargetShowId(targetShowId);
        setIsAddShowOpen(true);
        logger.todo('TV Show API is closed. Functionality is disabled.');
    };

    const [allShows, setAllShows] = useState<ShowResult[]>([]);

    const fetchData = async (sync: boolean = false) => {
        setIsRefreshing(true);
        if (allShows.length === 0) setIsLoading(true);

        try {
            let allFetchedShows: ShowResult[] = [];
            for (const path of DEFAULT_STARTING_PATHS) {
                try {
                    const shows: ShowResult[] = await fetchShows(path, sync);
                    allFetchedShows = [...allFetchedShows, ...shows];
                } catch (err) {
                    logger.error(`Failed to fetch shows from ${path}: ${String(err)}`);
                }
            }
            // Remove exact duplicates if they somehow exist across drives
            const uniqueShows = Array.from(new Map(allFetchedShows.map(item => [item.id, item])).values());
            setAllShows(uniqueShows);
            logger.info('all shows fetched', uniqueShows);
        } catch (error) {
            logger.error(`Failed to fetch shows: ${String(error)}`);
        } finally {
            setIsRefreshing(false);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSessionData();
        fetchData();
    }, []);


    const handleShowOpen = (s: ShowResult) => {
        const newMap = { ...lastWatchedMap, [s.id]: Date.now() };
        setLastWatchedMap(newMap);
        localStorage.setItem(LOCAL_STORAGE_LAST_WATCHED, JSON.stringify(newMap));
        setSelectedShow(s);
    };
    const updateBanStatus = async (showId: string, isBanned: boolean): Promise<boolean> => {
        try {
            await updateBanStatusIntrovert(showId, isBanned);
            const newShows = allShows.map(show =>
                show.id === showId ? { ...show, banned: isBanned } : show
            );
            setAllShows(newShows);
            logger.info("SHOW_BAN_STATUS_UPDATE_SUCESS", showId, isBanned);
            return true;
        } catch (err) {
            logger.error("SHOW_BAN_STATUS_UPDATE_FAILED", err);
            return false;
        }
    };

    const updateShowStatusOnDatabase = async (showId: string, status: ShowStatus): Promise<boolean> => {
        return updateShowStatusIntrovert(showId, status);
    }

    const updateShowVisualStatus = async (showId: string, status: ShowStatus): Promise<boolean> => {
        try {
            await updateShowStatusOnDatabase(showId, status);
            const newShows = allShows.map(show =>
                show.id === showId ? { ...show, status } : show
            );
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
            const success = await updateShowTitleIntrovert(showId, newTitle);
            if (!success) {
                logger.error(`Failed to rename show: ${showId}, ${newTitle}`);
                return;
            }
            const newShows = allShows.map(show =>
                show.id === showId ? { ...show, title: newTitle } : show
            );
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
                await toggleShowPinIntrovert(id, show.pinned);
                const newShows = allShows.map(s =>
                    s.id === id ? { ...s, pinned: !s.pinned } : s
                );
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
        updateShowInState: (showId, updates) => {
            const newShows = allShows.map(s => s.id === showId ? { ...s, ...updates } : s);
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
        updateMalIdForShow,
    } = malHook;

    const imdbHook = useImdb({
        updateShowInState: (showId, updates) => {
            const newShows = allShows.map(s => s.id === showId ? { ...s, ...updates } : s);
            setAllShows(newShows);
        }
    });

    const {
        showEditImdbId,
        currentEditShowImdb,
        imdbId,
        setImdbId,
        handleEditImdbId,
        handleSaveImdbId,
        handleCancelEditImdbId,
        updateImdbIdForShow,
    } = imdbHook;

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

        actions.push({
            label: 'Edit IMDB ID',
            icon: ICONS.GENERAL.EDIT,
            color: COLORS.BASE.ORANGE,
            onClick: () => {
                handleEditImdbId(show);
            }
        });

        actions.push({
            label: 'Search in IMDB',
            icon: SEARCH_ICON_16,
            color: COLORS.BASE.ORANGE,
            onClick: () => {
                handleOpenAddShow(show.title, show.id);
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

        if (!show.banned) {
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
        if (tab.id === 'seasonal') return allShows.filter(s => s.airing).length;
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
        updateSortMethod(method);
        if (method === 'random') {
            setRandomSeed(Math.random());
            updateSortAscending(true);
        } else if (method === 'last_watched' || method === 'malId') {
            updateSortAscending(false);
        } else {
            updateSortAscending(true);
        }
    };

    const openEpisode = async (ep: Episode) => {
        const path = ep.path;
        if (!path) return;
        try {
            await openFile(path);
        } catch (e) {
            logger.error(`Could not open file: ${String(e)}`);
        }
        if (!selectedShow) {
            return;
        }
        const currentEp = selectedShow.episodes?.find(e => e.id === ep.id);
        if (!currentEp) {
            return;
        }

        void putEpisodeInRecent(selectedShow, currentEp);
    };

    return {
        title: "Shows",
        searchQuery, setSearchQuery,
        isRefreshing,
        isLoading,
        activeTab, setActiveTab:updateActiveTab,
        isItemSelected, setIsItemSelected,
        selectedShow, setSelectedShow,
        lastWatchedMap, setLastWatchedMap, handleShowOpen,
        sortMethod, setSortMethod:updateSortMethod,
        sortAscending, setSortAscending:updateSortAscending,
        randomSeed, setRandomSeed,
        isGridLayout, setIsGridLayout:updateIsGridLayout,
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
        isScanAnimeOpen,
        setIsScanAnimeOpen,
        addAnimeQuery,
        setAddAnimeQuery,
        addAnimeTargetShowId,
        handleOpenAddAnime,
        updateMalIdForShow,
        isAddShowOpen,
        setIsAddShowOpen,
        addShowQuery,
        setAddShowQuery,
        addShowTargetShowId,
        handleOpenAddShow,
        handleEditImdbId,
        handleSaveImdbId,
        handleCancelEditImdbId,
        showEditImdbId,
        currentEditShowImdb,
        imdbId,
        setImdbId,
        updateImdbIdForShow,
        openEpisode
    };
};
