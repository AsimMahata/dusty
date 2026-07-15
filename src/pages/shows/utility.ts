import { invoke } from '@tauri-apps/api/core';
import { formatSize } from '../../utility/util';
import { logger } from '../../utility/logger';
import type { ItemData } from '../../components/ItemDetailPage';
import type { ShowResult } from '../../types/types';

export const getChildrens = async (item: ItemData, shows: ShowResult[]): Promise<ItemData[]> => {
    const show = shows.find(show => show.title === item.title);
    if (!show) return [];

    return show.episodes
        .map((ep, i) => ({
            id: `${item.id}-child-${i}`,
            title: ep.name,
            subtitle: ep.path,
            size: formatSize(ep.size),
            path: ep.path,
            is_dir: ep.is_dir
        }))
        .sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));
};

export const openEpisode = async (ep: ItemData) => {
    const path = ep.path;
    if (!path) return;
    try {
        await invoke("open_file", { path: path });
    } catch (e) {
        logger.error(`Could not open file: ${String(e)}`);
    }
};
