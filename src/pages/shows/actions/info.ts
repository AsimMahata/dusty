import type { ShowResult } from '../../../types/types';
import { COLORS } from '../../../constants/color';
import type { ShowMetaData } from '../constants/constants';

export const getDummyPosterUrl = (malNo?: string) => {
    if (!malNo) return '';
    // return placeholder image url, maybe some dummy image service or local asset?
    // User requested "simple dummy helper functions that return placeholder values."
    return `https://cdn.myanimelist.net/images/anime/1120/138139l.webp`; // Just a generic URL
};

export const getDummyRating = (malNo?: string) => {
    if (!malNo) return 0;
    return 9.3; 
};

export const getShowBanner = (show: ShowResult) => {
    if (!show.malNo) return '';
    // Placeholder banner image
    return `https://s4.anilist.co/file/anilistcdn/media/anime/banner/140270-1OSeHxy2FzXq.jpg`; // Random banner placeholder
};

export const getDummyTotalEpisodes = (show: ShowResult) => {
    return show.num_episodes > 0 ? show.num_episodes : '?';
};

export const getDummyNextEpisode = (show: ShowResult) => {
    // Just returning a static number for now based on mocked image
    return show.episodes.length + 1;
};

export const getDummySeasonYear = (malNo?: string) => {
    if (!malNo) return '';
    return 'Spring 2023';
};

export const getStatusColor = (status: string) => {
    return COLORS.STATUS.SHOW[status as keyof typeof COLORS.STATUS.SHOW] || '#71717a';
};



export const calculateProgressPercentage = (episodesWatched: number, totalEpisodes: number) => {
    if (totalEpisodes === 0) return episodesWatched > 0 ? 100 : 0;
    return Math.round((episodesWatched / totalEpisodes) * 100);
};



export function getShowMetaData(show: ShowResult):ShowMetaData {
    return {
        posterUrl: getDummyPosterUrl(show.malNo),
        bannerUrl: getShowBanner(show),
        rating: getDummyRating(show.malNo),
        totalEpisodes: getDummyTotalEpisodes(show),
        nextEpisode: getDummyNextEpisode(show),
        seasonYear: getDummySeasonYear(show.malNo),
        progress: calculateProgressPercentage(show.episodes?.length || 0, show.num_episodes),
        statusColor: getStatusColor(show.status)
    };
}