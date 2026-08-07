import { getAnimeInfoFromMalIPC, addAnimeInfoToMalIPC } from "../../ambiverts/mal";
import { getTvShowInfoFromTmdbIPC, addTvShowInfoToTmdbIPC } from "../../ambiverts/tv_show";
import { getAnimeInfoTENRAI } from "../../extroverts/tenrai";
import { getTvShowDetailsTMDB, getMovieDetailsTMDB } from "../../extroverts/tmdb";
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

export async function getTvShowInfoFromTmdb(id: string | null): Promise<string | null> {
    if (!id) {
        return null;
    }
    let result: string | null = await getTvShowInfoFromTmdbIPC(id);
    if (!result) {
        try {
            const data = await getTvShowDetailsTMDB(id);
            if (data) {
                result = JSON.stringify(data);
                try {
                    await addTvShowInfoToTmdbIPC(id, result);
                    logger.info("TMDB_TV_SHOW_INFO_API_TO_DB_SUCCESS", id);
                } catch (err) {
                    logger.error("TMDB_TV_SHOW_INFO_API_TO_DB_FAILED", err);
                }
            }
        } catch (err) {
            logger.error("TMDB_TV_SHOW_INFO_FROM_API_FAILED", err);
        }
    }
    return result;
}

export async function getMovieInfoFromTmdb(id: string | null): Promise<string | null> {
    if (!id) {
        return null;
    }
    let result: string | null = await getTvShowInfoFromTmdbIPC(id);
    if (!result) {
        try {
            const data = await getMovieDetailsTMDB(id);
            if (data) {
                result = JSON.stringify(data);
                try {
                    await addTvShowInfoToTmdbIPC(id, result);
                    logger.info("TMDB_MOVIE_INFO_API_TO_DB_SUCCESS", id);
                } catch (err) {
                    logger.error("TMDB_MOVIE_INFO_API_TO_DB_FAILED", err);
                }
            }
        } catch (err) {
            logger.error("TMDB_MOVIE_INFO_FROM_API_FAILED", err);
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

export async function getAnimeMetaData(show: ShowResult): Promise<ShowMetaData> {
    let result = null;
    try {
        const malIdNum = show.show_id ? parseInt(show.show_id, 10) : null;
        const malInfo = await getAnimeInfoFromMal(malIdNum && !isNaN(malIdNum) ? malIdNum : null);
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


// {
//   "adult": false,
//   "backdrop_path": null,
//   "created_by": [],
//   "episode_run_time": [],
//   "first_air_date": "2020-04-01",
//   "genres": [
//     {
//       "id": 16,
//       "name": "Animation"
//     },
//     {
//       "id": 35,
//       "name": "Comedy"
//     },
//     {
//       "id": 10762,
//       "name": "Kids"
//     }
//   ],
//   "homepage": "",
//   "id": 117691,
//   "in_production": true,
//   "languages": [
//     "xx"
//   ],
//   "last_air_date": "2020-04-01",
//   "last_episode_to_air": {
//     "id": 2685055,
//     "name": "Boon & Pimento Episode 1",
//     "overview": "Pimento is taking a shower but the water stops running! No worries, Boon has an idea to fix this up in no time… What will he order this time? Join them in this compilation of their crazy (mis)adventures to find out!",
//     "vote_average": 0,
//     "vote_count": 0,
//     "air_date": "2020-04-01",
//     "episode_number": 1,
//     "episode_type": "standard",
//     "production_code": "",
//     "runtime": null,
//     "season_number": 1,
//     "show_id": 117691,
//     "still_path": null
//   },
//   "name": "Boon & Pimento",
//   "next_episode_to_air": null,
//   "networks": [
//     {
//       "id": 247,
//       "logo_path": "/i9YpTodhXMOAYo0TZrP0UrHeunc.png",
//       "name": "YouTube",
//       "origin_country": ""
//     }
//   ],
//   "number_of_episodes": 3,
//   "number_of_seasons": 1,
//   "origin_country": [
//     "FR"
//   ],
//   "original_language": "fr",
//   "original_name": "Boon & Pimento",
//   "overview": "Boon (a lazy cat) and Pimento (a hyperactive rabbit) live in a quirky house in the middle of the desert. Fortunately, they have access to a website where they can order anything they want!\n\nHere’s the rub: for every little problem that crops up in their lives, they try to order a solution from the website. Confused by the magnitude of items available, Pimento can’t help but ordering something that is not exactly suited to their needs like a hair dryer to reheat pizza or a vacuum cleaner to remove the spinach stuck in Boon’s teeth… Let’s hope they won’t bring the house down!",
//   "popularity": 0.4931,
//   "poster_path": "/siEnrfNSCN9PtruANHTDc4idJtV.jpg",
//   "production_companies": [
//     {
//       "id": 17065,
//       "logo_path": "/mqoS56YswPVBO3nriH2Qj6pWWbY.png",
//       "name": "Studio Xilam",
//       "origin_country": "FR"
//     },
//     {
//       "id": 158025,
//       "logo_path": "/sykjLPNdHxbbMbOmDCzwvmszMCC.png",
//       "name": "Cross River Production",
//       "origin_country": "FR"
//     }
//   ],
//   "production_countries": [
//     {
//       "iso_3166_1": "FR",
//       "name": "France"
//     }
//   ],
//   "seasons": [
//     {
//       "air_date": "2020-04-01",
//       "episode_count": 3,
//       "id": 178758,
//       "name": "Season 1",
//       "overview": "",
//       "poster_path": "/cMSU1W7LWQqCQB063cqXJONs7Ni.jpg",
//       "season_number": 1,
//       "vote_average": 0
//     }
//   ],
//   "softcore": false,
//   "spoken_languages": [
//     {
//       "english_name": "No Language",
//       "iso_639_1": "xx",
//       "name": "No Language"
//     }
//   ],
//   "status": "Returning Series",
//   "tagline": "",
//   "type": "Scripted",
//   "vote_average": 8.4,
//   "vote_count": 8
// }

export async function getTvShowMetaData(show: ShowResult): Promise<ShowMetaData> {
    let result = null;
    try {
        if (show.show_id) {
            const tmdbInfo = await getTvShowInfoFromTmdb(show.show_id);
            if (tmdbInfo) {
                result = JSON.parse(tmdbInfo);
            }
        }
    } catch (err) {
        logger.error("TMDB_INFO_PARSING_ERROR", err);
    }
    // logger.info("GOT SHOW METADATA",result)
    return {
        posterUrl: result?.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : '',
        bannerUrl: result?.backdrop_path ? `https://image.tmdb.org/t/p/original${result.backdrop_path}` : '',
        rating: result?.vote_average || 0,
        totalEpisodes: result?.number_of_episodes || result?.episodes || 0,
        nextEpisode: getNextEpisode(show),
        seasonYear: result?.first_air_date ? result.first_air_date.substring(0, 4) : '',
        progress: calculateProgressPercentage(show.episodes?.length || 0, show.num_episodes),
        statusColor: getStatusColor(show.status)
    };
}

export async function getMovieMetaData(show: ShowResult): Promise<ShowMetaData> {
    let result = null;
    try {
        if (show.show_id) {
            const tmdbInfo = await getMovieInfoFromTmdb(show.show_id);
            if (tmdbInfo) {
                result = JSON.parse(tmdbInfo);
            }
        }
    } catch (err) {
        logger.error("TMDB_MOVIE_INFO_PARSING_ERROR", err);
    }

    return {
        posterUrl: result?.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : '',
        bannerUrl: result?.backdrop_path ? `https://image.tmdb.org/t/p/original${result.backdrop_path}` : '',
        rating: result?.vote_average || 0,
        totalEpisodes: 1,
        nextEpisode: getNextEpisode(show),
        seasonYear: result?.release_date ? result.release_date.substring(0, 4) : '',
        progress: calculateProgressPercentage(show.episodes?.length || 0, show.num_episodes),
        statusColor: getStatusColor(show.status)
    };
}

export async function getDefaultShowMetaData(show: ShowResult): Promise<ShowMetaData> {
    // logger.error("TRIGGERED DEFAULT DATA");
    return {
        posterUrl: '',
        bannerUrl: '',
        rating: 0,
        totalEpisodes: show.num_episodes || 0,
        nextEpisode: getNextEpisode(show),
        seasonYear: '',
        progress: calculateProgressPercentage(show.episodes?.length || 0, show.num_episodes),
        statusColor: getStatusColor(show.status)
    };
}

export async function getShowMetaData(show: ShowResult): Promise<ShowMetaData> {
    switch (show.show_type) {
        case 'anime':
            return getAnimeMetaData(show);
        case 'tv_show':
            return getTvShowMetaData(show);
        case 'movie':
            return getMovieMetaData(show);
        default:
            return getDefaultShowMetaData(show);
    }
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
