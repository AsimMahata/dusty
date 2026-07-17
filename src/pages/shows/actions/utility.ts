import { invoke } from '@tauri-apps/api/core';
import { CMD_OPEN_FILE } from '../../../constants/commands';
import { formatBytes } from '../../../utility/util';
import { logger } from '../../../utility/logger';
import type { ItemCollection, ShowResult, Episode } from '../../../types/types';

export const getChildrens = async (item: ItemCollection, shows: ShowResult[]): Promise<Episode[]> => {
    const show = shows.find(show => show.id === item.id);
    if (!show) return [];

    return show.episodes
        .map((ep, i) => ({
            id: `${item.id}-child-${i}`,
            title: ep.name,
            size: formatBytes(ep.size),
            path: ep.path
        }))
        .sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));
};

export const openEpisode = async (ep: Episode) => {
    const path = ep.path;
    if (!path) return;
    try {
        await invoke(CMD_OPEN_FILE, { path: path });
    } catch (e) {
        logger.error(`Could not open file: ${String(e)}`);
    }
};


export const getEpisodeActions = (episode: Episode) => {
    return [
        { label: 'Open', color: 'var(--accent)', onClick: () => openEpisode(episode) },
        { label: 'Copy Path', onClick: () => episode.path && navigator.clipboard.writeText(episode.path) },
        { label: 'Copy File Name', onClick: () => episode.title && navigator.clipboard.writeText(episode.title) }
    ]
}