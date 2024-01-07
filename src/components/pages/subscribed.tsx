import { Skeleton } from "@/components/ui/skeleton";
import ChannelView2 from "../channel-view2";
import { Channel } from "@/assets/types";
import { getChannel } from "@/lib/Appwrite";
import { useEffect, useState } from "react";

const Subscribed = ({ subscribedTo }: any) => {
    const [channels, setChannels] = useState<Channel[]>([]);
    const lodingAmount = [1, 2, 3];

    useEffect(() => {
        const fetchChannels = async () => {
            if (subscribedTo) {
                const updatedChannels: Channel[] = [];
                for (const channel of subscribedTo[0].Channels) {
                    const localChannel: Channel = await getChannel(channel.$id) as Channel;
                    updatedChannels.push(localChannel);
                }
                setChannels(updatedChannels);
            }
        };

        fetchChannels();
    }, [subscribedTo]);

    return (
        <>
            <div className="grid max-w-[1000px] gap-2 mt-4">
                {(channels.length > 0 && channels[0].$id != "") ? channels.map((channel: Channel, index: number) => (
                    <ChannelView2 {...channel} key={index} />
                ))
                :
                lodingAmount.map((_, index) => {
                    return (
                        <div className="flex flex-row w-full aspect-[12/4] border-none" key={index}>
                            <div className="flex flex-row h-full p-0 aspect-square">
                                <Skeleton className="w-full rounded-full" />
                            </div>
                            <div className="flex flex-col w-full h-full gap-2 pl-4">
                                <Skeleton className="w-2/3 h-10 rounded-lg" />
                                <Skeleton className="w-1/4 h-8 rounded-lg" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default Subscribed;