import React from "react";
import { AppProps } from "next/app";

import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Roblox Random Game Generator</title>
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
