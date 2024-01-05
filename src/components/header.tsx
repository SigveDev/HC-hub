import { useContext, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";  
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useTheme } from "./theme-provider";
import axios from "axios";
import Cookies from "js-cookie";
import { logout } from "@/lib/Appwrite";
import { Button } from "./ui/button";
import { Search, Menu } from "lucide-react";

const Header = ({ user, channel }: any) => {
    const [avatar, setAvatar] = useState<string>();
    const [credentials, setCredentials] = useState<string>();
    const [settingLink, setSettingLink] = useState<string>();
    const [searchValue, setSearchValue] = useState<string>(new URLSearchParams(window.location.search).get("q") || "");
    const [minimizeMenu, setMinimizeMenu] = useState<boolean>(false);

    const { theme, setTheme } = useTheme();

    useEffect(() => {
        if (window.location.pathname.split('/').includes("watch")) {
          setMinimizeMenu(true);
        } else {
          setMinimizeMenu(false);
        }
      }, []);

    useEffect(() => {
        if (user) {
            const name = user.account.name;
            const tempCredentials = name
                .split(" ")
                .map((word: string) => word.charAt(0))
                .join("");
            setCredentials(tempCredentials);
        }
    }, [user]);

    useEffect(() => {
        const getImg = async () => {
            const res = await axios.get('https://auth-api.hcklikk.com/pfp', {
                headers: {
                    jwt_token: Cookies.get('token')
                },
                responseType: 'blob'
            });
            const blob = new Blob([res.data], { type: 'image/png' });
            const url = URL.createObjectURL(blob);
            setAvatar(url);
        }
        if (Cookies.get('token')) {
            getImg();
        }
    }, []);

    useEffect(() => {
        if (user) {
            if (Cookies.get('token')) {
                setSettingLink("https://auth-dev.hcklikk.com/profile");
            } else {
                setSettingLink("/profile");
            }
        }
    }, [user]);

    const handleSearch = (e: any) => {
        e.preventDefault();
        const type = new URLSearchParams(window.location.search).get("type");
        const search = e.target[0].value;
        if (search === "") {
            window.location.href = "/";
            return;
        };
        window.location.href = `/search?q=${search}${type ? `&type=${type}` : ""}`;
    };

    const handleLogout = () => {
        logout();
        Cookies.remove('token');
        localStorage.removeItem('pfp');
        localStorage.removeItem('autoLogin');
        localStorage.removeItem('cookieFallback');
        window.location.href = "/login";
    };

    const handleToggleMenu = () => {
        localStorage.setItem('menuOpen', String(true));
    };

    return (
        <div className="flex flex-row items-center justify-between w-full h-12 mt-4">
            <div className="flex flex-row items-center justify-center gap-2 h-fit w-fit">
                {minimizeMenu && <button onClick={handleToggleMenu}><Menu /></button>}
                <a href="/"><h1 className="flex items-center justify-center h-full text-xl font-semibold w-fit">HC Hub</h1></a>
            </div>
            <form className="flex flex-row items-center justify-center w-1/3 h-full" onSubmit={(e) => handleSearch(e)}>
                <Input type="search" placeholder="Search" className="w-5/6 pl-4 rounded-r-none rounded-l-3xl focus-visible:ring-transparent" value={searchValue} onChange={(e) => setSearchValue(e.target.value.toString())} />
                <Button type="submit" className="grid w-1/6 rounded-l-none rounded-r-3xl place-items-center" variant="secondary"><Search className="mr-1" /></Button>
            </form>
            <DropdownMenu>
                <DropdownMenuTrigger className="h-full aspect-square">
                    <Avatar className="w-full h-full">
                      <AvatarImage src={avatar} />
                      <AvatarFallback>{credentials}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>{user.account.name}</DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer"><a href={"/channel/" + (channel !== undefined && channel.$id)}>Channel</a></DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer"><a href="https://studio.hub.hcklikk.com">Studio</a></DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer"><a href={settingLink}>Settings</a></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Theme</DropdownMenuLabel>
                    <DropdownMenuItem>
                        <Tabs defaultValue={theme}>
                            <TabsList className="flex flex-row w-full h-full">
                                <TabsTrigger value="dark" onClick={() => setTheme("dark")} className="flex items-center justify-center w-full h-full">Darkmode</TabsTrigger>
                                <TabsTrigger value="light" onClick={() => setTheme("light")} className="flex items-center justify-center w-full h-full">Lightmode</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleLogout()} className="cursor-pointer">Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default Header;