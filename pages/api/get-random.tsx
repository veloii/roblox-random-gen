import type { NextApiRequest, NextApiResponse } from "next";
import { performance } from "perf_hooks";
import { request } from "undici";
import { Game } from "../../types";
import cacheData from "memory-cache";

const MAX_ID_VALUE = 12_000_000_000;
const MAX_TIME = 24 * 1000 * 60 * 60;
const RANDOM_GAME_INT = 75;

async function fetchWithCache(url) {
  const cached = cacheData.get(url);
  if (cached) return cached;
  const res = await request(url);
  const json = await res.body.json();
  cacheData.put(url, { statusCode: res.statusCode, json }, MAX_TIME);
  return { statusCode: res.statusCode, json };
}

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function getUniverseId(universeId) {
  const { body, statusCode } = await request(
    `https://games.roblox.com/v1/games?universeIds=${universeId}`
  );
  if (statusCode !== 200) return null;
  const json = await body.json();
  return json.data?.[0] || null;
}

async function getImage(universeId) {
  const { json, statusCode } = await fetchWithCache(
    `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=150x150&format=Png&isCircular=false`
  );
  return statusCode === 200 ? json.data?.[0]?.imageUrl || null : null;
}

async function getPlayable(universeId: string) {
  const { body, statusCode } = await request(
    `https://games.roblox.com/v1/games/multiget-playability-status?universeIds=${universeId}`
  );
  if (statusCode !== 200) return false;
  const json = await body.json();
  return json[0].playabilityStatus === "GuestProhibited";
}

async function getRandomGame() {
  while (true) {
    const universeIds = Array.from({ length: RANDOM_GAME_INT }, () => randomInt(1, MAX_ID_VALUE).toString());
    const games = await Promise.allSettled(universeIds.map(getUniverseId));

    for (const result of games) {
      if (result.value) {
        const game = result.value;
        const imageUrl = await getImage(game.id);

        return {
            name: game.name,
            creator: game.creator,
            price: game.price,
            desc: game.description,
            universeId: game.id,
            placeId: game.rootPlaceId,
            image: imageUrl,
            
            sourceName: game.sourceName,
            sourceDescription: game.sourceDescription,
            allowedGearGenres: game.allowedGearGenres,
            allowedGearCategories: game.allowedGearCategories,
            isGenreEnforced: game.isGenreEnforced,
            copyingAllowed: game.copyingAllowed,
            playing: game.playing,
            visits: game.visits,
            maxPlayers: game.maxPlayers,
            created: game.created,
            updated: game.updated,
            studioAccessToApisAllowed: game.studioAccessToApisAllowed,
            createVipServersAllowed: game.createVipServersAllowed,
            universeAvatarType: game.universeAvatarType,
            genre: game.genre,
            genre_l1: game.genre_l1,
            genre_l2: game.genre_l2,
            isAllGenre: game.isAllGenre,
            isFavoritedByUser: game.isFavoritedByUser,
            favoritedCount: game.favoritedCount,
          };
      }
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const game = await getRandomGame();
  res.status(200).json(game);
}
