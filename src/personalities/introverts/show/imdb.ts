import { logger } from "../../../utility/logger";
import { searchShowTMDB } from "../../extroverts/tmdb";
import { addSeasonalShowIPC } from "../../ambiverts/imdb";
import type { ShowData } from '../../../pages/shows/types/types';

export async function saveSelectedShow(data: ShowData[]): Promise<boolean> {
    return await addSeasonalShowIPC(data);
}

export async function searchShow(query: string): Promise<ShowData[]> {
    if (!query || query.trim().length < 3) {
        return [];
    }
    try {
        const res = await searchShowTMDB(query);
        const results = res?.data || null;
        if (!results || !Array.isArray(results)) return [];
        logger.info(`SEARCH_SHOW_FROM_API_RESULT`, results);
        return results.map((item: any) => {
            const title = item["#TITLE"] || item.name || item.title || '';
            const id = item["#IMDB_ID"] || (item.id ? item.id.toString() : '');
            const rawYear = item["#YEAR"] || (item.first_air_date ? item.first_air_date.substring(0, 4) : null);
            const year = rawYear ? parseInt(rawYear.toString(), 10) : null;
            const image_url = item["#IMG_POSTER"] || (item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '');
            return {
                title,
                imdb_id: id,
                year,
                image_url
            };
        });
    } catch (e) {
        logger.error(`searchShow error: ${e}`);
        return [];
    }
}
