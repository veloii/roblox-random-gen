import type { NextApiRequest, NextApiResponse } from "next";
import { request } from "undici";
import { Game } from "../../types";
import cacheData from "memory-cache";

const CACHE_DURATION = 24 * 60 * 60 * 1000;
const MAX_UNIVERSE_ID = 8915048233;
const BATCH_SIZE = 50;
const DEFAULT_THUMBNAIL_SIZE = "150x150";

interface CachedResponse {
  statusCode: number;
  json: any;
}

async function fetchWithCache(url: string): Promise<CachedResponse> {
  const cached = cacheData.get(url);
  if (cached) return cached;

  const res = await request(url);
  const json = await res.body.json();
  const data = { statusCode: res.statusCode, json };
  
  cacheData.put(url, data, CACHE_DURATION);
  return data;
}

async function getGameStats(universeId: string) {
  try {
    const { json, statusCode } = await fetchWithCache(
      `https://games.roblox.com/v1/games/${universeId}/game-passes?limit=10&sortOrder=Asc`
    );
    
    if (statusCode !== 200) return null;
    
    const { body } = await request(
      `https://games.roblox.com/v1/games?universeIds=${universeId}`
    );
    const gameData = await body.json();
    
    if (!gameData.data?.[0]) return null;
    
    const game = gameData.data[0];
    return {
      playing: game.playing || 0,
      visits: game.visits || 0,
      favorites: game.favoritedCount || 0,
      maxPlayers: game.maxPlayers || 0,
      created: game.created || '',
      updated: game.updated || '',
      gamePasses: json.data?.length || 0
    };
  } catch {
    return null;
  }
}

async function getUniverseId(universeId: string) {
  const { body, statusCode } = await request(
    `https://games.roblox.com/v1/games?universeIds=${universeId}`
  );
  if (statusCode !== 200) return null;
  
  const json = await body.json();
  return json.data?.[0] || null;
}

async function getImage(universeId: string) {
  const { json, statusCode } = await fetchWithCache(
    `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=${DEFAULT_THUMBNAIL_SIZE}&format=Png&isCircular=false`
  );
  return statusCode === 200 ? json.data?.[0]?.imageUrl : null;
}

async function getPlayable(universeId: string) {
  const { body, statusCode } = await request(
    `https://games.roblox.com/v1/games/multiget-playability-status?universeIds=${universeId}`
  );
  if (statusCode !== 200) return false;
  
  const json = await body.json();
  return json[0]?.playabilityStatus === "GuestProhibited";
}

async function getTruelyRandomGame(): Promise<Game | null> {
  const gamePromises = Array(BATCH_SIZE).fill(null).map(() => 
    getUniverseId(Math.floor(Math.random() * MAX_UNIVERSE_ID + 1).toString())
  );

  const games = await Promise.all(gamePromises);
  
  for (const game of games.filter(Boolean)) {
    if (!game?.name.includes("Place")) {
      const [playable, imageUrl, stats] = await Promise.all([
        getPlayable(game.id.toString()),
        getImage(game.id),
        getGameStats(game.id.toString())
      ]);

      if (playable && imageUrl && stats) {
        return {
          name: game.name,
          creatorName: game.creator.name,
          price: game.price,
          desc: game.description,
          universeId: game.id,
          placeId: game.rootPlaceId,
          image: imageUrl,
          stats
        };
      }
    }
  }

  return getTruelyRandomGame();
}

async function getPopularGame() {
  const { json, statusCode } = await fetchWithCache(
    "https://games.roblox.com/v1/games/list?model.sortToken=PopularStandardized"
  );

  if (statusCode !== 200) return null;

  const game = json.games[Math.floor(Math.random() * json.games.length)];
  const imageUrl = await getImage(game.universeId);
  const stats = await getGameStats(game.universeId.toString());

  return {
    name: game.name,
    creatorName: game.creatorName,
    price: game.price,
    desc: game.gameDescription,
    universeId: game.universeId,
    placeId: game.placeId,
    image: imageUrl,
    stats,
    totalUpVotes: game.totalUpVotes,
    totalDownVotes: game.totalDownVotes
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const game = req.query["popular"] === "yes" 
      ? await getPopularGame()
      : await getTruelyRandomGame();
    
    if (!game) {
      return res.status(500).json({ error: "Failed to fetch game" });
    }

    return res.status(200).json(game);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
