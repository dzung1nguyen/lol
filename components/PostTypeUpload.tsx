"use client";

import ReactPlayer from "react-player";
import { isImageFileUrl, isVideoFileUrl } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { usePostStore } from "@/providers/post-store-provider";
import IconUnmute16 from "./icons/IconUnmute16";
import IconBxVolumeMute from "./icons/IconBxVolumeMute";
import IconPlayCircle from "./icons/IconPlayCircle";

export default function PostTypeUpload({
  file,
  autoPlay,
}: {
  file: Model.File;
  autoPlay: boolean | undefined;
}) {
  const { addPlayerRef } = usePostStore((state) => state);
  const playerRef = useRef<any>();
  const boxRef = useRef<any>();
  const [muted, setMuted] = useState(true);
  const [play, setPlay] = useState(false);
  const [playIcon, setPlayIcon] = useState(true);
  const [loading, setLoading] = useState(true);
  const [disableMuted, setDisableMuted] = useState(false);
  const { players } = usePostStore((state) => state);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isVideoFileUrl(file.url) && mounted && !autoPlay) {
      addPlayerRef({
        player: playerRef.current,
        box: boxRef.current,
      });
    }
  }, [addPlayerRef, file.url, autoPlay, mounted]);

  const playMe = () => {
    const videoId = playerRef.current?.props?.id;
    players.forEach((el: any) => {
      if (el) {
        const { player } = el;
        const playerId = player?.props?.id;
        if (videoId && playerId && videoId === playerId) {
          return;
        }
        if (player.getInternalPlayer) {
          const video = player?.getInternalPlayer();
          if (video) {
            if (video.pause) {
              video.pause();
            }
            if (video.pauseVideo) {
              video.pauseVideo();
            }
          }
        }
      }
    });

    if (playerRef.current?.getInternalPlayer) {
      const video = playerRef.current?.getInternalPlayer();
      if (video) {
        if (video.playVideo) {
          video.playVideo();
        }
        if (video.play) {
          video.play();
        }
      }
    }
  };

  const setMuteVideo = (status: boolean) => {
    setDisableMuted(true);
    setMuted(status);
    if (!status) {
      playMe();
    }
    setTimeout(() => {
      setDisableMuted(false);
    }, 1000);
  };

  const handlePlay = async (status: boolean) => {
    setPlay(status);
    if (status) {
      await playMe();
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {isImageFileUrl(file.url) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={file.url}
          alt={file.name}
          className="w-full"
        />
      )}
      {isVideoFileUrl(file.url) && (
        <div ref={boxRef} className="box-video relative">
          {!mounted && <div className="skeleton w-full aspect-[16/9]"></div>}
          {mounted && (
            <ReactPlayer
              id={file.ulid}
              style={{ width: "auto", height: "auto", maxWidth: "100%" }}
              ref={playerRef}
              playing={autoPlay ? true : play}
              muted={muted}
              loop={true}
              url={[
                {
                  src: file.url,
                  type: file.mime,
                },
              ]}
              controls={false}
              playsinline={true}
              onReady={() => setLoading(false)}
              onStart={() => setPlayIcon(true)}
              onPlay={() => setPlayIcon(false)}
              onPause={() => setPlayIcon(true)}
            />
          )}
          <span className="absolute block bottom-3 right-3 w-12 h-12">
            <button
              disabled={disableMuted}
              className={`h-12 w-12 rounded-full flex items-center justify-center bg-black text-white`}
              onClick={() => setMuteVideo(!muted)}
            >
              {!muted && <IconUnmute16 className="h-6 w-6" />}
              {muted && <IconBxVolumeMute className="h-6 w-6" />}
            </button>
          </span>
          {!loading && playIcon && (
            <a
              onClick={() => handlePlay(true)}
              className="absolute left-[calc(50%-2rem)] top-[calc(50%-2rem)] hover:cursor-pointer bg-gray-800 rounded-full text-white opacity-80"
            >
              <IconPlayCircle className="size-16" />
            </a>
          )}
          {loading && (
            <a className="absolute left-[calc(50%-20px)] top-[calc(50%-20px)] hover: cursor-pointer">
              <span className="loading loading-ring loading-lg"></span>
            </a>
          )}
        </div>
      )}
    </>
  );
}
