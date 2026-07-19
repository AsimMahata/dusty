import { logger } from "../../utility/logger";
import { searchShowAPI } from "../../extroverts/show/imdb";

export interface ShowData {
    title: string;
    imdb_id: string;
    year: number | null;
    image_url?: string;
}

export async function searchShow(query: string): Promise<ShowData[]> {
    if (!query || query.trim().length < 3) {
        return [];
    }
    try {
        const results = await searchShowAPI(query);
        if (!results || !Array.isArray(results)) return [];
        return results.map((item: any) => {
            const show = item.show;
            const yearStr = show.premiered ? show.premiered.split('-')[0] : null;
            return {
                title: show.name,
                imdb_id: show.externals?.imdb || show.id.toString(), // fallback to tvmaze id if imdb missing
                year: yearStr ? parseInt(yearStr, 10) : null,
                image_url: show.image?.medium || ''
            };
        });
    } catch (e) {
        logger.error(`searchShow error: ${e}`);
        return [];
    }
}
