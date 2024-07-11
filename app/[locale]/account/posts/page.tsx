"use client";

import IconBxCommentDetail from "@/components/icons/IconBxCommentDetail";
import IconEye from "@/components/icons/IconEye";
import IconHeart from "@/components/icons/IconHeart";
import { postStatuses } from "@/config";
import { Link } from "@/navigation";
import { convertDateTimeToLocal, scrollToDiv } from "@/utils";
import LaravelApiRequest from "@/utils/LaravelApiRequest";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function PostCreatePage() {
  const t = useTranslations("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("all");
  const [posts, setPosts] = useState<Model.Post[]>([]);
  const [paginator, setPaginator] = useState<Model.Paginator>({
    count: 0,
    per_page: 10,
    has_pages: false,
    has_more_pages: false,
    current_page: 1,
    next_pageUrl: null,
    previous_page_url: null,
  });

  const [loading, setLoading] = useState(true);

  const fetchData = async (
    page: number,
    status?: string,
    title?: string,
    scroll?: boolean
  ) => {
    const pagrams: Record<string, string | number | undefined> = {
      page,
      status: status,
      title: title,
    };

    setLoading(true);

    const { data } = await LaravelApiRequest.get(`/api/private/posts`, pagrams);

    setPosts(data?.posts?.data ?? []);

    setPaginator((prevPaginator) => ({
      ...prevPaginator,
      ...(data?.posts?.paginator ?? null),
    }));

    if (scroll) {
      scrollToDiv("listList");
    }

    setLoading(false);
  };

  const submit = async () => {
    fetchData(1, status, title);
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  return (
    <>
      <div className="max-w-[1000px] mx-auto">
        <div className="flex flex-wrap sm:flex-nowrap justify-end gap-5 w-full mb-5">
          <input
            type="text"
            className="w-full input input-bordered focus:outline-none focus:border-primary"
            placeholder={t("Search")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex-none w-full sm:w-auto">
            <div className="flex gap-5 w-full">
              <div className="w-full sm:w-auto">
                <select
                  className="select select-bordered w-full focus:outline-none focus:border-primary"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {postStatuses.map((option) => (
                    <option key={option} value={option}>
                      {t("PostStatus", { option })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-none">
                <button
                  disabled={loading}
                  className="btn btn-primary min-w-24"
                  onClick={() => submit()}
                >
                  {t("Search")}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="relative min-h-10">
          {loading && (
            <div className="col-span-2 flex w-full justify-center absolute h-full z-10">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          )}
          <div id="listList" className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {posts.map((post) => (
              <div
                className="border-dashed border border-base-300 p-5 rounded-box"
                key={`${post.id}${post.ulid}`}
              >
                <div className="flex w-full gap-2 mb-3">
                  <div className="w-full font-semibold">
                    {["reviewing", "published"].includes(post.status) && (
                      <Link
                        href={{
                          pathname: "/posts/[ulid]",
                          params: { ulid: post.ulid },
                        }}
                        className="link hover:text-primary"
                      >
                        {post.title}
                      </Link>
                    )}
                    {!["reviewing", "published"].includes(post.status) && (
                      <div>{post.title}</div>
                    )}
                  </div>
                  <div
                    className={
                      post.status === "pending"
                        ? ""
                        : post.status == "reviewing"
                        ? "text-warning"
                        : post.status == "published"
                        ? "text-success"
                        : "text-error"
                    }
                  >
                    <div className="font-semibold">{post.status_label}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 w-full mb-3">
                  {post.categories.map((category) => (
                    <div
                      className="border border-base-300 p-1 rounded-btn text-sm"
                      key={`${category.id}${category.code}`}
                    >
                      {category.name_locale}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between gap-2 w-full text-xs font-semibold flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <IconHeart className="w-5 h-5" />
                      <div className="ml-2">{post.total_likes}</div>
                    </div>
                    <div className="flex items-center">
                      <IconBxCommentDetail className="w-5 h-5" />
                      <div className="ml-2">{post.total_comments}</div>
                    </div>
                    <div className="flex items-center">
                      <IconEye className="w-5 h-5" />
                      <div className="ml-2">{post.total_views}</div>
                    </div>
                    <div>
                      {t("Allow comments")}:{" "}
                      <span
                        className={
                          post.allow_comment ? "text-success" : "text-error"
                        }
                      >
                        {post.allow_comment ? t("Yes") : t("No")}
                      </span>
                    </div>
                  </div>
                  <div>{convertDateTimeToLocal(post.updated_at)}</div>
                </div>
              </div>
            ))}
            {!loading && !posts.length && (
              <div className="col-span-2 flex w-full justify-center">
                <div>{t("No Posts found")}</div>
              </div>
            )}
          </div>
        </div>
        {!!paginator.count && (
          <div className="flex justify-center gap-5 mt-5">
            <div className="join">
              <button
                className="join-item btn w-14"
                disabled={
                  !paginator.previous_page_url ||
                  loading ||
                  paginator.current_page <= 1
                }
                onClick={() =>
                  fetchData(
                    paginator.current_page - 1,
                    undefined,
                    undefined,
                    true
                  )
                }
              >
                «
              </button>
              <button className="join-item btn">
                {t("Page")} {paginator.current_page ?? 1}
              </button>
              <button
                className="join-item btn w-14"
                disabled={!paginator.next_pageUrl || loading}
                onClick={() =>
                  fetchData(
                    paginator.current_page + 1,
                    undefined,
                    undefined,
                    true
                  )
                }
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
