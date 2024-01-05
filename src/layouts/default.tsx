import { Channel, LikedTo, Log, SubscribedTo } from "@/assets/types";
import Header from "@/components/header";
import SideMenu from "@/components/side-menu";
import { useEffect, useState } from "react";

interface DefaultLayoutProps {
  user: any;
  subscribedTo: SubscribedTo[];
  likedTo: LikedTo[];
  log: Log[];
  channel: Channel[];
  children: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ user, subscribedTo, likedTo, log, channel, children }) => {
    const [minimizeMenu, setMinimizeMenu] = useState<boolean>(false);

    useEffect(() => {
        if (window.location.pathname.split('/').includes("watch")) {
          setMinimizeMenu(true);
        } else {
          setMinimizeMenu(false);
        }
      }, []);

    return (
        <>
            <Header user={user} channel={channel} />
            <div className={`grid w-full ${minimizeMenu ? "lg:grid-cols-1 md:grid-cols-1" : "lg:grid-cols-12 md:grid-cols-[repeat(26,_minmax(0,_1fr))]"} h-fit gap-4`}>
                <div className={`w-full h-full col-span-2 ${minimizeMenu ? "hidden" : "lg:block md:block sm:hidden"}`}>
                    {user && subscribedTo && likedTo && log && <SideMenu user={user} subscribedTo={subscribedTo} likedTo={likedTo} log={log} channel={channel} />}
                </div>
                <div className={`flex flex-col items-center w-full h-full ${minimizeMenu ? "lg:col-span-1 md:col-span-1" : "lg:col-span-10 md:col-[3_/_span_28]"}`}>
                    {children}
                </div>
            </div>
        </>
    );
};

export default DefaultLayout;