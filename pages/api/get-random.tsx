import type { NextApiRequest, NextApiResponse } from "next";
import { performance } from "perf_hooks";
import { request } from "undici";
import { Game } from "../../types";
import cacheData from "memory-cache";

const MAX_ID_VALUE = 12000000000;
const MAX_TIME = 24 * 1000 * 60 * 60;

async function fetchWithCache(url) {
  const value = cacheData.get(url);
  if (value) {
    return value;
  } else {
    const res = await request(url);
    const json = await res.body.json();
    cacheData.put(
      url,
      { statusCode: res.statusCode, json },
      MAX_TIME
    );
    return { statusCode: res.statusCode, json };
  }
}

const rand = (items) => items[(items.length * Math.random()) | 0];

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function getSorts() {
  const { json, statusCode } = await fetchWithCache(
    "https://games.roblox.com/v1/games/sorts"
  );
  if (statusCode !== 200) return false;
  return json.sorts.map((sort) => sort.token);
}

async function getUniverseId(universeId: string) {
  const { body, statusCode } = await request(
    `https://games.roblox.com/v1/games?universeIds=${universeId}`
  );
  const json = await body.json();
  if (statusCode !== 200) {
    return false;
  }
  return json.data[0];
}

async function getImage(universeId: string) {
  const { json, statusCode } = await fetchWithCache(
    `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=150x150&format=Png&isCircular=false`
  );
  if (statusCode !== 200) return false;
  return json.data[0].imageUrl;
}

async function getPlayable(universeId: string) {
  const { body, statusCode } = await request(
    `https://games.roblox.com/v1/games/multiget-playability-status?universeIds=${universeId}`
  );
  if (statusCode !== 200) return false;
  const json = await body.json();
  return json[0].playabilityStatus === "GuestProhibited";
}

async function getTruelyRandomGame() {
  let successGame = undefined;

  const gamesList = [
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
    getUniverseId(randomIntFromInterval(1, MAX_ID_VALUE).toString()),
  ];

  const games = await Promise.all(gamesList);

  for (const game of games) {
    if (game) {
      if (!game.name.includes("Place")) {
        const playable = await getPlayable(game.id.toString());
        if (playable) {
          const imageUrl = await getImage(game.id);
          successGame = {
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
  if (!successGame) return getTruelyRandomGame();

  return successGame;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const popular = req.query["popular"] === "yes";

  if (popular) {
    const sorts = await getSorts();
    if (!sorts) return res.status(500);

    const categories = await Promise.all(
      sorts.map(async (sort) => {
        const params = new URLSearchParams({
          "model.sortToken": sort,
        }).toString();

        let { statusCode, json } = await fetchWithCache(
          `https://games.roblox.com/v1/games/list?${params}`
        );
        if (statusCode !== 200) return;

        const games = json.games.map((game) => ({
          name: game.name,
          creatorName: game.creatorName,
          price: game.price,
          desc: game.gameDescription,
          imageToken: game.imageToken,
          universeId: game.universeId,
          placeId: game.placeId,
          totalUpVotes: game.totalUpVotes,
          totalDownVotes: game.totalDownVotes,
        }));
        return games;
      })
    );
    const rawGame = rand(rand(categories));
    const imageUrl = await getImage(rawGame.universeId);
    const game: Game = { ...rawGame, image: imageUrl };

    return res.status(200).json(game);
  } else {
    const game = await getTruelyRandomGame();

    return res.status(200).json(game);
  }
}
