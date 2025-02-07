import { useEffect, useState } from "react";
import { Game } from "../types";
import {
  ArrowUpRightIcon,
  CheckIcon,
  ClipboardIcon,
  PlayIcon,
} from "@heroicons/react/20/solid";
import { PlusIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

export default function IndexPage() {
  const [game, setGame] = useState<Game | undefined>();
  const [cooldown, setCooldown] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
    const themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");

    if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      themeToggleLightIcon.classList.remove("opacity-0");
    } else {
      document.documentElement.classList.remove("dark");
      themeToggleDarkIcon.classList.remove("opacity-0");
    }

    const themeToggleBtn = document.getElementById("theme-toggle");
    themeToggleBtn.addEventListener("click", function () {
      themeToggleDarkIcon.classList.toggle("opacity-0");
      themeToggleLightIcon.classList.toggle("opacity-0");

      if (localStorage.getItem("color-theme")) {
        if (localStorage.getItem("color-theme") === "light") {
          document.documentElement.classList.add("dark");
          localStorage.setItem("color-theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("color-theme", "light");
        }
      } else {
        if (document.documentElement.classList.contains("dark")) {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("color-theme", "light");
        } else {
          document.documentElement.classList.add("dark");
          localStorage.setItem("color-theme", "dark");
        }
      }
    });
  }, []);

  const getRandomGame = async () => {
    setGame(undefined);
    const req = await fetch("/api/get-random");
    if (!req.ok) return;
    const reqJson = await req.json();
    setCooldown(true);
    setGame(reqJson);
    setTimeout(() => setCooldown(false), 500);
  };

  useEffect(() => {
    getRandomGame();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <div className="fixed top-0 right-0 p-4">
        <button
          id="theme-toggle"
          type="button"
          aria-label="Light / Dark Mode Toggle"
          className="text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 focus:outline-none rounded-full p-2 transition-colors duration-200"
        >
          <svg
            id="theme-toggle-dark-icon"
            className="w-6 h-6 transition-opacity absolute opacity-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
          </svg>
          <svg
            id="theme-toggle-light-icon"
            className="w-6 h-6 transition-opacity opacity-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>

      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col justify-center items-center">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-500 to-red-600 dark:from-red-400 dark:to-red-500 text-transparent bg-clip-text">
              Random Roblox Game
            </h1>
            <div className="flex items-center justify-center space-x-4 text-lg">
                made with 💖 by <a
                href="https://github.com/veloii"
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200"
                target="_blank"
              >Veloii</a> and <a
                href="https://github.com/TheEmptynessProject"
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                target="_blank"
              >TheEmptynessProject</a>
              <span className="text-slate-400">•</span>
              <a
                href="https://github.com/veloii/roblox-random-gen"
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                target="_blank"
              >
                open source
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden transition-colors duration-300">
            <div className="md:flex">
              {game ? (
                <div className="md:w-72 md:h-72 relative">
                  <Image
                    alt="Roblox Game Thumbnail"
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full"
                    src={game?.image}
                  />
                </div>
              ) : (
                <div className="md:w-72 md:h-72 animate-pulse bg-slate-200 dark:bg-slate-700" />
              )}

              <div className="p-6 md:p-8 flex-1">
                <div className="space-y-6">
                  {game ? (
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {game?.name}
                    </h2>
                  ) : (
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  )}

                  <div className="h-24 overflow-y-auto">
                    {game ? (
                      <p className="text-slate-600 dark:text-slate-300">
                        {game?.desc || "No description available"}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-1/2" />
                      </div>
                    )}
                  </div>

                  {game ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatCard icon="👥" label="Playing" value={game.playing.toLocaleString()} />
                      <StatCard icon="👀" label="Visits" value={game.visits.toLocaleString()} />
                      <StatCard icon="⭐" label="Favorites" value={game.favoritedCount?.toLocaleString() || 'N/A'} />
                      <StatCard icon="🎮" label="Max Players" value={game.maxPlayers} />
                      <StatCard icon="📅" label="Created" value={new Date(game.created).toLocaleDateString()} />
                      <StatCard icon="🔄" label="Updated" value={new Date(game.updated).toLocaleDateString()} />
                      <StatCard icon="🎨" label="Genre" value={game.genre_l2 || game.genre_l1 || game.genre} />
                      <StatCard icon="👤" label="Creator" value={`${game.creator.name} (${game.creator.type})`} />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                      ))}
                    </div>
                  )}

                  {game && (
                    <div className="flex flex-col md:flex-row gap-3">
                      <a
                        href={`roblox://placeId=${game.placeId}`}
                        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
                      >
                        <PlayIcon className="w-5 h-5" />
                        Play Now
                      </a>
                      <a
                        href={`https://www.roblox.com/games/${game.placeId}`}
                        target="_blank"
                        className="flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
                      >
                        <ArrowUpRightIcon className="w-5 h-5" />
                        View Details
                      </a>
                      <button
                        onClick={() => {
                          setCopied(true);
                          navigator.clipboard.writeText(`https://www.roblox.com/games/${game.placeId}`);
                          setTimeout(() => setCopied(false), 1000);
                        }}
                        className="flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
                      >
                        {copied ? (
                          <CheckIcon className="w-5 h-5" />
                        ) : (
                          <ClipboardIcon className="w-5 h-5" />
                        )}
                        {copied ? "Copied!" : "Copy Link"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={getRandomGame}
              disabled={cooldown}
              className="group relative flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-400 disabled:to-red-500 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {!game ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <PlusIcon className="w-5 h-5" />
              )}
              {!game ? "Loading..." : "New Game"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon, label, value }) => (
  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
    <div className="text-sm font-medium text-slate-600 dark:text-slate-300">{icon} {label}</div>
    <div className="text-slate-900 dark:text-white font-medium mt-1">{value}</div>
  </div>
);
