import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getPFP } from "@/lib/Appwrite";
import { Channel } from "@/assets/types";

const ChannelView2 = (chan: Channel) => {
  const [channelPfp, setChannelPfp] = useState<ImageData>();

  useEffect(() => {
    const getPfp = async () => {
      const pfp = await getPFP(chan?.pfp as string);
      setChannelPfp(pfp as ImageData);
    };

    getPfp();
  }, [chan]);

  return (
    <a href={"/channel/" + chan.$id}>
      <Card className="w-full aspect-[12/4] border-none">
        <CardContent className="flex flex-row w-full h-full p-0">
          <div className="flex items-center justify-center h-full aspect-square">
            {!channelPfp ? (
              <Skeleton className="h-full rounded-full aspect-square" />
            ) : (
              <img
                src={channelPfp?.toString() || ""}
                className="h-full rounded-full aspect-square"
              />
            )}
          </div>
          <div className="flex flex-col w-full h-full pl-4">
            <p className="text-2xl font-semibold">{chan.username}</p>
            <p className="text-xs text-slate-400">
              {chan.Subscribers.length} Subscribers
            </p>
          </div>
        </CardContent>
      </Card>
    </a>
  );
};

export default ChannelView2;
