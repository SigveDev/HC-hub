import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Maximize,
  Minimize,
  PictureInPicture2,
  Volume1,
  Volume2,
  VolumeX,
  Loader2,
  Cast,
  X,
} from "lucide-react";

// Declare the chrome namespace to avoid TypeScript errors
declare global {
  interface Window {
    chrome: any;
  }
}

declare global {
  interface Window {
    __onGCastApiAvailable: (isAvailable: boolean) => void;
  }
}
const VideoPlayer = ({ video }: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [playing, setPlaying] = useState<boolean>(false);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement>();
  const [videoContainer, setVideoContainer] = useState<HTMLDivElement>();
  const [timelineContainer, setTimelineContainer] = useState<HTMLDivElement>();
  const [previewTimeline, setPreviewTimeline] = useState<HTMLDivElement>();
  const [wasPaused, setWasPaused] = useState<boolean>(true);
  const wasPausedRef = useRef(wasPaused);
  const [volume, setVolume] = useState<number>(100);
  const [duration, setDuration] = useState<string>("0:00");
  const [currentTime, setCurrentTime] = useState<string>("0:00");
  const [mouseMoving, setMouseMoving] = useState<boolean>(true);

  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const isScrubbingRef = useRef(isScrubbing);
  let tempIsScrubbing = false;

  let timeout: any;

  const handleMouseMove = () => {
    if (videoContainer) {
      setMouseMoving(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setMouseMoving(false);
      }, 3000);
    }
  };

  useEffect(() => {
    if (duration != "0:00") {
      setLoading(false);
    }
  }, [duration]);

  useEffect(() => {
    if (videoContainer) {
      videoContainer.addEventListener("mousemove", () => handleMouseMove());

      return () => {
        videoContainer.removeEventListener("mousemove", () =>
          handleMouseMove()
        );
      };
    }
  }, [videoContainer]);

  useEffect(() => {
    const video = document.getElementById("video") as HTMLVideoElement;
    setVideoElement(video);

    const videoContainer = document.getElementById(
      "videoContainer"
    ) as HTMLDivElement;
    setVideoContainer(videoContainer);

    const timelineContainer = document.getElementById(
      "timeline-container"
    ) as HTMLDivElement;
    setTimelineContainer(timelineContainer);

    const previewTimeline = document.getElementById(
      "preview"
    ) as HTMLDivElement;
    setPreviewTimeline(previewTimeline);
  }, []);

  useEffect(() => {
    if (videoElement) {
      document
        .getElementById("progress")
        ?.style.setProperty(
          "right",
          `${100 - (videoElement?.currentTime / videoElement?.duration) * 100}%`
        );
      document
        .getElementById("thumb")
        ?.style.setProperty(
          "left",
          `${(videoElement?.currentTime / videoElement?.duration) * 100}%`
        );
    }
  }, [videoElement?.currentTime]);

  useEffect(() => {
    if (videoElement) {
      videoElement.addEventListener("play", () => {
        setPlaying(true);
      });
      videoElement.addEventListener("pause", () => {
        setPlaying(false);
      });
      videoElement.addEventListener("ended", () => {
        setPlaying(false);
      });

      videoElement.addEventListener("enterpictureinpicture", () => {
        setPlaying(true);
      });
      videoElement.addEventListener("leavepictureinpicture", () => {
        setPlaying(false);
      });

      videoElement.addEventListener("loadeddata", () => {
        setDuration(formatDuration(videoElement.duration));
      });
      videoElement.addEventListener("timeupdate", () => {
        setCurrentTime(formatDuration(videoElement.currentTime));
      });

      return () => {
        videoElement.removeEventListener("play", () => {
          setPlaying(true);
        });
        videoElement.removeEventListener("pause", () => {
          setPlaying(false);
        });
        videoElement.removeEventListener("ended", () => {
          setPlaying(false);
        });

        videoElement.removeEventListener("enterpictureinpicture", () => {
          setPlaying(true);
        });
        videoElement.removeEventListener("leavepictureinpicture", () => {
          setPlaying(false);
        });

        videoElement.removeEventListener("loadeddata", () => {
          setDuration(formatDuration(videoElement.duration));
        });
        videoElement.removeEventListener("timeupdate", () => {
          setCurrentTime(formatDuration(videoElement.currentTime));
        });
      };
    }
  }, [videoElement]);

  useEffect(() => {
    if (timelineContainer) {
      const handleMouseMove = (e: any) => {
        handleTimelineUpdate(e);
      };
      const handleMouseDown = (e: any) => {
        toggleScrubbing(e);
      };

      timelineContainer.addEventListener("mousemove", handleMouseMove);
      timelineContainer.addEventListener("mousedown", handleMouseDown);

      return () => {
        timelineContainer.removeEventListener("mousemove", handleMouseMove);
        timelineContainer.removeEventListener("mousedown", handleMouseDown);
      };
    }
  }, [timelineContainer]);

  useEffect(() => {
    document.addEventListener("fullscreenchange", () => {
      setFullscreen(!fullscreen);
    });

    return () => {
      document.removeEventListener("fullscreenchange", () => {
        setFullscreen(!fullscreen);
      });
    };
  }, [fullscreen]);

  useEffect(() => {
    isScrubbingRef.current = isScrubbing;
  }, [isScrubbing]);

  useEffect(() => {
    wasPausedRef.current = wasPaused;
  }, [wasPaused]);

  useEffect(() => {
    document.addEventListener("mouseup", (e) => {
      if (isScrubbingRef.current) {
        toggleScrubbing(e);
      }
    });
    document.addEventListener("mousemove", (e) => {
      if (isScrubbingRef.current) {
        handleTimelineUpdate(e);
      }
    });

    return () => {
      document.removeEventListener("mouseup", (e) => {
        console.log("mouseup: " + isScrubbing);
        if (isScrubbing) {
          console.log("scrubbing");
          toggleScrubbing(e);
        }
      });
      document.removeEventListener("mousemove", (e) => {
        if (isScrubbing) {
          handleTimelineUpdate(e);
        }
      });
    };
  }, [isScrubbing]);

  useEffect(() => {
    if (videoElement) {
      const handleKeyDown = (e: any) => {
        switch (e.key.toLowerCase()) {
          case " ":
          case "k":
            togglePlay();
            break;
          case "f":
            toggleFullscreen();
            break;
          case "i":
            togglePIP();
            break;
          case "m":
            toggleVolume();
            break;
          case "arrowleft":
          case "j":
            skip(-5);
            break;
          case "arrowright":
          case "l":
            skip(5);
            break;
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [videoElement]);

  const toggleScrubbing = (e: any) => {
    if (timelineContainer && videoElement) {
      const rect = timelineContainer.getBoundingClientRect();
      const percent =
        Math.min(Math.max(e.clientX - rect.left), rect.width) / rect.width;
      tempIsScrubbing = (e.buttons & 1) === 1;
      setIsScrubbing(tempIsScrubbing);
      if (tempIsScrubbing) {
        setWasPaused(videoElement.paused);
        videoElement.pause();
      } else {
        videoElement.currentTime = percent * videoElement.duration;
        if (!wasPausedRef.current) {
          videoElement.play();
        }
      }

      handleTimelineUpdate(e);
    }
  };

  const handleTimelineUpdate = (e: any) => {
    if (timelineContainer && videoElement && previewTimeline) {
      const rect = timelineContainer.getBoundingClientRect();
      const percent =
        Math.min(Math.max(e.clientX - rect.left), rect.width) / rect.width;
      const withinBounds = percent >= 0 && percent <= 1;

      // Calculate the remaining percent
      const remainingPercent = withinBounds ? 100 - percent * 100 : 0;

      // Set the preview's right value to the right side of the mouse
      const previewRight = withinBounds ? `${remainingPercent}%` : "0%";
      previewTimeline.style.setProperty("right", previewRight);

      if (isScrubbing) {
        e.preventDefault();
        videoElement.currentTime = percent * videoElement.duration;
      }
    }
  };

  const formatDuration = (duration: number) => {
    const seconds = Math.floor(duration % 60);
    const minutes = Math.floor(duration / 60) % 60;
    const hours = Math.floor(duration / 3600);
    return `${hours > 0 ? `${hours}:` : ""}${
      minutes < 10 ? `0${minutes}` : minutes
    }:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const skip = (amount: number) => {
    if (videoElement) {
      videoElement.currentTime += amount;
    }
  };

  const togglePlay = () => {
    if (videoElement && videoElement.paused) {
      videoElement.play();
    } else if (videoElement && !videoElement.paused) {
      videoElement.pause();
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement == null) {
      if (videoContainer) {
        videoContainer.requestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }
  };

  const togglePIP = () => {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else if (videoElement) {
      videoElement.requestPictureInPicture();
    }
  };

  const toggleVolume = () => {
    if (videoElement) {
      if (videoElement.volume === 0) {
        videoElement.volume = volume / 100;
      } else {
        videoElement.volume = 0;
      }
    }
  };

  // Chromecast

  const [casting, setCasting] = useState(false);
  const [castSession, setCastSession] = useState<any>(null);

  useEffect(() => {
    // Load Cast SDK script
    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/cv/js/sender/v1/cast_sender.js";
    script.async = true;
    document.body.appendChild(script);

    // Initialize the Cast SDK
    window["__onGCastApiAvailable"] = (isAvailable: boolean) => {
      if (isAvailable) {
        const sessionRequest = new window.chrome.cast.SessionRequest(
          window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
        );
        const apiConfig = new window.chrome.cast.ApiConfig(
          sessionRequest,
          sessionListener,
          receiverListener
        );
        window.chrome.cast.initialize(
          apiConfig,
          () => console.log("Cast SDK initialized"),
          onError
        );
      }
    };

    // Session listener
    const sessionListener = (session: any) => {
      setCastSession(session);
      if (session.media.length !== 0) {
        console.log("Found existing session");
      }
    };

    // Receiver listener
    const receiverListener = (e: any) => {
      if (e === window.chrome.cast.ReceiverAvailability.AVAILABLE) {
        console.log("Chromecast is available");
      } else {
        console.log("Chromecast is not available");
      }
    };

    // Error handler
    const onError = (error: any) => {
      console.error("Error initializing Cast SDK:", error);
    };

    // Cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const startCasting = () => {
    if (!casting) {
      window.chrome.cast.requestSession(
        (session: any) => {
          setCastSession(session);
          const mediaInfo = new window.chrome.cast.media.MediaInfo(
            video,
            "video/mp4"
          );
          const request = new window.chrome.cast.media.LoadRequest(mediaInfo);
          session.loadMedia(request);
          setCasting(true);
        },
        (error: any) => {
          console.error("Error starting Cast session:", error);
        }
      );
    } else {
      if (castSession) {
        castSession.stop(
          () => {
            setCastSession(null);
            setCasting(false);
          },
          (error: any) => {
            console.error("Error stopping Cast session:", error);
          }
        );
      }
    }
  };

  return (
    <div
      id="videoContainer"
      className="relative w-full h-full bg-black rounded-xl group/video aspect-video"
    >
      <video
        id="video"
        className={`absolute bottom-0 left-0 right-0 w-full h-full rounded-xl ${
          !mouseMoving && "cursor-none"
        }`}
        src={video}
        onClick={togglePlay}
        playsInline
      />
      <div
        id="uiContainer"
        className={`absolute bottom-0 z-50 w-full transition-opacity ease-in-out ${
          playing ? "opacity-0" : "opacity-100"
        } h-fit group-hover/video:duration-150 ${
          mouseMoving && "group-hover/video:opacity-100"
        } before:bg-gradient-to-t before:from-black before:to-transparent before:w-full before:bottom-0 before:aspect-[6/1] before:z-[-1] before:absolute before:pointer-events-none before:rounded-b-xl`}
      >
        <div
          id="timeline-container"
          className="h-[7px] ms-2 me-2 cursor-pointer flex items-center group/timeline"
        >
          <div
            id="timeline"
            className="bg-slate-800 h-[3px] w-full relative group-hover/timeline:h-full"
          >
            <div
              id="preview"
              className="absolute top-0 bottom-0 left-0 hidden bg-slate-500 group-hover/timeline:block"
            ></div>
            <div
              id="progress"
              className="absolute top-0 bottom-0 left-0 bg-red-700"
            ></div>
            <div
              id="thumb"
              className="hidden left-0 absolute top-[-50%] bottom-0 h-[200%] translate-x-[-50%] bg-red-700 rounded-full aspect-square group-hover/timeline:flex"
            ></div>
          </div>
        </div>
        <div className="z-50 flex flex-row items-end w-full h-[36px] gap-4 p-[8px]">
          {playing ? (
            <button
              onClick={togglePlay}
              className="p-0 m-0 bg-transparent border-none"
              title="pause (k)"
            >
              <Pause
                size={20}
                color="#ffffff"
                strokeWidth={2}
                absoluteStrokeWidth
                className="cursor-pointer"
              />
            </button>
          ) : (
            <button
              onClick={togglePlay}
              className="p-0 m-0 bg-transparent border-none"
              title="play (k)"
            >
              <Play
                size={20}
                color="#ffffff"
                strokeWidth={2}
                absoluteStrokeWidth
                className="cursor-pointer"
              />
            </button>
          )}
          <div className="flex items-center w-[20px] hover:w-fit group/volume">
            <button
              onClick={toggleVolume}
              className="p-0 m-0 bg-transparent border-none"
              title={
                videoElement &&
                (videoElement.volume === 0 ? "unmute (m)" : "mute (m)")
              }
            >
              {videoElement &&
                (videoElement.volume === 0 ? (
                  <VolumeX
                    size={20}
                    color="#ffffff"
                    strokeWidth={2}
                    className="cursor-pointer"
                  />
                ) : videoElement.volume < 0.5 ? (
                  <Volume1
                    size={20}
                    color="#ffffff"
                    strokeWidth={2}
                    className="cursor-pointer"
                  />
                ) : (
                  <Volume2
                    size={20}
                    color="#ffffff"
                    strokeWidth={2}
                    className="cursor-pointer"
                  />
                ))}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={(videoElement?.volume ?? 1) * 100}
              onChange={(e) => {
                setVolume(parseInt(e.target.value));
                if (videoElement) {
                  videoElement.volume = parseInt(e.target.value) / 100;
                }
              }}
              className="w-0 h-1 ml-2 transition-all ease-in-out origin-left scale-x-0 rounded-full appearance-none cursor-pointer accent-white range group-hover/volume:w-16 bg-slate-300 group-hover/volume:duration-150 group-hover/volume:scale-x-100 focus-within:w-16 focus-within:scale-x-100"
            />
          </div>
          <div className="flex items-center flex-grow gap-1 text-sm">
            <div className="text-white">{currentTime}</div>
            <div className="text-white">/</div>
            <div className="text-white">{duration}</div>
          </div>
          <button
            onClick={startCasting}
            className="p-0 m-0 bg-transparent border-none"
            title="cast"
          >
            {casting ? (
              <X
                size={20}
                color="#ffffff"
                strokeWidth={2}
                className="cursor-pointer"
              />
            ) : (
              <Cast
                size={20}
                color="#ffffff"
                strokeWidth={2}
                className="cursor-pointer"
              />
            )}
          </button>
          <button
            onClick={togglePIP}
            className="p-0 m-0 bg-transparent border-none"
            title="miniplayer (i)"
          >
            <PictureInPicture2
              size={20}
              color="#ffffff"
              strokeWidth={2}
              className="cursor-pointer"
            />
          </button>
          {fullscreen ? (
            <button
              onClick={toggleFullscreen}
              className="p-0 m-0 bg-transparent border-none"
              title="exit fullscreen (f)"
            >
              <Minimize
                size={20}
                color="#ffffff"
                strokeWidth={2}
                className="cursor-pointer"
              />
            </button>
          ) : (
            <button
              onClick={toggleFullscreen}
              className="p-0 m-0 bg-transparent border-none"
              title="fullscreen (f)"
            >
              <Maximize
                size={20}
                color="#ffffff"
                strokeWidth={2}
                className="cursor-pointer"
              />
            </button>
          )}
        </div>
      </div>
      {loading && (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 size={64} className="animate-spin" />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
