import { useState, useEffect } from 'react';
import { getVideoDataById, getVideo, getPFP, getVideosByCategory, subscribeToChannel, unsubscribeFromChannel, likeVideo, unlikeVideo, giveVideoView, addToLog } from '@/lib/Appwrite';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from "@/components/ui/button";
import { Video, VideoRequest } from '@/assets/types';
import { useTheme } from '@/components/theme-provider';
import { ThumbsUp, Forward } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import VideoPlayer from '../video-player';
import VideoView3 from '../video-view3';

const Watch = ({ user, subscribedTo, likedTo }: any) => {
    const { theme } = useTheme();
    const [videoData, setVideoData] = useState<Video>();
    const [video, setVideo] = useState<any>();
    const [thisChannel, setThisChannel] = useState<any>(null);
    const [channelPfp, setChannelPfp] = useState<ImageData>();
    const [relatedVideos, setRelatedVideos] = useState<Video[]>();
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
    const [initailSubscribed, setInitialSubscribed] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [initailLiked, setInitialLiked] = useState<boolean>(false);
    const [viewGiven, setViewGiven] = useState<boolean>(false);
    const [myChannel, setMyChannel] = useState<boolean>(false);

    useEffect(() => {
        if (localStorage.getItem('menuOpen') === "true") {
            localStorage.setItem('menuOpen', "false");
        }
    }, []);

    useEffect(() => {
        const checkSubscribed = () => {
            if (subscribedTo !== undefined && videoData && !initailSubscribed) {
                subscribedTo[0].Channels.map((channel: any) => {
                    if (channel.$id === videoData.Channel.$id) {
                        setIsSubscribed(true);
                        setInitialSubscribed(true);
                    }
                });
            }
        }
        checkSubscribed();
    }, [subscribedTo, videoData]);

    useEffect(() => {
        const checkMyChannel = () => {
            if (user && thisChannel) {
                if (user.account.$id === thisChannel.user) {
                    setMyChannel(true);
                }
            }
        };
        checkMyChannel();
    }, [user, thisChannel]);

    useEffect(() => {
        const checkLiked = () => {
            if (likedTo !== undefined && videoData && !initailLiked) {
                likedTo[0].Videos.map((video: any) => {
                    if (video.$id === videoData.$id) {
                        setIsLiked(true);
                        setInitialLiked(true);
                    }
                });
            }
        }
        checkLiked();
    }, [likedTo, videoData]);

    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get("v");
        const getVideoAsync = async () => {
            const videoRaw: any = await getVideoDataById(id as string);
            setVideoData(videoRaw);
            const video = await getVideo(videoRaw.video);
            setVideo(video);

            const channel = videoRaw.Channel;
            setThisChannel(channel);

            const pfp = await getPFP(channel.pfp);
            setChannelPfp(pfp as ImageData);
        }
        getVideoAsync();
    }, []);

    useEffect(() => {
        if (videoData) {
            const getRelatedVideos = async () => {
                const videos = await getVideosByCategory(videoData.category);
                const videoRequest = videos as VideoRequest;
                setRelatedVideos(videoRequest.documents);
            }
            getRelatedVideos();
        }
    }, [videoData]);

    const formatDate = (date: string) => {
        const createdAt = new Date(date);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - createdAt.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 7) {
            return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
        } else if (diffDays < 35) {
            const diffWeeks = Math.floor(diffDays / 7);
            return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
        } else if (diffDays < 365) {
            const diffMonths = Math.floor(diffDays / 30);
            return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
        } else {
            const diffYears = Math.floor(diffDays / 365);
            return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
        }
    }

    const handleShare = () => {
        if (videoData) {
            if (navigator.share) {
                navigator.share({
                    title: videoData.title,
                    text: videoData.description,
                    url: window.location.href
                }).then(() => {
                    console.log('Thanks for sharing!');
                })
                .catch(console.error);
            } else {
                navigator.clipboard.writeText(window.location.href);
            }
        }
    }

    const subscribe = async () => {
        if (thisChannel && user) {
            setIsSubscribed(true);
            await subscribeToChannel(user.account.$id, thisChannel.$id);

            const id = new URLSearchParams(window.location.search).get("v");

            const videoRaw: any = await getVideoDataById(id as string);
            setVideoData(videoRaw);

            toast.success("Subscribed to " + thisChannel.username, {
                action: {
                  label: "Undo",
                  onClick: () => unSubscribe(),
                },
            });
        }
    }

    const unSubscribe = async () => {
        if (thisChannel && user) {
            setIsSubscribed(false);
            await unsubscribeFromChannel(user.account.$id, thisChannel.$id);

            const id = new URLSearchParams(window.location.search).get("v");

            const videoRaw: any = await getVideoDataById(id as string);
            setVideoData(videoRaw);

            toast.success("Unsubscribed to " + thisChannel.username, {
                action: {
                  label: "Undo",
                  onClick: () => subscribe(),
                },
            });
        }
    }

    const like = async () => {
        if (videoData && user) {
            setIsLiked(true);
            await likeVideo(user.account.$id, videoData.$id);

            const id = new URLSearchParams(window.location.search).get("v");

            const videoRaw: any = await getVideoDataById(id as string);
            setVideoData(videoRaw);

            toast.success("Liked the video", {
                action: {
                  label: "Undo",
                  onClick: () => unLike(),
                },
            });
        }
    }

    const unLike = async () => {
        if (videoData && user) {
            setIsLiked(false);
            await unlikeVideo(user.account.$id, videoData.$id);

            const id = new URLSearchParams(window.location.search).get("v");

            const videoRaw: any = await getVideoDataById(id as string);
            setVideoData(videoRaw);

            toast.success("Unliked the video", {
                action: {
                  label: "Undo",
                  onClick: () => like(),
                },
            });
        }
    }

    useEffect(() => {
        const video = document.getElementById('video') as HTMLVideoElement;
        let viewInterval: NodeJS.Timeout | null = null;

        if (videoData && video) {
            viewInterval = setInterval(() => {
                if (!viewGiven) {
                    if (video.currentTime > (video.duration * 0.6)) {
                        setViewGiven(true);
                        giveVideoView(videoData.$id);
                        addToLog(user?.account.$id, videoData.$id);
                    }
                } else {
                    if (viewInterval) {
                        clearInterval(viewInterval);
                    }
                }
            }, 5000);
        }

        return () => {
            if (viewInterval) {
                clearInterval(viewInterval);
            }
        };
    }, [videoData, viewGiven]);

    return (
        <>
            <div className="flex flex-col items-center justify-center w-full mb-4 h-fit">
                <div className="grid w-full grid-cols-3 h-fit max-w-[1500px] mt-6 gap-4">
                    <div className="w-full col-span-2 h-fit">
                        <div className="w-full aspect-video">
                            {!video ? <Skeleton className="w-full h-full rounded-xl" /> : <VideoPlayer video={video} />}
                        </div>
                        <div className="flex flex-col w-full h-full mt-4">
                            {videoData ? <p className="text-lg font-semibold">{videoData.title}</p> : <Skeleton className="w-2/3 h-8" />}
                            <div className="flex flex-row items-center justify-start w-full h-12 mt-4 mb-1">
                                <a href={'/channel/' + thisChannel?.$id} className="w-12 h-12">
                                    {!channelPfp ? <Skeleton className="w-full h-full rounded-full" /> : <img src={channelPfp?.toString() || ""} className="w-full h-full rounded-full" />}
                                </a>
                                <div className="flex flex-col h-full pl-2 pr-6 w-fit">
                                    <a href={'/channel/' + thisChannel?.$id} className="mt-0 ml-2 text-md">{thisChannel?.username}</a>
                                    <p className="ml-2 text-sm text-slate-400">{videoData?.Channel.Subscribers.length} Subscribers</p>
                                </div>
                                {thisChannel ? myChannel ? <Button className="h-10 pl-4 pr-4 mt-auto mb-auto text-sm rounded-full w-fit" variant="default" asChild><a href="/channel/edit">Edit</a></Button> : isSubscribed ? <Button className="h-10 pl-4 pr-4 mt-auto mb-auto text-sm rounded-full w-fit" variant="secondary" onClick={unSubscribe}>Subscribed</Button> : <Button className="h-10 pl-4 pr-4 mt-auto mb-auto text-sm rounded-full w-fit" onClick={subscribe}>Subscribe</Button> : <Skeleton className="w-1/4 h-8 rounded-lg" />}
                                <div className='flex flex-row gap-2 ml-auto'>
                                    {!isLiked ? <Button className="h-10 gap-2 pl-4 pr-4 text-sm rounded-full w-fit" variant="secondary" onClick={like}><ThumbsUp size={20} color={theme === "dark" ? "#ffffff" : "#000000"} strokeWidth={2} />{videoData?.Likes.length}</Button> : <Button className="h-10 gap-2 pl-4 pr-4 text-sm rounded-full w-fit" variant="default" onClick={unLike}><ThumbsUp size={20} color={theme === "light" ? "#ffffff" : "#000000"} strokeWidth={2} />{videoData?.Likes.length}</Button>}
                                    <Button className="h-10 gap-2 pl-4 pr-4 text-sm rounded-full w-fit" variant="secondary" onClick={handleShare}><Forward size={20} strokeWidth={2} />share</Button>
                                </div>
                            </div>
                        </div>
                        {videoData ?
                        <div className={`flex flex-col w-full p-2 mt-4 h-fit rounded-xl ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`}>
                            <div className='flex flex-row w-full gap-2 h-fit'>
                                <div className='text-sm font-semibold'>{videoData.views} Views</div>
                                <div className='text-sm font-semibold'>{formatDate(videoData.$createdAt)}</div>
                            </div>
                            <div className='w-full text-sm text-pretty h-fit'>{videoData.description}</div>
                        </div>
                        :
                        <Skeleton className='flex w-full h-32 mt-4 rounded-xl' />
                        }
                    </div>
                    <div className='flex flex-col w-full col-span-1 h-fit'>
                        <ScrollArea className="flex flex-row w-full h-fit">
                            <Badge variant="default">Related Videos</Badge>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                        <div className="flex flex-col w-full mt-2 h-fit">
                            {relatedVideos && relatedVideos.map((video, index) => {
                                if (video.$id === videoData?.$id || index > 8) {
                                    return null;
                                }
                                return (
                                    <VideoView3 {...video} key={index} />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Watch;