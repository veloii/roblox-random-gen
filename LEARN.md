# Generate a random roblox game from the front page

A completely standalone roblox random game generator. Most of the interesting parts are in the [API Call](https://github.com/zelrdev/roblox-random-gen/blob/main/pages/api/get-random.tsx). The index page when you go to the site is just some front end stuff with TailwindCSS.

## How does the API call work?
When a user presses the new game button it sends a request to `/api/get-random` and that in simple terms fetches the front page of roblox and searches through categories and picks a random game. It uses a memory-cache to keep the response time levels low by caching the requests and making it so it can fetch the roblox data from memory and then just choose one of the games.

### Check it out at [random-roblox-game.vercel.app](https://random-roblox-game.vercel.app)

On this preview site you'll see that if no api calls have been made for a short period the memory cache will be cleared but once it takes a while to fetch the first game the rest of the requests that are in that close time period should be fairly fast.
