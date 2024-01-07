import { useState, useEffect } from 'react';
import { Separator } from "@/components/ui/separator";
import { Home, GalleryVerticalEnd, SquareUserRound, History, ThumbsUp } from 'lucide-react';
import { getPFP } from '@/lib/Appwrite';
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";

import { useTheme } from '@/components/theme-provider';

const SheetSideMenu = ({ subscribedTo, channel }: any) => {
    const { theme } = useTheme();
    const [page, setPage] = useState<string>();
    const [toggleMenu, setToggleMenu] = useState<boolean>(false);

    useEffect(() => {
        const url = window.location.pathname;
        const path = url.split('/')[1];
        const urlChannel = url.split('/')[2];
        setPage(path + "/" + (urlChannel !== undefined ? urlChannel : ""));
    }, [channel]);

    useEffect(() => {
        setInterval(() => {
            if (localStorage.getItem('menuOpen') === "true") {
                setToggleMenu(true);
            } else {
                setToggleMenu(false);
            }
        }, 100);
    }, []);

    const handleToggleMenu = () => {
        if (toggleMenu) {
            localStorage.setItem('menuOpen', "false");
        } else {
            localStorage.setItem('menuOpen', "true");
        }
    };

    return (
        <Sheet open={toggleMenu} onOpenChange={handleToggleMenu}>
            <SheetContent side="left" className='w-fit'>
                <SheetHeader className="flex flex-row items-center justify-between w-full h-16">
                    <h1 className="text-2xl font-semibold">HC Hub</h1>
                </SheetHeader>
                <div className="flex flex-col w-full h-full gap-4 pt-1">
                    <div className="flex flex-col w-full gap-2 h-fit">
                        <a onClick={handleToggleMenu} href="/" className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg lg:w-full ${page === "" && (theme === "dark" ? "bg-slate-800" : "bg-slate-200")} ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}><Home /><span className={`lg:block`}>Frontpage</span></a>
                        <a onClick={handleToggleMenu} href="/subscribed" className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg lg:w-full ${page === "subscribed" && (theme === "dark" ? "bg-slate-800" : "bg-slate-200")} ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}><GalleryVerticalEnd /><span className={`lg:block`}>Subscribed</span></a>
                        <a onClick={handleToggleMenu} href="/liked" className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg lg:w-full ${page === "liked" && (theme === "dark" ? "bg-slate-800" : "bg-slate-200")} ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}><ThumbsUp /><span className={`lg:block`}>Liked</span></a>
                    </div>
                    <Separator />
                    <div className="flex flex-col w-full gap-2 h-fit">
                        <p className={`self-start pl-2 text-lg font-semibold lg:block`}>You</p>
                        {channel !== undefined ? <a onClick={handleToggleMenu} href={"/channel/" + channel?.$id} className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg lg:w-full ${page === "channel" && (theme === "dark" ? "bg-slate-800" : "bg-slate-200")} ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}><SquareUserRound /><span className={`lg:block`}>Your Channel</span></a> : <a onClick={handleToggleMenu} href="/channel/create" className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg lg:w-full ${page === "channel" && (theme === "dark" ? "bg-slate-800" : "bg-slate-200")} ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}><SquareUserRound /><span className={`lg:block`}>Create Channel</span></a>}
                        <a onClick={handleToggleMenu} href="/history" className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg lg:w-full ${page === "history" && (theme === "dark" ? "bg-slate-800" : "bg-slate-200")} ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}><History /><span className={`lg:block`}>History</span></a>
                    </div>
                    <Separator />
                    <div className="flex flex-col w-full gap-2 h-fit">
                        <p className={`self-start pl-2 text-lg font-semibold lg:block`}>Subscribed To</p>
                        {subscribedTo && subscribedTo[0].Channels.map((channel: any, index: number) => {
                            if (index > 5) return;
                            const channelLink = page + "/" + channel.$id;
                            const localImage: ImageData = getPFP(channel.pfp) as ImageData;
                            return (
                                <a onClick={handleToggleMenu} href={"/channel/" + channel.$id} className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg w-full ${page === channelLink && (theme === "dark" ? "bg-slate-800" : "bg-slate-200")} ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"}`} key={index}>{localImage && <img src={localImage.toString()} className='h-full rounded-full aspect-square' />}<span className={`w-full h-full break-all lg:block`}>{channel.username}</span></a>
                            );
                        })}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default SheetSideMenu;