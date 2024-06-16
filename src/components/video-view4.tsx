import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getImage } from "@/lib/Appwrite";
import { Video } from "@/assets/types";

const VideoView4 = (vid: Video) => {
  const owner = vid.Channel;
  const localImage = getImage(vid.image);

  return (
    <a href={"/watch?v=" + vid.$id}>
      <Card className="w-full border-none h-fit">
        <CardContent className="flex flex-col w-full h-full p-0">
          <div className="h-full aspect-video">
            {!localImage ? (
              <Skeleton className="w-full rounded-lg aspect-video" />
            ) : (
              <img
                src={localImage?.toString() || ""}
                className="w-full rounded-lg aspect-video"
              />
            )}
          </div>
          <div className="flex flex-col w-full h-full">
            <p className="font-semibold text-md">{vid.title}</p>
            <a
              href={"/channel/" + owner?.$id}
              className="flex flex-row items-center justify-start w-full h-fit"
            >
              <p className="text-xs text-slate-400">{owner?.username}</p>
            </a>
            <p className="text-xs text-slate-400">{vid.views} Views</p>
          </div>
        </CardContent>
      </Card>
    </a>
  );
};

export default VideoView4;
