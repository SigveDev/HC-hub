import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getImage, getChannel, getPFP } from '@/lib/Appwrite';
import { Video, Channel } from '@/assets/types';

const VideoView = (vid: Video) => {
    const [owner, setOwner] = useState<Channel>(vid.Channel);
    const [channelPfp, setChannelPfp] = useState<ImageData>();
    const localImage = getImage(vid.image);

    useEffect(() => {
        const getPfp = async () => {
            const pfp = await getPFP(owner?.pfp as string);
            setChannelPfp(pfp as ImageData);
        };

        getPfp();
    }, [owner]);

    return (
        <a href={"/watch?v=" + vid.$id}>
            <Card className="w-full aspect-[6/5] border-none">
                <CardContent className="flex flex-col w-full h-full p-0">
                    <div className='h-full aspect-video'>
                        {!localImage ? <Skeleton className="w-full rounded-lg aspect-video" /> : <img src={localImage?.toString() || ""} className="w-full rounded-lg aspect-video" />}
                    </div>
                    <div className="flex flex-row w-full h-full gap-4">
                        <a href={'/channel/' + owner?.$id} className="flex justify-center w-8 h-full col-span-1 mt-4 mb-1">
                            <div className="w-8 h-8">
                                {!channelPfp ? <Skeleton className="w-full h-full rounded-full" /> : <img src={channelPfp?.toString() || ""} className="w-full h-full rounded-full" />}
                            </div>
                        </a>
                        <div className="flex flex-col w-full h-full">
                            {vid ? <p className="w-full overflow-hidden font-semibold text-ellipsis max-h-14 text-md" title={vid.title}>{vid.title}</p> : <Skeleton className="w-1/2 h-1/3" />}
                            {owner ? <a href={'/channel/' + owner?.$id} className="text-xs text-slate-400 hover:text-inherit">{owner.username}</a> : <Skeleton className="w-1/2 h-1/3" />}
                            {vid ? <p className='text-xs text-slate-400'>{vid.views} Views</p> : <Skeleton className="w-1/4 h-1/3" />}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </a>
    );
};

export default VideoView;