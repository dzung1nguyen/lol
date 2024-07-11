"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import LaravelApiRequest from "@/utils/LaravelApiRequest";
import Post from "@/components/Post";
import { usePostStore } from "@/providers/post-store-provider";
import { useInView } from "react-intersection-observer";
import { throttle } from "lodash";
import PostSkeleton from "./PostLoading";

type FilterPros = {
  order?: "new" | "hot" | "trending";
  title?: string;
  category?: string;
  reviewing?: boolean;
  source_type?: string;
};

export default function Posts({ filter }: { filter: FilterPros }) {
  const t = useTranslations("");
  const locale = useLocale();
  const [scrollTrigger, isInView] = useInView();
  const [posts, setPosts] = useState<Model.Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const { players, clearPlayersRef } = usePostStore((state) => state);
  const { sourceType } = usePostStore((state) => state);

  const fetchData = async (focusPage?: number) => {
    if (hasMoreData || focusPage) {
      setLoading(true);

      const postPage = focusPage ?? page;
      const params: Record<string, string | number> = {
        page: postPage,
        locale,
      };

      if (filter.title) {
        params["title"] = filter.title;
      }
      if (filter.order) {
        params["order"] = filter.order;
      }
      if (filter.category) {
        params["category"] = filter.category;
      }
      if (filter.reviewing) {
        params["reviewing"] = "1";
      }
      params["source_type"] = filter.source_type ?? sourceType;

      const { data } = await LaravelApiRequest.get("/api/posts", params);

      setHasMoreData(!!data?.posts?.paginator?.has_more_pages);
      setPage((page) => postPage + 1);
      setPosts((prevPosts) => {
        return postPage === 1
          ? [...(data?.posts?.data ?? [])]
          : [...prevPosts, ...(data?.posts?.data ?? [])];
      });

      setLoading(false);
    }
  };

  useEffect(() => {
    clearPlayersRef();
    setPosts([]);
    fetchData(1);
  }, [sourceType, filter?.title, filter?.source_type]);

  useEffect(() => {
    if (isInView && hasMoreData) {
      fetchData();
    }
  }, [isInView, hasMoreData, sourceType]);

  useEffect(() => {
    clearPlayersRef();

    return clearPlayersRef;
  }, [clearPlayersRef]);

  const handlePlayers = () => {
    players.forEach((el: any) => {
      if (el) {
        const { player, box } = el;
        const rect = box.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        const video = player.getInternalPlayer();
        if (isVisible) {
          if (video) {
            if (video.playVideo) {
              video.playVideo();
            }
            if (video.play) {
              video.play();
            }
          }
        } else {
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
  };

  useEffect(() => {
    const handleScrollThrottled = throttle(() => {
      handlePlayers();
    }, 500);

    window.addEventListener("scroll", handleScrollThrottled);
    return () => {
      handleScrollThrottled.cancel();
      window.removeEventListener("scroll", handleScrollThrottled);
    };
  }, [players]);

  return (
    <>
      {posts.map((post) => (
        <div key={`${post.id}-${post.ulid}`}>
          <Post post={post} autoPlay={false} />
        </div>
      ))}
      {hasMoreData && !loading && <div ref={scrollTrigger}></div>}
      {loading && (
        <div className="flex w-full justify-center">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      )}
      {loading && posts.length === 0 && <PostSkeleton />}
      {!loading && !posts.length && (
        <div className="flex w-full justify-center">
          <div>{t("No Posts found")}</div>
        </div>
      )}
    </>
  );
}
