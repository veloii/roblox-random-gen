import type { NextApiRequest, NextApiResponse } from "next";
import { request } from "undici";
import { Game } from "../../types";
import cacheData from "memory-cache";

async function fetchWithCache(url) {
  const value = cacheData.get(url);
  if (value) {
    return value;
  } else {
    const hours = 24;
    const res = await request(url);
    const json = await res.body.json();
    cacheData.put(
      url,
      { statusCode: res.statusCode, json },
      hours * 1000 * 60 * 60
    );
    return { statusCode: res.statusCode, json };
  }
}

const rand = (items) => items[(items.length * Math.random()) | 0];

async function getSorts() {
  const { json, statusCode } = await fetchWithCache(
    "https://games.roblox.com/v1/games/sorts"
  );
  if (statusCode !== 200) return false;
  return json.sorts.map((sort) => sort.token);
}

async function getImage(universeId: string) {
  const { json, statusCode } = await fetchWithCache(
    `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=150x150&format=Png&isCircular=false`
  );
  if (statusCode !== 200) return false;
  return json.data[0].imageUrl;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
      if (statusCode !== 200) return console.log("soething has gone wrong");

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
}
