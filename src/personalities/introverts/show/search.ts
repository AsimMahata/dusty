import { logger } from "../../../utility/logger";
import { searchAnimeTENRAI, getSeasonalAnimeTENRAI } from "../../extroverts/tenrai";
import { searchShowTMDB } from "../../extroverts/tmdb";
import { getCouplingValueBetweenQueryAndResultTitleIPC } from "../../ambiverts/utility";
import type { ShowResult, ProviderSearchResult, ScannedProviderResult, ShowType } from '../../../pages/shows/types/types';
import { addShowsToDb } from "./shows";



export async function searchProvider(query: string, provider: string): Promise<ProviderSearchResult[]> {
    if (!query || query.trim().length < 3) {
        return [];
    }

    const normProvider = provider.toLowerCase();
    try {
        if (normProvider === 'mal' || normProvider === 'tenrai') {
            const res = await searchAnimeTENRAI(query);
            return res?.data.map(item => ({
                title: item.title,
                provider_id: item.provider_id.toString(),
                provider: 'mal',
                num_episodes: item.num_episodes,
                season: item.season,
                airing: item.airing,
                image_url: item.image_url,
                show_type: 'anime' as ShowType,
                raw_payload: JSON.stringify(item)
            })) || [];
        } else if (normProvider === 'tmdb' || normProvider === 'imdb') {
            const res = await searchShowTMDB(query);
            const results = res?.data || [];
            return results.map((item: any) => {
                const title = item["#TITLE"] || item.name || item.title || '';
                const id = item["#IMDB_ID"] || (item.id ? item.id.toString() : '');
                const rawYear = item["#YEAR"] || (item.first_air_date ? item.first_air_date.substring(0, 4) : null) || (item.release_date ? item.release_date.substring(0, 4) : null);
                const year = rawYear ? parseInt(rawYear.toString(), 10) : null;
                const image_url = item["#IMG_POSTER"] || (item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '');
                const show_type = (item.media_type === 'movie' || item.release_date) ? 'movie_tv' : 'movie_tv';
                return {
                    title,
                    provider_id: id,
                    provider: 'tmdb',
                    year,
                    image_url,
                    show_type: show_type as ShowType,
                    raw_payload: JSON.stringify(item)
                };
            });
        }
    } catch (e) {
        logger.error(`searchProvider error (provider=${provider}, query=${query}): ${e}`);
    }

    return [];
}

export async function scanShowsForProvider(
    shows: ShowResult[],
    provider: string,
    onProgress: (current: number, total: number) => void,
    onResultsUpdated: (results: ScannedProviderResult[]) => void,
    isMounted: () => boolean
): Promise<void> {
    const showsToScan = shows.filter(s => s.show_type === 'unknown');

    if (showsToScan.length === 0) {
        return;
    }

    // Clean query and sort by query length (shorter queries first)
    const preparedShows = showsToScan.map(show => {
        const cleanQuery = show.title.replace(/^s\d+\s+/i, '').trim();
        return { show, cleanQuery };
    });

    for (let i = preparedShows.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [preparedShows[i], preparedShows[j]] = [preparedShows[j], preparedShows[i]];
    }

    const resultsMap = new Map<string, ScannedProviderResult>();

    for (let i = 0; i < preparedShows.length; i++) {
        if (!isMounted()) return;

        const { show, cleanQuery } = preparedShows[i];
        onProgress(i + 1, preparedShows.length);

        try {
            const results = await searchProvider(cleanQuery, provider);
            // Limit to top 3 results to score
            const topResults = results.slice(0, 3);

            let updated = false;
            for (let index = 0; index < topResults.length; index++) {
                const item = topResults[index];

                // Fetch the similarity/coupling score from backend
                const coupling = await getCouplingValueBetweenQueryAndResultTitleIPC(item.title, cleanQuery) || 0;

                // Priority score calculation: smaller values represent higher priority
                const prevPriority = index + 1;
                const newPriority = parseFloat((0.7 * (1 - coupling) + 0.3 * prevPriority).toFixed(2));

                const resultKey = `${item.provider}:${item.provider_id}`;
                if (!resultsMap.has(resultKey)) {
                    resultsMap.set(resultKey, {
                        ...item,
                        priority: newPriority,
                        sourceQuery: show.title
                    });
                    updated = true;
                } else {
                    const existing = resultsMap.get(resultKey)!;
                    if (newPriority < existing.priority) {
                        existing.priority = newPriority;
                        existing.sourceQuery = show.title;
                        updated = true;
                    }
                }
            }

            if (updated) {
                onResultsUpdated(Array.from(resultsMap.values()).sort((a, b) => a.priority - b.priority));
            }
        } catch (error) {
            logger.error(`Failed to scan show ${show.title} for provider ${provider}: ${error}`);
        }

        if (i < preparedShows.length - 1) {
            await new Promise(r => setTimeout(r, 500));
        }
    }
}

export async function addSeasonalShows(): Promise<boolean> {
    try {
        const res = await getSeasonalAnimeTENRAI();
        if (!res || res.data.length === 0) {
            logger.error('addSeasonalShows: no seasonal data returned');
            return false;
        }

        const showsToSave: ShowResult[] = res.data.map(item => ({
            id: ' ',
            title: item.title,
            get_title: item.title,
            num_episodes: item.num_episodes || 0,
            episodes: [],
            dir: '',
            banned: false,
            pinned: false,
            status: 'default',
            provider: 'mal',
            provider_id: item.provider_id,
            airing: item.airing || false,
            show_type: 'anime',
            raw_payload: item.raw_payload
        }));

        return await addShowsToDb(showsToSave);
    } catch (err) {
        logger.error(`addSeasonalShows failed: ${err}`);
        return false;
    }
}
