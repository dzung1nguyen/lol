"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LaravelApiRequest from "@/utils/LaravelApiRequest";
import Post from "@/components/Post";
import { usePostStore } from "@/providers/post-store-provider";
import { useInView } from "react-intersection-observer";
import { throttle } from "lodash";
import PostSkeleton from "./PostLoading";

export default function HomePosts({
  defaultPosts,
  paginator,
  filter,
}: {
  defaultPosts: Model.Post[];
  paginator: Model.Paginator;
  filter: Request.FilterPost;
}) {
  const { players, clearPlayersRef } = usePostStore((state) => state);
  const [posts, setPosts] = useState<Model.Post[]>(defaultPosts);
  const [hasMoreData, setHasMoreData] = useState(
    paginator?.has_more_pages ?? false
  );
  const [filterSourceType, setFilterSourceType] = useState(filter.source_type);
  const { sourceType, setSourceType } = usePostStore((state) => state);
  const t = useTranslations("");
  const locale = useLocale();
  const [scrollTrigger, isInView] = useInView();
  const [loading, setLoading] = useState(false);
  const initialRender = useRef(true);

  const lastPost = useMemo(() => {
    const length = posts.length;
    if (posts.length === 0) {
      return null;
    }
    const { id, total_likes, total_comments, total_views, published_at } =
      posts[length - 1];

    return { id, total_likes, total_comments, total_views, published_at };
  }, [posts]);

  const fetchData = useCallback(
    async (restart?: boolean, filterSourceType?: string) => {
      if (hasMoreData || restart) {
        setLoading(true);

        const postPage = restart ? 1 : 1;
        const params: Record<string, string | number> = {
          page: postPage,
          locale,
        };

        params["order"] = filter.order;

        params["source_type"] = filterSourceType ?? filter.source_type ?? "all";

        if (filter.title) {
          params["title"] = filter.title;
        }
        if (filter.order) {
          params["order"] = filter.order;
        }
        if (filter.category) {
          params["category"] = filter.category;
        }
        if (filter.locale) {
          params["locale"] = filter.locale;
        }

        if (!restart) {
          params["last_id"] = lastPost?.id ?? "";
          params["last_total_likes"] = lastPost?.total_likes ?? "";
          params["last_total_comments"] = lastPost?.total_comments ?? "";
          params["last_total_views"] = lastPost?.total_views ?? "";
          params["last_published_at"] = lastPost?.published_at ?? "";
        }

        const { data } = await LaravelApiRequest.get("/api/posts", params);

        setHasMoreData(!!data?.posts?.paginator?.has_more_pages);
        setPosts((prevPosts) => {
          return restart
            ? [...(data?.posts?.data ?? [])]
            : [...prevPosts, ...(data?.posts?.data ?? [])];
        });

        setLoading(false);
      }
    },
    [filter, hasMoreData, lastPost, locale]
  );

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
    if (filterSourceType !== sourceType && !initialRender.current) {
      setFilterSourceType(sourceType);
      setPosts([]);
      clearPlayersRef();
      fetchData(true, sourceType);
    }
  }, [filterSourceType, sourceType, lastPost]);

  useEffect(() => {
    if (isInView && hasMoreData) {
      fetchData();
    }
  }, [isInView, hasMoreData]);

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

  useEffect(() => {
    return () => {
      clearPlayersRef();
      setSourceType("all");
    };
  }, []);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      setPosts([]);
      clearPlayersRef();
      fetchData(true);
    }
  }, [filter.title]);

  return (
    <>
      {posts.map((post) => (
        <div key={`${post.id}-${post.ulid}`}>
          <Post post={post} autoPlay={false} />
        </div>
      ))}
      {hasMoreData && !loading && <div ref={scrollTrigger}></div>}
      {loading && <PostSkeleton />}
      {!loading && !posts.length && (
        <div className="flex w-full justify-center">
          <div>{t("No Posts found")}</div>
        </div>
      )}
    </>
  );
}
