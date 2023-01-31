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
  const [cooldown, setCooldown] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const themeToggleDarkIcon = document.getElementById(
      "theme-toggle-dark-icon"
    );
    const themeToggleLightIcon = document.getElementById(
      "theme-toggle-light-icon"
    );

    // Change the icons inside the button based on previous settings
    if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      themeToggleLightIcon.classList.remove("hidden");
    } else {
      document.documentElement.classList.remove("dark");
      themeToggleDarkIcon.classList.remove("hidden");
    }

    const themeToggleBtn = document.getElementById("theme-toggle");

    themeToggleBtn.addEventListener("click", function () {
      // toggle icons inside button
      themeToggleDarkIcon.classList.toggle("hidden");
      themeToggleLightIcon.classList.toggle("hidden");

      // if set via local storage previously
      if (localStorage.getItem("color-theme")) {
        if (localStorage.getItem("color-theme") === "light") {
          document.documentElement.classList.add("dark");
          localStorage.setItem("color-theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("color-theme", "light");
        }

        // if NOT set via local storage previously
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
    setCooldown(true);
    setGame(undefined);
    const req = await fetch("/api/get-random");
    if (!req.ok) return;
    const reqJson = await req.json();
    setGame(reqJson);
    setTimeout(() => setCooldown(false), 500);
  };

  useEffect(() => {
    getRandomGame();
  }, []);

  return (
    <>
      <div className="absolute top-0 right-0 p-5">
        <button
          id="theme-toggle"
          type="button"
          className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
        >
          <svg
            id="theme-toggle-dark-icon"
            className="w-5 h-5 hidden"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
          </svg>
          <svg
            id="theme-toggle-light-icon"
            className="w-5 h-5 hidden"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
      <div className="h-screen w-screen flex justify-center items-center dark:bg-slate-900 transition">
        <div className="space-y-7">
          <div>
            <h1 className="text-3xl md:text-5xl text-center text-blue-900 dark:text-white font-bold transition">
              Random Roblox Game
            </h1>
            <p className="text-center dark:text-white text-xl pt-2 transition">
              made with ❤️ by{" "}
              <a
                href="https://portfolio-zelr.vercel.app/"
                className="text-red-600 hover:text-red-900 transition font-semibold dark:text-red-400 dark:hover:text-red-500"
                target="_blank"
              >
                zelr
              </a>
            </p>
          </div>
          <div className="flex justify-center items-center w-full">
            <div className="bg-slate-50 dark:text-white dark:bg-slate-800 rounded-md p-5 flex flex-col md:flex-row gap-4 transition">
              {game ? (
                <img
                  className="rounded-md w-[150px] h-[150px] shadow"
                  src={game?.image}
                />
              ) : (
                <div className="animate-pulse w-[150px] h-[150px] dark:bg-gray-700 bg-gray-300 rounded"></div>
              )}
              <div className="space-y-2">
                <div>
                  {game ? (
                    <h2 className="md:text-xl font-bold">{game?.name}</h2>
                  ) : (
                    <div className="animate-pulse w-1/2 h-7 dark:bg-gray-700 bg-gray-300 rounded"></div>
                  )}
                </div>
                <div>
                  <p className="text-ellipsis md:w-[500px] h-24 md:h-16 overflow-y-auto whitespace-pre-wrap text-sm">
                    {game ? (
                      game?.desc
                    ) : (
                      <div className="space-y-1">
                        <div className="animate-pulse w-1/6 h-4 dark:bg-gray-700 bg-gray-300 rounded"></div>
                        <div className="animate-pulse w-full h-4 dark:bg-gray-700 bg-gray-300 rounded"></div>
                        <div className="animate-pulse w-5/6 h-4 dark:bg-gray-700 bg-gray-300 rounded"></div>
                      </div>
                    )}
                  </p>
                </div>
                <div className="space-x-2 flex">
                  {game ? (
                    <>
                      <a
                        target="_blank"
                        className="bg-green-700 flex gap-2 items-center hover:bg-green-500 font-semibold duration-300 transition p-2 px-6 rounded-lg text-white"
                        href={`roblox://placeId=${game.placeId}`}
                      >
                        <PlayIcon height={20} /> Play
                      </a>
                      <a
                        target="_blank"
                        className="bg-gray-700 flex gap-2 items-center hover:bg-gray-500 font-semibold duration-300 transition p-2 px-4 rounded-lg text-white"
                        href={`https://www.roblox.com/games/${game.placeId}`}
                      >
                        <ArrowUpRightIcon height={20} /> Open Link
                      </a>
                      <a
                        className="bg-gray-700 cursor-pointer flex gap-2 items-center hover:bg-gray-500 font-semibold duration-300 transition p-2 px-4 rounded-lg text-white"
                        onClick={() => {
                          setCopied(true);
                          navigator.clipboard.writeText(
                            `https://www.roblox.com/games/${game.placeId}`
                          );
                          setTimeout(() => setCopied(false), 1000);
                        }}
                      >
                        <CheckIcon
                          className={`absolute ${
                            copied ? "opacity-100" : "opacity-0"
                          } transition`}
                          height={20}
                        />
                        <ClipboardIcon
                          className={`${
                            copied ? "opacity-0" : "opacity-100"
                          } transition`}
                          height={20}
                        />
                      </a>
                    </>
                  ) : (
                    <>
                      <div className="animate-pulse w-28 h-10 dark:bg-gray-700 bg-gray-300 rounded-lg"></div>
                      <div className="animate-pulse w-32 h-10 dark:bg-gray-700 bg-gray-300 rounded-lg"></div>
                      <div className="animate-pulse w-14 h-10 dark:bg-gray-700 bg-gray-300 rounded-lg"></div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <button
              disabled={cooldown}
              className="bg-red-900 hover:bg-red-700 flex gap-2 items-center disabled:opacity-50 active:scale-95 font-semibold duration-300 transition p-3 px-6 rounded-lg text-white"
              onClick={() => getRandomGame()}
            >
              <PlusIcon height={24} /> New Game
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
