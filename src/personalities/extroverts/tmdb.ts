import { ApiProvider } from "../../pages/shows/types/types";
import { logger } from "../../utility/logger";
import { fetch } from "@tauri-apps/plugin-http";
import { searchShowIMDB } from "./imdb";

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

export async function searchShowTMDB(query: string, retryCount = 0): Promise<{ data: any[]; source: typeof ApiProvider.TMDB | typeof ApiProvider.IMDB } | null> {
    const tmdbKey = import.meta.env.VITE_TMDB_API_KEY || import.meta.env.TMDB_API_KEY;
    
    if (!tmdbKey) {
        logger.warn("TMDB API Key missing (VITE_TMDB_API_KEY is undefined), falling back to IMDB search API.");
        return searchShowIMDB(query, retryCount);
    }

    const fetchOptions: RequestInit = {
        method: 'GET',
        headers: {
            'User-Agent': 'Dusty-File-Manager/1.0',
            'Accept': 'application/json',
            'Authorization': `Bearer ${tmdbKey}`
        }
    };

    try {
        const url = `${TMDB_API_BASE_URL}/search/multi?query=${encodeURIComponent(query)}`;
        const res = await fetch(url, fetchOptions);
        if (res.status === 429 && retryCount < 2) {
            logger.warn(`TMDB API Rate Limited. Retrying in 2 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return searchShowTMDB(query, retryCount + 1);
        }

        if (!res.ok) {
            logger.error(`SEARCH_SHOW_FROM_TMDB_FAILED status: ${res.status}, falling back to IMDB`);
            return searchShowIMDB(query, retryCount);
        }

        const data = await res.json();
        console.log('gotten resutl',data);
        if (!data || !Array.isArray(data.results)) {
            logger.error(`SEARCH_SHOW_API_RETURNED_ERROR`, data);
            return { data: [], source: ApiProvider.TMDB };
        }

        logger.info(`SEARCH_SHOW_FROM_TMDB_SUCCESS`, data.results.length);
        return {
            data: data.results,
            source: ApiProvider.TMDB,
        };
    } catch (err) {
        logger.error(`SEARCH_SHOW_FROM_TMDB_FAILED`, err);
        return searchShowIMDB(query, retryCount);
    }
}
