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
  const [checked, setChecked] = useState(false);

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
      themeToggleLightIcon.classList.remove("opacity-0");
    } else {
      document.documentElement.classList.remove("dark");
      themeToggleDarkIcon.classList.remove("opacity-0");
    }

    const themeToggleBtn = document.getElementById("theme-toggle");

    themeToggleBtn.addEventListener("click", function () {
      // toggle icons inside button
      themeToggleDarkIcon.classList.toggle("opacity-0");
      themeToggleLightIcon.classList.toggle("opacity-0");

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

  const getRandomGame = async (checked: boolean) => {
    setGame(undefined);
    const req = await fetch(
      `/api/get-random?popular=${checked ? "yes" : "no"}`
    );
    if (!req.ok) return;
    const reqJson = await req.json();
    setCooldown(true);
    setGame(reqJson);
    setTimeout(() => setCooldown(false), 500);
  };

  useEffect(() => {
    getRandomGame(checked);
  }, []);

  return (
    <>
      <div className="md:absolute dark:bg-slate-900 transition top-0 right-0 px-5 pt-3 md:p-5">
        <button
          id="theme-toggle"
          type="button"
          aria-label="Light / Dark Mode Toggle"
          className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 active:opacity-50 dark:hover:bg-slate-700 focus:outline-none transition focus:ring-slate-200 dark:focus:ring-slate-700 rounded-lg text-sm p-2.5"
        >
          <svg
            id="theme-toggle-dark-icon"
            className="w-5 h-5 transition-opacity absolute ease-in-out opacity-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
          </svg>
          <svg
            id="theme-toggle-light-icon"
            className="w-5 h-5 transition-opacity ease-in-out opacity-0"
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
      <div className="min-h-screen pb-10 md:py-0 w-screen flex justify-center items-center dark:bg-slate-900 transition">
        <div className="space-y-7">
          <div>
            <h1 className="text-3xl pointer-events-none md:text-5xl text-center text-red-600 dark:text-white font-bold transition">
              Random Roblox Game
            </h1>
            <div className="flex gap-2 flex-row-reverse items-center justify-center">
              <p className="text-center dark:text-white text-xl pt-2 transition">
                edited with ❤️ by{" "}
                <a
                  href="https://github.com/TheEmptynessProject"
                  className="text-red-600 hover:text-red-900 transition font-semibold dark:text-red-400 dark:hover:text-red-500"
                  target="_blank"
                >
                  TheEmptynessProject
                </a>
              </p>
              <p className="text-center pointer-events-none dark:text-white text-xl pt-2 transition">
                -
              </p>
              <p className="text-center dark:text-white text-xl pt-2 transition">
                <a
                  href="https://github.com/TheEmptynessProject/roblox-random-gen"
                  className="text-red-600 hover:text-red-900 transition font-semibold dark:text-red-400 dark:hover:text-red-500"
                  target="_blank"
                >
                  open source
                </a>
              </p>
            </div>
          </div>
          <div className="flex px-5 md:px-0 justify-center items-center">
            <div className="bg-slate-50 w-full border px-1 md:px-0 pt-4 md:pt-0 dark:border-slate-700 dark:text-white dark:bg-slate-800 items-center md:items-start rounded-2xl flex flex-col md:flex-row gap-4 transition">
              {game ? (
                <Image
                  alt="Roblox Game Thumbnail"
                  draggable="false"
                  layout="fixed"
                  height={180}
                  width={180}
                  className="md:rounded-r-none rounded-2xl object-fill shadow dark:bg-slate-700 bg-slate-300"
                  src={game?.image}
                />
              ) : (
                <div className="animate-pulse h-[180px] w-[180px] md:rounded-r-none rounded-2xl dark:bg-slate-700 bg-slate-300"></div>
              )}
              <div className="space-y-2 p-4 px-2">
                <div className="pointer-events-none">
                  {game ? (
                    <h2
                      className={`font-bold md:text-xl w-[300px] md:w-[500px]`}
                    >
                      {game?.name}
                    </h2>
                  ) : (
                    <div className="animate-pulse w-[300px] md:w-[500px] h-7 dark:bg-slate-700 bg-slate-300 rounded"></div>
                  )}
                </div>
                <div className="pointer-events-none">
                  <p className="text-ellipsis md:w-[500px] w-full h-24 md:h-16 overflow-x-auto overflow-y-auto whitespace-pre-wrap text-sm">
                    {game ? (
                      game?.desc ? (
                        game?.desc
                      ) : (
                        "No description"
                      )
                    ) : (
                      <div className="space-y-1">
                        <div className="animate-pulse w-1/6 h-4 dark:bg-slate-700 bg-slate-300 rounded"></div>
                        <div className="animate-pulse w-full h-4 dark:bg-slate-700 bg-slate-300 rounded"></div>
                        <div className="animate-pulse w-5/6 h-4 dark:bg-slate-700 bg-slate-300 rounded"></div>
                      </div>
                    )}
                  </p>
                </div>
                <div className="pointer-events-none">
                  {game ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">
                        <div className="font-medium">👥 Playing</div>
                        <div>{game.stats.playing.toLocaleString()}</div>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">
                        <div className="font-medium">👀 Visits</div>
                        <div>{game.stats.visits.toLocaleString()}</div>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">
                        <div className="font-medium">⭐ Favorites</div>
                        <div>{game.stats.favoritedCount?.toLocaleString() || 'N/A'}</div>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">
                        <div className="font-medium">🎮 Max Players</div>
                        <div>{game.stats.maxPlayers}</div>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">
                        <div className="font-medium">📅 Created</div>
                        <div>{new Date(game.created).toLocaleDateString()}</div>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">
                        <div className="font-medium">🔄 Updated</div>
                        <div>{new Date(game.updated).toLocaleDateString()}</div>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">
                        <div className="font-medium">🎨 Genre</div>
                        <div>{game.genre_l2 || game.genre_l1 || game.genre}</div>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">
                        <div className="font-medium">👤 Creator</div>
                        <div>{game.creator.name} ({game.creator.type})</div>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-pulse grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-12 dark:bg-slate-700 bg-slate-300 rounded"></div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="gap-2 flex flex-col md:flex-row md:px-0 px-1">
                  {game ? (
                    <>
                      <a
                        draggable="false"
                        className="dark:bg-green-700 flex-grow md:flex-grow-0 justify-center active:opacity-50 bg-green-500 hover:bg-green-400 flex gap-2 items-center dark:hover:bg-green-500 font-semibold duration-300 transition p-2 px-6 rounded-xl text-white"
                        href={`roblox://placeId=${game.placeId}`}
                      >
                        <PlayIcon height={20} /> Play
                      </a>
                      <a
                        draggable="false"
                        target="_blank"
                        className="dark:bg-slate-700 flex-grow md:flex-grow-0 justify-center active:opacity-50 flex gap-2 items-center dark:hover:bg-slate-500 bg-slate-200 hover:bg-slate-300 font-semibold duration-300 transition p-2 px-4 rounded-xl dark:text-white"
                        href={`https://www.roblox.com/games/${game.placeId}`}
                      >
                        <ArrowUpRightIcon height={20} /> Open Link
                      </a>
                      <button
                        aria-label="Play"
                        draggable="false"
                        className="dark:bg-slate-700 flex-grow md:flex-grow-0 justify-center active:opacity-50 bg-slate-200 hover:bg-slate-300 cursor-pointer flex gap-2 items-center dark:hover:bg-slate-500 font-semibold duration-300 transition p-2 px-4 rounded-xl dark:text-white"
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
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="animate-pulse flex-grow md:flex-grow-0 md:w-28 h-10 dark:bg-slate-700 bg-slate-300 rounded-xl"></div>
                      <div className="animate-pulse flex-grow md:flex-grow-0 md:w-[8.5rem] h-10 dark:bg-slate-700 bg-slate-300 rounded-xl"></div>
                      <div className="animate-pulse flex-grow md:flex-grow-0 md:w-12 h-10 dark:bg-slate-700 bg-slate-300 rounded-xl"></div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 justify-center items-center">
            <div className="flex justify-center">
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  name="toggle"
                  onChange={(event) => {
                    setChecked(event.target.checked);
                    getRandomGame(event.target.checked);
                  }}
                  id="toggle"
                  checked={checked}
                  className="checked:bg-red-500 transition-all ease-in-out dark:checked:bg-red-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 absolute block w-6 h-6 rounded-full dark:bg-slate-900 bg-white border-4 dark:border-slate-700 appearance-none cursor-pointer"
                />
                <label
                  aria-label="Frontpage games only toggle"
                  htmlFor="toggle"
                  className="block h-6 overflow-hidden bg-slate-300 dark:bg-slate-800 rounded-full cursor-pointer"
                ></label>
              </div>
              <span
                aria-label="Frontpage games only toggle"
                className="font-medium text-slate-400 pointer-events-none"
              >
                Frontpage games only
              </span>
            </div>
            <button
              aria-label="New Game"
              disabled={cooldown}
              className={`dark:bg-red-900 relative group disabled:pointer-events-none disabled:opacity-50 mt-5 dark:hover:bg-red-700 bg-red-500 hover:bg-red-400 flex gap-2 items-center active:opacity-50 font-semibold duration-300 transition p-3 px-6 rounded-2xl text-white ${
                !game && "pointer-events-none"
              }`}
              onClick={() => getRandomGame(checked)}
            >
              <div
                role="status"
                className={`dark:bg-red-900 bg-red-500 group-disabled:dark:bg-opacity-50 transition-opacity ease-in-out duration-300 w-[117px] absolute top-3 ${
                  game ? "opacity-0" : "opacity-100"
                }`}
              >
                <svg
                  aria-hidden="true"
                  className=" h-6 w-[117px] animate-spin text-transparent fill-white"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
              <PlusIcon height={24} /> New Game
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
