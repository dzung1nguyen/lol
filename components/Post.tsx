"use client";

import IconHeart from "./icons/IconHeart";
import IconBxCommentDetail from "./icons/IconBxCommentDetail";
import { Link } from "@/navigation";
import PostTypeUpload from "./PostTypeUpload";
import PostTypeUrl from "./PostTypeUrl";
import { useGlobalStore } from "@/providers/global-store-provider";
import { useState } from "react";
import LaravelApiRequest from "@/utils/LaravelApiRequest";
import TimeAgo from "./TimeAgo";
import { useLocale, useTranslations } from "next-intl";
import ShareButton from "./ShareButton";
import { useFormattedNumber } from "@/hooks";

export default function Post({
  post,
  autoPlay,
}: {
  post: Model.Post;
  autoPlay: boolean | undefined;
}) {
  const t = useTranslations("");
  const locale = useLocale();
  const { authenticated } = useGlobalStore((state) => state);
  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(post.total_likes ?? 0);
  const f = useFormattedNumber();

  const handleLike = async (authenticated: any, postId: string) => {
    if (authenticated) {
      const response = await LaravelApiRequest.post(
        `/api/private/posts/${postId}/liked`
      );
      if (response.data?.total_likes) {
        setTotalLikes(response.data?.total_likes);
      }
      setLiked(true);
    } else {
      const modal = document.getElementById("loginModal");
      // @ts-ignore
      if (modal && modal?.show) {
        // @ts-ignore
        modal?.show();
      }
    }
  };

  return (
    <div className="card border border-base-300 py-5">
      <div className="px-5">
        <div className="flex gap-3 items-center justify-between">
          <Link
            href={{
              pathname: "/author/[ulid]",
              params: {
                ulid: post.wallet.ulid,
              },
            }}
            className="font-semibold text-xs lg:text-sm hover:text-primary"
          >
            @{post.wallet.name}
          </Link>
          <div className="text-xs font-semibold">
            <TimeAgo value={post.published_at ?? post.created_at} />
          </div>
        </div>
        <h2 className="font-semibold text-lg xl:text-xl mb-3">
          <Link
            href={{
              pathname: "/posts/[ulid]",
              params: { ulid: post.ulid },
            }}
            className="hover:text-primary"
          >
            {post.title}
          </Link>
        </h2>
      </div>
      <div className="sm:px-5">
        <div className="flex w-full items-center overflow-hidden justify-center bg-base-300">
          {post.type === "url" && (
            <PostTypeUrl post={post} autoPlay={autoPlay} />
          )}
          {(post.type === "upload" || post.type === "generator") && post.file && (
            <PostTypeUpload file={post.file} autoPlay={autoPlay} />
          )}
        </div>
      </div>
      <div className="px-5">
        <div className="flex gap-2 flex-wrap mt-4 text-sm">
          {post.categories.map((category) => (
            <Link
              key={category.code}
              className="badge badge-lg link link-hover"
              href={{
                pathname: "/category/[code]",
                params: { code: category.code },
              }}
            >
              {category.name_locale}
            </Link>
          ))}
        </div>
        <div className="flex mt-4 items-center font-semibold">
          <div className="flex items-center justify-between sm:justify-start gap-5 w-full">
            <div
              className={`${!authenticated ? "tooltip tooltip-right" : ""}`}
              data-tip={t("Please login to continue")}
            >
              <button
                disabled={liked}
                className="hover:text-primary flex items-center"
                onClick={() => handleLike(authenticated, post.ulid)}
              >
                <IconHeart className="w-5 h-5" />
                <div className="ml-2">{f.format(totalLikes)}</div>
              </button>
            </div>
            <div>
              <Link
                href={{
                  pathname: "/posts/[ulid]",
                  params: { ulid: post.ulid },
                  hash: "#PostComments",
                }}
                className="flex items-center hover:text-primary"
              >
                <IconBxCommentDetail className="w-5 h-5" />
                <div className="ml-2">{f.format(post.total_comments)}</div>
              </Link>
            </div>
            <div className="sm:ml-auto">
              <ShareButton
                url={`${process.env.NEXT_PUBLIC_BASE_URL!}/${locale}/posts/${
                  post.ulid
                }`}
                title={post.title}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
