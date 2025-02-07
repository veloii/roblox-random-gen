import { useEffect, useState } from "react";
import { Game } from "../types";
import { ArrowUpRightIcon, ClipboardIcon, PlayIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

export default function IndexPage() {
  const [game, setGame] = useState<Game | undefined>();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/get-random")
      .then((res) => res.json())
      .then((data) => setGame(data));
  }, []);

  const copyToClipboard = () => {
    if (game) {
      navigator.clipboard.writeText(`https://www.roblox.com/games/${game.placeId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Random Roblox Game</h1>
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden p-5">
        {game ? (
          <>
            <Image
              alt="Roblox Game Thumbnail"
              src={game.image}
              width={500}
              height={250}
              className="rounded-md mb-4 w-full object-cover"
            />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{game.name}</h2>
            <p className="text-gray-700 dark:text-gray-300 mt-2 h-20 overflow-auto">{game.desc || "No description available."}</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md">
                👥 {game.playing.toLocaleString()} Playing
              </div>
              <div className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md">
                👀 {game.visits.toLocaleString()} Visits
              </div>
            </div>
            <div className="mt-5 flex gap-4">
              <a
                href={`https://www.roblox.com/games/${game.placeId}`}
                target="_blank"
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                <PlayIcon className="w-5 h-5" /> Play Now
              </a>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
              >
                <ClipboardIcon className="w-5 h-5" /> {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </>
        ) : (
          <div className="animate-pulse space-y-4">
            <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 w-3/4 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 w-1/2 rounded"></div>
          </div>
        )}
      </div>
    </div>
  );
}
