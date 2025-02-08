import React from "react";
import { AppProps } from "next/app";

import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <title>Roblox Random Game Generator</title>
        <meta
          name="description"
          content="Discover and play random Roblox games with the Roblox Random Game Generator. Find new adventures with just one click!"
        />
        <meta
          name="keywords"
          content="Roblox, random Roblox game, game generator, play Roblox, Roblox games, randomizer"
        />
        <meta name="author" content="TheEmptynessProject & Veloii" />

        <meta property="og:title" content="Roblox Random Game Generator" />
        <meta
          property="og:description"
          content="Find and play random Roblox games instantly! Get surprised with new games every time."
        />
        <meta property="og:image" content="/og.png" />
        <meta property="og:url" content="https://random-roblox-game.vercel.app/" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Roblox Random Game Generator" />
        <meta
          name="twitter:description"
          content="Try out a new random Roblox game with just one click!"
        />
        <meta name="twitter:image" content="/og.png" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
