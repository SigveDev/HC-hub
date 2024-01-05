import { Skeleton } from "@/components/ui/skeleton";
import VideoView2 from "../video-view2";
import { Video } from "@/assets/types";

const History = ({ log }: any) => {
    const lodingAmount = [1, 2, 3];

    return (
        <>
            <div className="grid w-4/5 gap-2 mt-4">
                {log ? log[0].Videos.map((video: Video, index: number) => (
                    <VideoView2 {...video} key={index} />
                ))
                :
                lodingAmount.map((_, index) => {
                    return (
                        <div className="flex flex-row w-full aspect-[14/3] border-none" key={index}>
                            <div className="flex flex-row h-full p-0 aspect-video">
                                <Skeleton className="w-full h-full rounded-xl" />
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

export default History;