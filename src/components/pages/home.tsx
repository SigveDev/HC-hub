import { useState, useEffect } from "react";
import { badgeVariants } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getVideosByCategory } from "@/lib/Appwrite";

import VideoView from "../video-view";

import { Video, VideoRequest } from "@/assets/types";

const Home = () => {
    const [videos, setVideos] = useState<Video[]>();
    const [activeCat, setActiveCat] = useState<string>(new URLSearchParams(window.location.search).get("cat")?.toString() || "");
    const lodingAmount = [1, 2, 3, 4, 5, 6];

    useEffect(() => {
        const getVideosAsync = async () => {
            const videos = await getVideosByCategory(activeCat);
            const videoRequest = videos as VideoRequest;
            setVideos(videoRequest.documents);
        };

        getVideosAsync();
    }, [activeCat]);

    return (
        <>
            <div className="flex flex-row h-8 gap-2 p-1">
                <a href="/" className={activeCat === "" ? badgeVariants({ variant: "default" }) : badgeVariants({ variant: "outline" })}>All</a>
                <a href="?cat=movie" className={activeCat === "movie" ? badgeVariants({ variant: "default" }) : badgeVariants({ variant: "outline" })}>Movies</a>
                <a href="?cat=tv-show" className={activeCat === "tv-show" ? badgeVariants({ variant: "default" }) : badgeVariants({ variant: "outline" })}>TV Shows</a>
                <a href="?cat=game" className={activeCat === "game" ? badgeVariants({ variant: "default" }) : badgeVariants({ variant: "outline" })}>Games</a>
                <a href="?cat=music" className={activeCat === "music" ? badgeVariants({ variant: "default" }) : badgeVariants({ variant: "outline" })}>Music</a>
            </div>
            <div className="grid gap-4 mt-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
                {videos != undefined ? videos.map((video, index) => {
                    return (
                        <VideoView {...video} key={index} />
                    );
                })
                :
                    lodingAmount.map((_, index) => {
                        return (
                            <div className="flex flex-col w-full aspect-[6/5] gap-2" key={index}>
                                <div className="w-full h-3/4">
                                    <Skeleton className="w-full h-full rounded-lg" />
                                </div>
                                <div className="flex flex-row w-full gap-2 h-1/4">
                                    <div className="w-1/4 h-full">
                                        <Skeleton className="h-full rounded-full aspect-square" />
                                    </div>
                                    <div className="flex flex-col w-3/4 h-full gap-2">
                                        <Skeleton className="w-full rounded-full h-3/5" />
                                        <Skeleton className="w-1/2 rounded-full h-2/5" />
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    );
};

export default Home;