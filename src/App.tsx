import './App.css'
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { checkUserData, updateEmail, updateName, updatePhone, getSubscribedTo, getLikedTo, getLog, getChannelByUserId } from './lib/Appwrite';
import axios from "axios";
import Cookies from "js-cookie";
import { Toaster } from "@/components/ui/sonner";

import DefaultLayout from './layouts/default';

import Home from './components/pages/home';
import Login from './components/pages/login';
import Fallback from './components/pages/fallback';
import Search from './components/pages/search';
import Watch from './components/pages/watch';
import Subscribed from './components/pages/subscribed';
import Liked from './components/pages/liked';
import History from './components/pages/history';
import ChannelView from './components/pages/channel';
import CreateChannel from './components/pages/create-channel';
import EditChannel from './components/pages/edit-channel';

import { SubscribedTo, SubscribedToRequest, LikedTo, LikedToRequest, Log, LogRequest, ChannelRequest } from './assets/types';

function App() {
  const [runOnce, setRunOnce] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [subscribedTo, setSubscribedTo] = useState<SubscribedTo[]>();
  const [likedTo, setLikedTo] = useState<LikedTo[]>();
  const [log, setLog] = useState<Log[]>();
  const [channel, setChannel] = useState<any>();

  useEffect(() => {
    if (!runOnce) {
      setRunOnce(true);
      const token = Cookies.get('token');
      if (token) {
        const getUser = () => {
          const res = axios.get('https://auth-api.hcklikk.com/auth', {
            headers: {
              jwt_token: token
            }
          })
          res.then((res) => {
            if (res.data.jwt) {
              Cookies.set('token', res.data.jwt, { expires: 7 });
            }
            if (res.data.config.pfp !== null) {
              localStorage.setItem('pfp', res.data.config.pfp);
            }

            checkUserData()
              .then((res2) => {
                if(res2.email !== res.data.account.email) {
                  updateEmail(res.data.account.email, res.data.account.$id);
                }
                if(res2.name !== res.data.account.name) {
                  updateName(res.data.account.name);
                }
                if(res2.phone !== res.data.account.phone) {
                  updatePhone(res.data.account.phone, res.data.account.$id);
                }
                
                setUser(res.data);
              })
              .catch((err) => {
                console.log(err);
                setUser("error");
              });
          }).catch((err) => {
            console.log(err);
            setUser("error");
          });
        }
        getUser();
      } else {
        const url = window.location.pathname.split('/');
        const site = url[1];
        console.log(site);
        if (site === "fallback") {
          return;
        } else if (localStorage.getItem('autoLogin') && site !== "fallback") {
          window.location.href = import.meta.env.VITE_HC_AUTH_ENDPOINT;
        } else {
          setUser("error");
        }
      }
    }
  }, []);

  useEffect(() => {
    if (user && user !== "error") {
      const getSubs = async () => {
        const res = await getSubscribedTo(user.account.$id);
        const subscribedToRequest = res as SubscribedToRequest;
        setSubscribedTo(subscribedToRequest.documents);
      }
      getSubs();
    }
  }, [user]);

  useEffect(() => {
    if (user && user !== "error") {
      const getLikes = async () => {
        const res = await getLikedTo(user.account.$id);
        const likedToRequest = res as LikedToRequest;
        setLikedTo(likedToRequest.documents);
      }
      getLikes();
    }
  }, [user]);

  useEffect(() => {
    if (user && user !== "error") {
      const getLogs = async () => {
        const res = await getLog(user.account.$id);
        const logRequest = res as LogRequest;
        setLog(logRequest.documents);
      }
      getLogs();
    }
  }, [user]);

  useEffect(() => {
    if (user && user !== "error") {
      const fetchChannel = async () => {
        const res: ChannelRequest = await getChannelByUserId(user.account.$id) as ChannelRequest;
        setChannel(res.documents[0]);
      };

      fetchChannel();
    }
  }, [user]);

  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <ScrollArea className="w-full h-full pl-4 pr-4">
          {(user && subscribedTo && likedTo && log) ? <DefaultLayout user={user} subscribedTo={subscribedTo} likedTo={likedTo} log={log} channel={channel}>
            <Routes>
              <Route path="/" element={user && (user === "error" ? <Navigate to="/login" /> : <Home />)} />
              <Route path="/subscribed" element={user && (user === "error" ? <Navigate to="/login" /> : <Subscribed subscribedTo={subscribedTo} />)} />
              <Route path="/liked" element={user && (user === "error" ? <Navigate to="/login" /> : <Liked likedTo={likedTo} />)} />
              <Route path="/history" element={user && (user === "error" ? <Navigate to="/login" /> : <History log={log} />)} />

              <Route path="/channel/:channelId" element={user && (user === "error" ? <Navigate to="/login" /> : <ChannelView user={user} subscribedTo={subscribedTo} />)} />
              <Route path="/channel/create" element={user && (user === "error" ? <Navigate to="/login" /> : <CreateChannel user={user} />)} />
              <Route path="/channel/edit" element={user && (user === "error" ? <Navigate to="/login" /> : <EditChannel channel={channel} />)} />
              
              <Route path="/search?" element={user && (user === "error" ? <Navigate to="/login" /> : <Search />)} />
              <Route path="/watch?" element={user && (user === "error" ? <Navigate to="/login" /> : <Watch user={user} subscribedTo={subscribedTo} likedTo={likedTo} />)} />
            </Routes>
          </DefaultLayout>
          :
          <Routes>
            <Route path="/" element={user && (user === "error" && <Navigate to="/login" />)} />
            <Route path="/login" element={user && (user !== "error" ? <Navigate to="/" /> : <Login />)} />
            <Route path="/fallback/:jwt" element={<Fallback />} />
          </Routes>}
          <Toaster />
        </ScrollArea>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App
