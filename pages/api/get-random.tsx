import type { NextApiRequest, NextApiResponse } from "next";
import { request } from "undici";
import { Game } from "../../types";
import cacheData from "memory-cache";

const CACHE_DURATION = 24 * 60 * 60 * 1000;
const MAX_UNIVERSE_ID = 12000800000;
const BATCH_SIZE = 10;
const MAX_RETRIES = 2;
const DEFAULT_THUMBNAIL_SIZE = "150x150";
const REQUEST_TIMEOUT = 5000;

interface CachedResponse {
  statusCode: number;
  json: any;
}

async function fetchWithTimeout(url: string, timeout: number) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const res = await request(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    return res;
  } catch (error) {
    return null;
  }
}

async function fetchWithCache(url: string): Promise<CachedResponse | null> {
  const cached = cacheData.get(url);
  if (cached) return cached;

  const res = await fetchWithTimeout(url, REQUEST_TIMEOUT);
  if (!res) return null;

  try {
    const json = await res.body.json();
    const data = { statusCode: res.statusCode, json };
    cacheData.put(url, data, CACHE_DURATION);
    return data;
  } catch {
    return null;
  }
}

async function getGameStats(universeId: string) {
  try {
    const [passesResponse, gameResponse] = await Promise.all([
      fetchWithCache(`https://games.roblox.com/v1/games/${universeId}/game-passes?limit=10&sortOrder=Asc`),
      fetchWithTimeout(`https://games.roblox.com/v1/games?universeIds=${universeId}`, REQUEST_TIMEOUT)
    ]);
    
    if (!passesResponse || !gameResponse) return null;
    
    const gameData = await gameResponse.body.json();
    const game = gameData.data?.[0];
    if (!game) return null;
    
    return {
      playing: game.playing || 0,
      visits: game.visits || 0,
      favorites: game.favoritedCount || 0,
      maxPlayers: game.maxPlayers || 0,
      created: game.created || '',
      updated: game.updated || '',
      gamePasses: passesResponse.json.data?.length || 0
    };
  } catch {
    return null;
  }
}

async function getUniverseId(universeId: string) {
  const res = await fetchWithTimeout(
    `https://games.roblox.com/v1/games?universeIds=${universeId}`,
    REQUEST_TIMEOUT
  );
  if (!res) return null;
  
  try {
    const json = await res.body.json();
    return json.data?.[0] || null;
  } catch {
    return null;
  }
}

async function getImage(universeId: string) {
  const response = await fetchWithCache(
    `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=${DEFAULT_THUMBNAIL_SIZE}&format=Png&isCircular=false`
  );
  return response?.statusCode === 200 ? response.json.data?.[0]?.imageUrl : null;
}

async function getTruelyRandomGame(retryCount = 0): Promise<Game | null> {
  if (retryCount >= MAX_RETRIES) {
    return null;
  }

  const gamePromises = Array(BATCH_SIZE).fill(null).map(() => 
    getUniverseId(Math.floor(Math.random() * MAX_UNIVERSE_ID + 1).toString())
  );

  const games = await Promise.all(gamePromises);
  const validGames = games.filter(game => game && !game.name.includes("Place"));

  for (const game of validGames) {
    try {
      const [imageUrl, stats] = await Promise.all([
        getImage(game.id),
        getGameStats(game.id.toString())
      ]);

      if (imageUrl && stats) {
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
    } catch {
      continue;
    }
  }

  return getTruelyRandomGame(retryCount + 1);
}

async function getPopularGame() {
  const response = await fetchWithCache(
    "https://games.roblox.com/v1/games/list?model.sortToken=PopularStandardized"
  );

  if (!response || response.statusCode !== 200) return null;

  const game = response.json.games[Math.floor(Math.random() * response.json.games.length)];
  
  try {
    const [imageUrl, stats] = await Promise.all([
      getImage(game.universeId),
      getGameStats(game.universeId.toString())
    ]);

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
  } catch {
    return null;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Set response timeout header
    res.setHeader('Cache-Control', 's-maxage=3600');
    
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
