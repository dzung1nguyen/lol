"use client";

import IconHeart from "@/components/icons/IconHeart";
import { Link } from "@/navigation";
import { convertDateTimeToLocal, scrollToDiv } from "@/utils";
import LaravelApiRequest from "@/utils/LaravelApiRequest";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function CommentPage() {
  const t = useTranslations("");
  const [title, setTitle] = useState("");
  const [comments, setComments] = useState<Model.Comment[]>([]);
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

  const fetchData = async (page: number, title?: string, scroll?: boolean) => {
    const pagrams: Record<string, string | number | undefined> = {
      page,
      title: title,
    };

    setLoading(true);

    const { data } = await LaravelApiRequest.get(
      `/api/private/comments`,
      pagrams
    );

    setComments(data?.comments?.data ?? []);

    setPaginator((prevPaginator) => ({
      ...prevPaginator,
      ...(data?.comments?.paginator ?? null),
    }));

    if (scroll) {
      scrollToDiv("listList");
    }

    setLoading(false);
  };

  const submit = async () => {
    fetchData(1, title);
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  return (
    <>
      <div className="max-w-[1000px] mx-auto">
        <div className="flex justify-end gap-5 w-full mb-5">
          <input
            type="text"
            className="w-full input input-bordered focus:outline-none focus:border-primary"
            placeholder={t("Search")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
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

        <div className="relative min-h-10">
          {loading && (
            <div className="col-span-2 flex w-full justify-center absolute h-full z-10">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          )}
          <div id="listList" className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {comments.map((comment) => (
              <div
                className="border-dashed border border-base-300 p-5 rounded-box"
                key={`${comment.id}${comment.ulid}`}
              >
                <div className="w-full mb-3">{comment.content}</div>
                <div className="w-full text-sm font-semibold mb-3">
                  <Link
                    href={{
                      pathname: "/posts/[ulid]",
                      params: { ulid: comment?.post?.ulid! },
                    }}
                    className="link"
                  >
                    {comment.post?.title}
                  </Link>
                </div>
                <div className="flex justify-between gap-2 w-full text-xs font-semibold">
                  <div className="flex items-center">
                    <IconHeart className="w-5 h-5" />
                    <div className="ml-2">{comment.total_likes}</div>
                  </div>
                  <div>{convertDateTimeToLocal(comment.created_at)}</div>
                </div>
              </div>
            ))}

            {!loading && !comments.length && (
              <div className="col-span-2 flex w-full justify-center">
                <div>{t("No Comments found")}</div>
              </div>
            )}
          </div>
        </div>
        {!!paginator.count && (
          <div className="flex justify-center mt-5">
            <div className="join">
              <button
                className="join-item btn w-14"
                disabled={
                  !paginator.previous_page_url ||
                  loading ||
                  paginator.current_page <= 1
                }
                onClick={() =>
                  fetchData(paginator.current_page - 1, undefined, true)
                }
              >
                «
              </button>
              <button className="join-item btn">
                {t("Page")} {paginator.current_page ?? 1}
              </button>
              <button
                className="join-item btn w-14"
                disabled={!paginator.has_more_pages || loading}
                onClick={() =>
                  fetchData(paginator.current_page + 1, undefined, true)
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
