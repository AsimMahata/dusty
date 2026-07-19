import { logger } from "../../utility/logger";

export const TVMAZE_API_BASE = 'https://api.tvmaze.com';

const FETCH_OPTIONS = {
    mode: 'cors' as RequestMode,
    // Note: browsers may block setting User-Agent directly in fetch, but providing it per API docs
    headers: {
        'User-Agent': 'Dusty-Media-Manager/1.0',
        'Accept': 'application/json'
    }
};

export async function searchShowAPI(query: string, retryCount = 0): Promise<any[] | null> {
    try {
        const url = `${TVMAZE_API_BASE}/search/shows?q=${encodeURIComponent(query)}`;
        const res = await fetch(url, FETCH_OPTIONS);
        
        if (res.status === 429 && retryCount < 2) {
            // TVmaze asks to back off for a few seconds
            logger.warn(`TVMAZE API Rate Limited. Retrying in 2 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return searchShowAPI(query, retryCount + 1);
        }
        
        if (!res.ok) {
            logger.error(`SEARCH_SHOW_FROM_API_FAILED`, res.statusText);
            return null;
        }
        
        const data = await res.json();
        
        if (!Array.isArray(data)) {
            logger.error(`SEARCH_SHOW_API_RETURNED_ERROR`, data);
            return [];
        }
        
        logger.info(`SEARCH_SHOW_FROM_API_SUCCESS`, data.length);
        return data;
    } catch (err) {
        logger.error(`SEARCH_SHOW_FROM_API_FAILED`, err);
        return null;
    }
}
