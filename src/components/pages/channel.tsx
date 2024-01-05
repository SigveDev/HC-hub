import { useEffect, useState } from "react";
import { getChannel, getPFP, subscribeToChannel, unsubscribeFromChannel } from "@/lib/Appwrite";
import { Channel } from "@/assets/types";
import { Button } from "@/components/ui/button";
import VideoView4 from "../video-view4";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const ChannelView = ({ user, subscribedTo }: any) => {
    const [myChannel, setMyChannel] = useState<boolean>(false);
    const [thisChannel, setThisChannel] = useState<Channel>();
    const [pfp, setPfp] = useState<ImageData>();
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
    const [initailSubscribed, setInitialSubscribed] = useState<boolean>(false);
    const lodingAmount = [1, 2, 3];

    useEffect(() => {
        const checkSubscribed = () => {
            if (subscribedTo !== undefined && !initailSubscribed && thisChannel) {
                subscribedTo[0].Channels.map((channel: any) => {
                    if (channel.$id === thisChannel.$id) {
                        setIsSubscribed(true);
                        setInitialSubscribed(true);
                    }
                });
            }
        }
        checkSubscribed();
    }, [subscribedTo, thisChannel]);

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
        const fetchChannel = async () => {
            const url = window.location.href.split('/');
            const id = url[url.length - 1];
            const channel: Channel = await getChannel(id) as Channel;
            setThisChannel(channel as Channel);

            if (channel) {
                const pfp = await getPFP(channel.pfp);
                setPfp(pfp as ImageData);
            }
        };

        fetchChannel();
    }, []);

    const subscribe = async () => {
        if (thisChannel && user) {
            setIsSubscribed(true);
            await subscribeToChannel(user.account.$id, thisChannel.$id);

            const url = window.location.href.split('/');
            const id = url[url.length - 1];
            const channel: Channel = await getChannel(id) as Channel;
            setThisChannel(channel as Channel);

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

            const url = window.location.href.split('/');
            const id = url[url.length - 1];
            const channel: Channel = await getChannel(id) as Channel;
            setThisChannel(channel as Channel);

            toast.success("Unsubscribed to " + thisChannel.username, {
                action: {
                  label: "Undo",
                  onClick: () => subscribe(),
                },
            });
        }
    }
    
    return (
        <>
            <div className="flex flex-row w-2/3 mt-12 mb-12 h-fit">
                <div className="flex flex-row p-0 h-fit w-fit aspect-square">
                    {(thisChannel && pfp) ? <img src={pfp.toString()} className="w-24 rounded-full aspect-square" /> : <Skeleton className="w-24 rounded-full aspect-square" />}
                </div>
                <div className="flex flex-col w-full h-full gap-2 pl-4">
                    {thisChannel ? <h1 className="text-2xl font-bold">{thisChannel && thisChannel.username}</h1> : <Skeleton className="w-2/3 h-10 rounded-lg" />}
                    {thisChannel ? <p className="text-sm">{thisChannel && thisChannel.Subscribers.length} Subscribers</p> : <Skeleton className="w-1/4 h-8 rounded-lg" />}
                </div>
                {thisChannel ? myChannel ? <Button className="h-10 pl-4 pr-4 mt-auto mb-auto text-sm rounded-full w-fit" variant="default" asChild><a href="/channel/edit">Edit</a></Button> : isSubscribed ? <Button className="h-10 pl-4 pr-4 mt-auto mb-auto text-sm rounded-full w-fit" variant="secondary" onClick={unSubscribe}>Subscribed</Button> : <Button className="h-10 pl-4 pr-4 mt-auto mb-auto text-sm rounded-full w-fit" onClick={subscribe}>Subscribe</Button> : <Skeleton className="w-1/4 h-8 rounded-lg" />}
            </div>
            <div className="grid w-4/5 gap-2 mt-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                {thisChannel ? thisChannel.Videos.map((video: any, index: number) => (
                    <VideoView4 {...video} key={index} />
                ))
                :
                lodingAmount.map((_, index) => {
                    return (
                        <div className="flex flex-col w-full gap-1 border-none aspect-square" key={index}>
                            <div className="flex flex-row w-full p-0 aspect-video">
                                <Skeleton className="w-full h-full rounded-xl" />
                            </div>
                            <div className="flex flex-col w-full gap-2 flex-grow-1">
                                <Skeleton className="w-2/3 h-6 rounded-lg" />
                                <Skeleton className="w-1/4 h-4 rounded-lg" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default ChannelView;