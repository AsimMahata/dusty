import { invoke } from "@tauri-apps/api/core";
import { CMD_MAL_GET_INFO } from "../../ambiverts/show/mal";
import { logger } from "../../utility/logger";

export async function getAnimeInfoFromMalApi(id: number): Promise<string | null> {
    try {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch anime info for malId=${id}`);
        }
        const json = await res.json();
        const data = json?.data || null;
        logger.info(`MAL_INFO_FROM_API_SUCESS id ${id}`);
        return JSON.stringify(data);
    } catch (err) {
        logger.error(`MAL_INFO_FROM_API_FAILED id ${id}`, err);
        return null;
    }
}