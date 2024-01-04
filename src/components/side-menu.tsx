import { useState, useEffect } from 'react';
import { Separator } from "@/components/ui/separator";
import { Home, GalleryVerticalEnd, SquareUserRound, History, ThumbsUp } from 'lucide-react';
import { getPFP } from '@/lib/Appwrite';
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";

import { useTheme } from '@/components/theme-provider';

const SideMenu = ({ user, subscribedTo, likedTo, log, channel }: any) => {
    const { theme } = useTheme();
    const [page, setPage] = useState<string>();
    const [minimizeMenu, setMinimizeMenu] = useState<boolean>(false);
    const [toggleMenu, setToggleMenu] = useState<boolean>(false);

    useEffect(() => {
        const url = window.location.pathname;
        const path = url.split('/')[1];
        setPage(path + "/" + (channel !== undefined ? channel.$id : ""));
    }, []);

    useEffect(() => {
      if (window.location.pathname.split('/').includes("watch")) {
        setMinimizeMenu(true);
      } else {
        setMinimizeMenu(false);
      }
    }, []);

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
        <>
            {!minimizeMenu ? <div className="flex flex-col w-full h-full gap-4 pt-1">
                <div className="flex flex-col items-center w-full gap-2 h-fit">
                    <a href="/" className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg ${minimizeMenu ? "lg:w-fit" : "lg:w-full"} ${page === "" && (theme === "dark" ? "bg-slate-800" : "bg-slate-200")} ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}><Home /><span className={`${minimizeMenu ? "lg:hidden" : "lg:block"} md:hidden sm:hidden`}>Frontpage</span></a>
                    <a href="/subscribed" className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg ${minimizeMenu ? "lg:w-fit" : "lg:w-full"} ${page === "subscribed" && (theme === "dark" ? "bg-slate-800" : "bg-slate-200")} ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}><GalleryVerticalEnd /><span className={`${minimizeMenu ? "lg:hidden" : "lg:block"} md:hidden sm:hidden`}>Subscribed</span></a>
                    <a href="/liked" className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg ${minimizeMenu ? "lg:w-fit" : "lg:w-full"} ${page === "liked" && (theme === "dark" ? "bg-slate-800" : "bg-slate-200")} ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}><ThumbsUp /><span className={`${minimizeMenu ? "lg:hidden" : "lg:block"} md:hidden sm:hidden`}>Liked</span></a>
                </div>
                <Separator />
                <div className="flex flex-col items-center w-full gap-2 h-fit">
                    <p className={`self-start pl-2 text-lg font-semibold ${minimizeMenu ? "lg:hidden" : "lg:block"} md:hidden sm:hidden`}>You</p>
                    {channel !== undefined ? <a href={"/channel/" + channel?.$id} className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg ${minimizeMenu ? "lg:w-fit" : "lg:w-full"} ${page === "channel" && (theme === "dark" ? "bg-slate-800" : "bg-slate-200")} ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}><SquareUserRound /><span className={`${minimizeMenu ? "lg:hidden" : "lg:block"} md:hidden sm:hidden`}>Your Channel</span></a> : <a href="/channel/create" className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg ${minimizeMenu ? "lg:w-fit" : "lg:w-full"} ${page === "channel" && (theme === "dark" ? "bg-slate-800" : "bg-slate-200")} ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}><SquareUserRound /><span className={`${minimizeMenu ? "lg:hidden" : "lg:block"} md:hidden sm:hidden`}>Create Channel</span></a>}
                    <a href="/history" className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg ${minimizeMenu ? "lg:w-fit" : "lg:w-full"} ${page === "history" && (theme === "dark" ? "bg-slate-800" : "bg-slate-200")} ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}><History /><span className={`${minimizeMenu ? "lg:hidden" : "lg:block"} md:hidden sm:hidden`}>History</span></a>
                </div>
                <Separator />
                <div className="flex flex-col items-center w-full gap-2 h-fit">
                    <p className={`self-start pl-2 text-lg font-semibold ${minimizeMenu ? "lg:hidden" : "lg:block"} md:hidden sm:hidden`}>Subscribed To</p>
                    {subscribedTo && subscribedTo[0].Channels.map((channel: any, index: number) => {
                        if (index > 5) return;
                        const channelLink = page + "/" + channel.$id;
                        const localImage = getPFP(channel.pfp);
                        return (
                            <a href={"/channel/" + channel.$id} className={`flex flex-row items-center justify-start h-10 gap-2 p-2 md:rounded-full lg:rounded-lg ${minimizeMenu ? "lg:w-fit" : "lg:w-full"} ${page === channelLink && (theme === "dark" ? "bg-slate-800" : "bg-slate-200")} ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"} md:w-fit md:bg-transparent`} key={index}>{localImage && <img src={localImage} className='h-full rounded-full aspect-square' />}<span className={`w-full h-full break-all ${minimizeMenu ? "lg:hidden" : "lg:block"} md:hidden sm:hidden`}>{channel.username}</span></a>
                        );
                    })}
                </div>
            </div>
            :
            <Sheet open={toggleMenu} onOpenChange={handleToggleMenu}>
                <SheetContent side="left" className='w-fit'>
                    <SheetHeader className="flex flex-row items-center justify-between w-full h-16">
                        <h1 className="text-2xl font-semibold">HC Hub</h1>
                    </SheetHeader>
                    <div className="flex flex-col w-full h-full gap-4 pt-1">
                        <div className="flex flex-col w-full gap-2 h-fit">
                            <a href="/" className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg lg:w-full ${page === "" && (theme === "dark" ? "bg-slate-800" : "bg-slate-200")} ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}><Home /><span className={`lg:block`}>Frontpage</span></a>
                            <a href="/subscribed" className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg lg:w-full ${page === "subscribed" && (theme === "dark" ? "bg-slate-800" : "bg-slate-200")} ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}><GalleryVerticalEnd /><span className={`lg:block`}>Subscribed</span></a>
                            <a href="/liked" className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg lg:w-full ${page === "liked" && (theme === "dark" ? "bg-slate-800" : "bg-slate-200")} ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}><ThumbsUp /><span className={`lg:block`}>Liked</span></a>
                        </div>
                        <Separator />
                        <div className="flex flex-col w-full gap-2 h-fit">
                            <p className={`self-start pl-2 text-lg font-semibold lg:block`}>You</p>
                            {channel !== undefined ? <a href={"/channel/" + channel?.$id} className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg lg:w-full ${page === "channel" && (theme === "dark" ? "bg-slate-800" : "bg-slate-200")} ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}><SquareUserRound /><span className={`lg:block`}>Your Channel</span></a> : <a href="/channel/create" className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg lg:w-full ${page === "channel" && (theme === "dark" ? "bg-slate-800" : "bg-slate-200")} ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}><SquareUserRound /><span className={`lg:block`}>Create Channel</span></a>}
                            <a href="/history" className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg lg:w-full ${page === "history" && (theme === "dark" ? "bg-slate-800" : "bg-slate-200")} ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}><History /><span className={`lg:block`}>History</span></a>
                        </div>
                        <Separator />
                        <div className="flex flex-col w-full gap-2 h-fit">
                            <p className={`self-start pl-2 text-lg font-semibold lg:block`}>Subscribed To</p>
                            {subscribedTo && subscribedTo[0].Channels.map((channel: any, index: number) => {
                                if (index > 5) return;
                                const channelLink = page + "/" + channel.$id;
                                const localImage = getPFP(channel.pfp);
                                return (
                                    <a href={"/channel/" + channel.$id} className={`flex flex-row items-center justify-start h-10 gap-2 p-2 rounded-lg w-full ${page === channelLink && (theme === "dark" ? "bg-slate-800" : "bg-slate-200")} ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-200"}`} key={index}>{localImage && <img src={localImage} className='h-full rounded-full aspect-square' />}<span className={`w-full h-full break-all lg:block`}>{channel.username}</span></a>
                                );
                            })}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>}
        </>
    );
};

export default SideMenu;