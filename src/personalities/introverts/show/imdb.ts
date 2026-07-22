import { logger } from "../../../utility/logger";
import { searchShowAPI } from "../../extroverts/show/imdb";
import { addSeasonalShowIPC } from "../../ambiverts/imdb";
import type { ShowData } from "../../../types/shows";

export async function saveSelectedShow(data: ShowData[]): Promise<boolean> {
    return await addSeasonalShowIPC(data);
}

export async function searchShow(query: string): Promise<ShowData[]> {
    if (!query || query.trim().length < 3) {
        return [];
    }
    try {
        const results = await searchShowAPI(query);
        if (!results || !Array.isArray(results)) return [];
        logger.info(`SEARCH_SHOW_FROM_API_RESULT`, results);
        return results.map((item: any) => {
            return {
                title: item["#TITLE"],
                imdb_id: item["#IMDB_ID"],
                year: item["#YEAR"] ? parseInt(item["#YEAR"].toString(), 10) : null,
                image_url: item["#IMG_POSTER"] || ''
            };
        });
    } catch (e) {
        logger.error(`searchShow error: ${e}`);
        return [];
    }
}
