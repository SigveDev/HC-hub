import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  GalleryVerticalEnd,
  SquareUserRound,
  History,
  ThumbsUp,
} from "lucide-react";
import { getPFP } from "@/lib/Appwrite";

import { useTheme } from "@/components/theme-provider";

const SideMenu = ({ subscribedTo, channel }: any) => {
  const { theme } = useTheme();
  const [page, setPage] = useState<string>();
  const [minimizeMenu, setMinimizeMenu] = useState<boolean>(false);

  useEffect(() => {
    const url = window.location.pathname;
    const path = url.split("/")[1];
    const urlChannel = url.split("/")[2];
    setPage(path + "/" + (urlChannel !== undefined ? urlChannel : ""));
  }, [channel]);

  useEffect(() => {
    if (window.location.pathname.split("/").includes("watch")) {
      setMinimizeMenu(true);
    } else {
      setMinimizeMenu(false);
    }
  }, []);

  return (
    <>
      {!minimizeMenu && (
        <div className="flex flex-col w-full h-full gap-4 pt-1">
          <div className="flex flex-col items-center w-full gap-2 h-fit">
            <a
              href="/"
              className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg ${
                minimizeMenu ? "lg:w-fit" : "lg:w-full"
              } ${
                page === "/" &&
                (theme === "dark" ? "bg-slate-800" : "bg-slate-200")
              } ${
                theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"
              }`}
            >
              <Home />
              <span
                className={`${
                  minimizeMenu ? "lg:hidden" : "lg:block"
                } md:hidden sm:hidden`}
              >
                Frontpage
              </span>
            </a>
            <a
              href="/subscribed"
              className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg ${
                minimizeMenu ? "lg:w-fit" : "lg:w-full"
              } ${
                page === "subscribed/" &&
                (theme === "dark" ? "bg-slate-800" : "bg-slate-200")
              } ${
                theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"
              }`}
            >
              <GalleryVerticalEnd />
              <span
                className={`${
                  minimizeMenu ? "lg:hidden" : "lg:block"
                } md:hidden sm:hidden`}
              >
                Subscribed
              </span>
            </a>
            <a
              href="/liked"
              className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg ${
                minimizeMenu ? "lg:w-fit" : "lg:w-full"
              } ${
                page === "liked/" &&
                (theme === "dark" ? "bg-slate-800" : "bg-slate-200")
              } ${
                theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"
              }`}
            >
              <ThumbsUp />
              <span
                className={`${
                  minimizeMenu ? "lg:hidden" : "lg:block"
                } md:hidden sm:hidden`}
              >
                Liked
              </span>
            </a>
          </div>
          <Separator />
          <div className="flex flex-col items-center w-full gap-2 h-fit">
            <p
              className={`self-start pl-2 text-lg font-semibold ${
                minimizeMenu ? "lg:hidden" : "lg:block"
              } md:hidden sm:hidden`}
            >
              You
            </p>
            {channel !== undefined ? (
              <a
                href={"/channel/" + channel?.$id}
                className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg ${
                  minimizeMenu ? "lg:w-fit" : "lg:w-full"
                } ${
                  page === "channel/" + channel.$id &&
                  (theme === "dark" ? "bg-slate-800" : "bg-slate-200")
                } ${
                  theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"
                }`}
              >
                <SquareUserRound />
                <span
                  className={`${
                    minimizeMenu ? "lg:hidden" : "lg:block"
                  } md:hidden sm:hidden`}
                >
                  Your Channel
                </span>
              </a>
            ) : (
              <a
                href="/channel/create"
                className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg ${
                  minimizeMenu ? "lg:w-fit" : "lg:w-full"
                } ${
                  page === "channel/create" &&
                  (theme === "dark" ? "bg-slate-800" : "bg-slate-200")
                } ${
                  theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"
                }`}
              >
                <SquareUserRound />
                <span
                  className={`${
                    minimizeMenu ? "lg:hidden" : "lg:block"
                  } md:hidden sm:hidden`}
                >
                  Create Channel
                </span>
              </a>
            )}
            <a
              href="/history"
              className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg ${
                minimizeMenu ? "lg:w-fit" : "lg:w-full"
              } ${
                page === "history/" &&
                (theme === "dark" ? "bg-slate-800" : "bg-slate-200")
              } ${
                theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"
              }`}
            >
              <History />
              <span
                className={`${
                  minimizeMenu ? "lg:hidden" : "lg:block"
                } md:hidden sm:hidden`}
              >
                History
              </span>
            </a>
          </div>
          <Separator />
          <div className="flex flex-col items-center w-full gap-2 h-fit">
            <p
              className={`self-start pl-2 text-lg font-semibold ${
                minimizeMenu ? "lg:hidden" : "lg:block"
              } md:hidden sm:hidden`}
            >
              Subscribed To
            </p>
            {subscribedTo &&
              subscribedTo[0].Channels.map((channel: any, index: number) => {
                if (index > 5) return;
                const localImage: ImageData = getPFP(channel.pfp) as ImageData;
                return (
                  <a
                    href={"/channel/" + channel.$id}
                    className={`flex flex-row items-center justify-start h-10 gap-2 p-2 md:rounded-full lg:rounded-lg ${
                      minimizeMenu ? "lg:w-fit" : "lg:w-full"
                    } ${
                      page === "channel/" + channel.$id &&
                      (theme === "dark" ? "bg-slate-800" : "bg-slate-200")
                    } ${
                      theme === "dark"
                        ? "hover:bg-slate-800"
                        : "hover:bg-slate-200"
                    } md:w-fit md:bg-transparent`}
                    key={index}
                  >
                    {localImage && (
                      <img
                        src={localImage.toString()}
                        className="h-full rounded-full aspect-square"
                      />
                    )}
                    <span
                      className={`w-full h-full break-all ${
                        minimizeMenu ? "lg:hidden" : "lg:block"
                      } md:hidden sm:hidden`}
                    >
                      {channel.username}
                    </span>
                  </a>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
};

export default SideMenu;
