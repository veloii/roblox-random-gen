import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `</script><link rel='preload' href='https://rsms.me/inter/inter.css' as='style' onload="this.onload=null;this.rel='stylesheet'"/><script>`,
          }}
        />
        <link rel="preconnect" href="https://vitals.vercel-insights.com" />
        <meta
          name="description"
          content="Generate a random Roblox game in seconds."
        />

        <meta
          property="og:url"
          content="https://roblox-random-game-gen.vercel.app/"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Roblox Random Game Generator" />
        <meta
          property="og:description"
          content="Generate a random Roblox game in seconds."
        />
        <meta property="og:image" content="/og.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:domain"
          content="roblox-random-game-gen.vercel.app"
        />
        <meta
          property="twitter:url"
          content="https://roblox-random-game-gen.vercel.app/"
        />
        <meta name="twitter:title" content="Roblox Random Game Generator" />
        <meta
          name="twitter:description"
          content="Generate a random Roblox game in seconds."
        />
        <meta name="twitter:image" content="/og.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
