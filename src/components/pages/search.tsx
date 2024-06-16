import { useState, useEffect } from "react";
import { getVideosBySearch, getChannelsBySearch } from "@/lib/Appwrite";
import { badgeVariants } from "@/components/ui/badge";
import { Video, VideoRequest, Channel, ChannelRequest } from "@/assets/types";

import VideoView2 from "../video-view2";
import ChannelView2 from "../channel-view2";

const Search = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeType, setActiveType] = useState<String>("");
  const searchValue =
    new URLSearchParams(window.location.search).get("q") || "";

  useEffect(() => {
    const getVideosAsync = async () => {
      const videos = await getVideosBySearch(searchValue);
      const videoRequest = videos as VideoRequest;
      setVideos(videoRequest.documents);
    };
    const getChannelsAsync = async () => {
      const channels = await getChannelsBySearch(searchValue);
      const channelsRequest = channels as ChannelRequest;
      setChannels(channelsRequest.documents);
    };

    if (activeType === "") {
      getVideosAsync();
    } else if (activeType === "channel") {
      getChannelsAsync();
    }
  }, [activeType]);

  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get("type");
    if (type) {
      setActiveType(type);
    } else {
      setActiveType("");
    }
  }, []);

  return (
    <>
      <div className="grid max-w-[1000px] gap-2">
        <div className="flex flex-row w-full gap-2 mt-4 mb-4">
          <a
            href={"?q=" + searchValue}
            className={
              activeType === ""
                ? badgeVariants({ variant: "default" })
                : badgeVariants({ variant: "outline" })
            }
          >
            Videos
          </a>
          <a
            href={"?q=" + searchValue + "&type=channel"}
            className={
              activeType === "channel"
                ? badgeVariants({ variant: "default" })
                : badgeVariants({ variant: "outline" })
            }
          >
            Channels
          </a>
        </div>
        {activeType === ""
          ? videos &&
            videos.map((video, index) => {
              return <VideoView2 {...video} key={index} />;
            })
          : channels &&
            channels.map((channel, index) => {
              return <ChannelView2 {...channel} key={index} />;
            })}
      </div>
    </>
  );
};

export default Search;
