import { getAnimeInfoFromMalIPC, addAnimeInfoToMalIPC } from "../../ambiverts/mal";
import { getAnimeInfoTENRAI } from "../../extroverts/tenrai";
import { logger } from "../../../utility/logger";
import { COLORS } from "../../../constants/color";
import type { ShowResult } from '../../../pages/shows/types/types';
import type { ShowMetaData } from '../../../pages/shows/types/types';

export async function getAnimeInfoFromMal(id: number | null): Promise<string | null> {
    if (!id) {
        return null;
    }
    let result: string | null = await getAnimeInfoFromMalIPC(id);
    if (!result) {
        try {
            const res = await getAnimeInfoTENRAI(id);
            result = res?.data || null;
            if (result) {
                try {
                    await addAnimeInfoToMalIPC(id, result);
                    logger.info("MAL_INFO_API_TO_DB_SUCCESS", id);
                } catch (err) {
                    logger.error("MAL_INFO_API_TO_DB_FAILED", err);
                }
            }
        } catch (err) {
            logger.error("MAL_INFO_FROM_API_FAILED", err);
        }
    }
    return result;
}

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

export async function getShowMetaData(show: ShowResult): Promise<ShowMetaData> {
    let result = null;
    try {
        const malInfo = await getAnimeInfoFromMal(show.mal_id ?? null);
        if (malInfo) {
            result = JSON.parse(malInfo);
        }
    } catch (err) {
        logger.error("MAL_INFO_PARSING_ERROR", err);
    }

    return {
        posterUrl: result?.images?.jpg?.large_image_url || '',
        bannerUrl: result?.images?.jpg?.image_url || '',
        rating: result?.score || 0,
        totalEpisodes: result?.episodes || 0,
        nextEpisode: getNextEpisode(show),
        seasonYear: result?.season?.year || '',
        progress: calculateProgressPercentage(show.episodes?.length || 0, show.num_episodes),
        statusColor: getStatusColor(show.status)
    };
}

/*
{
  "mal_id": 63403,
  "url": "https://myanimelist.net/anime/63403/Yani_Neko",
  "images": {
    "jpg": {
      "image_url": "https://cdn.myanimelist.net/images/anime/1281/156496.jpg",
      "small_image_url": "https://cdn.myanimelist.net/images/anime/1281/156496t.jpg",
      "large_image_url": "https://cdn.myanimelist.net/images/anime/1281/156496l.jpg"
    },
    "webp": {
      "image_url": "https://cdn.myanimelist.net/images/anime/1281/156496.webp",
      "small_image_url": "https://cdn.myanimelist.net/images/anime/1281/156496t.webp",
      "large_image_url": "https://cdn.myanimelist.net/images/anime/1281/156496l.webp"
    }
  },
  "trailer": {
    "youtube_id": null,
    "url": null,
    "embed_url": "https://www.youtube-nocookie.com/embed/ydK2WdTAOgU?enablejsapi=1&wmode=opaque&autoplay=1",
    "images": {
      "image_url": null,
      "small_image_url": null,
      "medium_image_url": null,
      "large_image_url": null,
      "maximum_image_url": null
    }
  },
  "approved": true,
  "titles": [
    {
      "type": "Default",
      "title": "Yani Neko"
    },
    {
      "type": "Japanese",
      "title": "ヤニねこ"
    },
    {
      "type": "English",
      "title": "Chainsmoker Cat"
    }
  ],
  "title": "Yani Neko",
  "title_english": "Chainsmoker Cat",
  "title_japanese": "ヤニねこ",
  "title_synonyms": [],
  "type": "TV",
  "source": "Manga",
  "episodes": null,
  "status": "Currently Airing",
  "airing": true,
  "aired": {
    "from": "2026-07-03T00:00:00+00:00",
    "to": null,
    "prop": {
      "from": {
        "day": 3,
        "month": 7,
        "year": 2026
      },
      "to": {
        "day": null,
        "month": null,
        "year": null
      }
    },
    "string": "Jul 3, 2026 to ?"
  },
  "duration": "23 min",
  "rating": "R - 17+ (violence & profanity)",
  "score": 7.13,
  "scored_by": 8668,
  "rank": 4185,
  "popularity": 2912,
  "members": 74444,
  "favorites": 245,
  "synopsis": "Yani is a catgirl with a seriously bad smoking habit. She smokes so much that her apartment smells like ash and is littered with cigarette butts—and plenty of other trash! Every time she tries to quit, she becomes weak to the cravings and gives in almost instantly. Will she ever get her life together, or is she doomed to live as a chainsmoking slob forever?\n\n(Source: Seven Seas Entertainment)",
  "background": "",
  "season": "summer",
  "year": 2026,
  "broadcast": {
    "day": "Fridays",
    "time": "00:30",
    "timezone": "Asia/Tokyo",
    "string": "Fridays at 00:30 (JST)"
  },
  "producers": [
    {
      "mal_id": 159,
      "type": "anime",
      "name": "Kodansha",
      "url": "https://myanimelist.net/anime/producer/159/Kodansha"
    },
    {
      "mal_id": 306,
      "type": "anime",
      "name": "Magic Capsule",
      "url": "https://myanimelist.net/anime/producer/306/Magic_Capsule"
    },
    {
      "mal_id": 1211,
      "type": "anime",
      "name": "Tokyo MX",
      "url": "https://myanimelist.net/anime/producer/1211/Tokyo_MX"
    }
  ],
  "licensors": [],
  "studios": [
    {
      "mal_id": 1722,
      "type": "anime",
      "name": "Bibury Animation Studios",
      "url": "https://myanimelist.net/anime/producer/1722/Bibury_Animation_Studios"
    }
  ],
  "genres": [
    {
      "mal_id": 4,
      "type": "anime",
      "name": "Comedy",
      "url": "https://myanimelist.net/anime/genre/4/Comedy"
    }
  ],
  "explicit_genres": [],
  "themes": [
    {
      "mal_id": 50,
      "type": "anime",
      "name": "Adult Cast",
      "url": "https://myanimelist.net/anime/genre/50/Adult_Cast"
    },
    {
      "mal_id": 51,
      "type": "anime",
      "name": "Anthropomorphic",
      "url": "https://myanimelist.net/anime/genre/51/Anthropomorphic"
    }
  ],
  "demographics": [
    {
      "mal_id": 42,
      "type": "anime",
      "name": "Seinen",
      "url": "https://myanimelist.net/anime/genre/42/Seinen"
    }
  ]
}

*/
