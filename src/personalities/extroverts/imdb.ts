import { logger } from "../../utility/logger";
import { fetch } from "@tauri-apps/plugin-http";
import { ApiProvider } from '../../pages/shows/types/types';

export const IMDB_BASE_API = 'https://imdb.iamidiotareyoutoo.com';

const FETCH_OPTIONS = {
    method: 'GET',
    headers: {
        'User-Agent': 'Dusty-File-Manager/1.0',
        'Accept': 'application/json'
    }
};

export async function searchShowIMDB(query: string, retryCount = 0): Promise<{ data: any[]; source: typeof ApiProvider.IMDB } | null> {
    try {
        const url = `${IMDB_BASE_API}/search?q=${encodeURIComponent(query)}`;
        const res = await fetch(url, FETCH_OPTIONS);

        if (res.status === 429 && retryCount < 2) {
            // TVmaze asks to back off for a few seconds
            logger.warn(`TVMAZE API Rate Limited. Retrying in 2 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return searchShowIMDB(query, retryCount + 1);
        }
        logger.info(`SEARCH_SHOW_FROM_API_SUCCESS`, url, res);
        if (!res.ok) {
            logger.error(`SEARCH_SHOW_FROM_API_FAILED`, res.statusText);
            return null;
        }

        const data = await res.json();

        if (!data || !data.ok || !Array.isArray(data.description)) {
            logger.error(`SEARCH_SHOW_API_RETURNED_ERROR`, data);
            return { data: [], source: ApiProvider.IMDB };
        }

        logger.info(`SEARCH_SHOW_FROM_API_SUCCESS`, data.description.length);
        return {
            data: data.description,
            source: ApiProvider.IMDB,
        };
    } catch (err) {
        logger.error(`SEARCH_SHOW_FROM_API_FAILED`, err);
        return null;
    }
}
