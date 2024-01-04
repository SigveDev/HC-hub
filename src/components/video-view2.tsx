import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { badgeVariants } from "@/components/ui/badge"
import { getImage, getChannel, getPFP } from '@/lib/Appwrite';
import { Video, Channel } from '@/assets/types';

const VideoView2 = (vid: Video) => {
    const [owner, setOwner] = useState<Channel>(vid.Channel);
    const [channelPfp, setChannelPfp] = useState<ImageData>();
    const [category, setCategory] = useState<string>("");
    const localImage = getImage(vid.image);

    useEffect(() => {
        const getPfp = async () => {
            const pfp = await getPFP(owner?.pfp as string);
            setChannelPfp(pfp as ImageData);
        };

        getPfp();
    }, [owner]);

    useEffect(() => {
        if (vid.category === "movie") {
            setCategory("Movies");
        } else if (vid.category === "tv-show") {
            setCategory("TV Shows");
        } else if (vid.category === "game") {
            setCategory("Games");
        } else if (vid.category === "music") {
            setCategory("Music");
        } else {
            setCategory("Other");
        }
    }, []);

    return (
        <a href={"/watch?v=" + vid.$id}>
            <Card className="w-full aspect-[14/3] border-none">
                <CardContent className="flex flex-row w-full h-full p-0">
                    <div className='h-full aspect-video'>
                        {!localImage ? <Skeleton className="w-full rounded-lg aspect-video" /> : <img src={localImage?.toString() || ""} className="w-full rounded-lg aspect-video" />}
                    </div>
                    <div className="flex flex-col w-full h-full pl-4">
                        <p className="text-lg font-semibold">{vid.title}</p>
                        <p className='text-xs text-slate-400'>{vid.views} Views</p>
                        <a href={'/channel/' + owner?.$id} className="flex flex-row items-center justify-start w-full h-8 mt-4 mb-1">
                            <div className="w-8 h-8">
                                {!channelPfp ? <Skeleton className="w-full h-full rounded-full" /> : <img src={channelPfp?.toString() || ""} className="w-full h-full rounded-full" />}
                            </div>
                            <p className="ml-2 text-sm">{owner?.username}</p>
                        </a>
                        <p className="w-full h-4 mt-2 mb-2 overflow-hidden text-sm text-ellipsis">{vid.description}</p>
                        {vid.category !== "" && <a href={'/?cat=' + vid.category} className={badgeVariants({ variant: "default" }) + " w-fit mt-2"}>{category}</a>}
                    </div>
                </CardContent>
            </Card>
        </a>
    );
};

export default VideoView2;