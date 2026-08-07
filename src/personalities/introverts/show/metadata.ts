import { getShowCacheIPC, upsertShowCacheIPC, getShowCacheKeyIPC } from "../../ambiverts/show";
import { getAnimeInfoTENRAI } from "../../extroverts/tenrai";
import { getTvShowDetailsTMDB, getMovieDetailsTMDB } from "../../extroverts/tmdb";
import { logger } from "../../../utility/logger";
import { COLORS } from "../../../constants/color";
import type { ShowResult, ShowMetaData } from '../../../pages/shows/types/types';

export const getStatusColor = (status: string) => {
    return COLORS.STATUS.SHOW[status as keyof typeof COLORS.STATUS.SHOW] || COLORS.BASE.ZINC;
};

export const calculateProgressPercentage = (episodesWatched: number, totalEpisodes: number) => {
    if (totalEpisodes === 0) return episodesWatched > 0 ? 100 : 0;
    return Math.round((episodesWatched / totalEpisodes) * 100);
};

export const getNextEpisode = (show: ShowResult) => {
    return show.episodes.length + 1;
};

async function computeShowCacheKey(title: string): Promise<string> {
    return getShowCacheKeyIPC(title);
}

export { computeShowCacheKey };

export async function getProviderPayload(show: ShowResult): Promise<string | null> {
    const { provider, provider_id: providerId, show_type: showType } = show;
    if (!provider || !providerId) {
        return null;
    }

    const normProvider = provider.toLowerCase();
    const cacheKey = await computeShowCacheKey(show.title);

    try {
        const cached = await getShowCacheIPC(cacheKey, normProvider);
        if (cached) {
            return cached;
        }
    } catch (err) {
        logger.error(`getProviderPayload: cache read failed (${show.title}): ${err}`);
    }

    logger.info(`getProviderPayload: cache miss for "${show.title}", fetching from ${provider}`);
    let data: string | null = null;
    try {
        if (normProvider === 'mal' || normProvider === 'tenrai') {
            const malIdNum = parseInt(providerId, 10);
            if (!isNaN(malIdNum)) {
                const res = await getAnimeInfoTENRAI(malIdNum);
                data = res?.data || null;
            }
        } else if (normProvider === 'tmdb' || normProvider === 'imdb') {
            if (showType === 'movie_tv') {
                const res = await getMovieDetailsTMDB(providerId);
                if (res) data = JSON.stringify(res);
            } else {
                const res = await getTvShowDetailsTMDB(providerId);
                if (res) data = JSON.stringify(res);
            }
        }
    } catch (err) {
        logger.error(`getProviderPayload: provider fetch failed (provider=${provider}, id=${providerId}): ${err}`);
    }

    if (data) {
        try {
            await upsertShowCacheIPC(cacheKey, normProvider, data);
        } catch (err) {
            logger.error(`getProviderPayload: cache write failed (${show.title}): ${err}`);
        }
    }

    return data;
}

export async function getShowMetaData(show: ShowResult): Promise<ShowMetaData> {
    const defaultMeta: ShowMetaData = {
        posterUrl: '',
        bannerUrl: '',
        rating: 0,
        totalEpisodes: show.num_episodes || 0,
        nextEpisode: getNextEpisode(show),
        seasonYear: '',
        progress: calculateProgressPercentage(show.episodes?.length || 0, show.num_episodes || 0),
        statusColor: getStatusColor(show.status)
    };

    if (!show.provider || !show.provider_id) {
        return defaultMeta;
    }

    try {
        const payloadStr = await getProviderPayload(show);
        if (!payloadStr) {
            return defaultMeta;
        }

        let result = JSON.parse(payloadStr);

        // Fallback for polluted cache where a ProviderSearchResult was stored instead of the pure API payload
        if (result && result.raw_payload && typeof result.raw_payload === 'string') {
            try {
                result = JSON.parse(result.raw_payload);
            } catch (e) {
                logger.error('getShowMetaData: failed to parse inner raw_payload for', show.title);
            }
        }
        const normProvider = show.provider.toLowerCase();

           if (normProvider === 'mal' || normProvider === 'tenrai') {
            const episodes = result?.episodes || 0;
            // console.log('debug',result);
            return {
                posterUrl: result?.images?.jpg?.large_image_url || '',
                bannerUrl: result?.images?.jpg?.image_url || '',
                rating: result?.score || 0,
                totalEpisodes: episodes,
                nextEpisode: getNextEpisode(show),
                seasonYear: result?.season?.year || result?.year || '',
                progress: calculateProgressPercentage(show.episodes?.length || 0, episodes || show.num_episodes || 0),
                statusColor: getStatusColor(show.status)
            };
        } else if (normProvider === 'tmdb' || normProvider === 'imdb') {
            const isMovie = show.show_type === 'movie_tv' || result?.release_date !== undefined;
            const totalEps = isMovie ? 1 : (result?.number_of_episodes || result?.episodes || 0);
            const seasonYear = result?.first_air_date
                ? result.first_air_date.substring(0, 4)
                : (result?.release_date ? result.release_date.substring(0, 4) : '');

            return {
                posterUrl: result?.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : '',
                bannerUrl: result?.backdrop_path ? `https://image.tmdb.org/t/p/original${result.backdrop_path}` : '',
                rating: result?.vote_average || 0,
                totalEpisodes: totalEps,
                nextEpisode: getNextEpisode(show),
                seasonYear,
                progress: calculateProgressPercentage(show.episodes?.length || 0, totalEps || show.num_episodes || 0),
                statusColor: getStatusColor(show.status)
            };
        }
    } catch (err) {
        logger.error(`Failed to parse metadata payload for show ${show.id}: ${err}`);
    }

    return defaultMeta;
}
