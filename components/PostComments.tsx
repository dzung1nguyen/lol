"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import LaravelApiRequest from "@/utils/LaravelApiRequest";
import PostComment from "./PostComment";
import { scrollToDiv } from "@/utils";
import { useGlobalStore } from "@/providers/global-store-provider";
import { Link } from "@/navigation";

export default function PostComments({ post }: { post: Model.Post }) {
  const t = useTranslations("");
  const textAreaRef = useRef<any>(null);
  const [currentValue, setCurrentValue] = useState("");
  const { authenticated } = useGlobalStore((state) => state);

  const defaultStyle = {};

  const [hotComment, setHotComment] = useState(false);
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
  const [sending, setSending] = useState(false);

  const fetchData = async (
    page: number,
    hotComment: boolean,
    scroll = false
  ) => {
    const order = hotComment ? "hot" : "latest";
    const pagrams: Record<string, string | number> = {
      page,
      order,
    };

    setLoading(true);

    const { data } = await LaravelApiRequest.get(
      `/api/posts/${post.ulid}/comments`,
      pagrams
    );

    setComments(data?.comments?.data ?? []);

    setPaginator((prevPaginator) => ({
      ...prevPaginator,
      ...(data?.comments?.paginator ?? null),
    }));

    if (scroll) {
      scrollToDiv("listComments");
    }

    setLoading(false);
  };

  const handleSubmit = async () => {
    setSending(true);
    const input = {
      content: currentValue,
    };
    const response = await LaravelApiRequest.post(
      `/api/private/posts/${post.ulid}/comments`,
      input
    );

    if (response.success) {
      setComments((prevComents) => [response.data.comment, ...prevComents]);
      setCurrentValue("");
    } else {
      alert(response.message);
    }
    setSending(false);
  };

  useEffect(() => {
    fetchData(1, hotComment);
  }, [hotComment]);

  useEffect(() => {
    if (textAreaRef?.current) {
      textAreaRef.current.style.height = "24px";
      const { scrollHeight } = textAreaRef.current;
      textAreaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [textAreaRef, currentValue]);

  return (
    <>
      <hr className="my-8 border-base-300" />

      {post.allow_comment && authenticated && (
        <div>
          <div className="italic text-sm mb-2">
            {t.rich(
              "Remember to keep comments respectful and to follow our guidelines",
              {
                link: (chunks) => (
                  <Link
                    target="_blank"
                    className="link text-secondary"
                    href={{
                      pathname: "/pages/[slug]",
                      params: { slug: "commenting-guidelines" },
                    }}
                  >
                    {chunks}
                  </Link>
                ),
              }
            )}
          </div>
          <div className="relative mb-5">
            {sending && (
              <div className="flex w-full l-0 t-0 h-full absolute items-center justify-center">
                <span className="loading loading-dots loading-lg"></span>
              </div>
            )}
            <div className="max-h-[288px] border border-base-300 rounded-btn overflow-x-hidden w-full overflow-y-auto">
              <div className="p-3">
                <textarea
                  ref={textAreaRef}
                  style={defaultStyle}
                  rows={1}
                  value={currentValue}
                  placeholder={t("Leave a comment")}
                  className="bg-transparent w-full min-h-6 focus:min-h-12 border-0 block overflow-hidden resize-none focus:outline-none"
                  onChange={(e) => setCurrentValue(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="flex w-full justify-between mt-2">
              <div
                className={`${
                  currentValue.trim().length > 500 ? "text-error" : ""
                }`}
              >
                {currentValue.trim().length} / 500
              </div>
              <div className="flex gap-3">
                {currentValue.trim().length > 0 && (
                  <button
                    className="btn btn-outline btn-error h-9 min-h-9"
                    onClick={() => setCurrentValue("")}
                  >
                    {t("Cancel")}
                  </button>
                )}
                <button
                  onClick={() => handleSubmit()}
                  disabled={
                    sending || loading || currentValue.trim().length < 3
                  }
                  className="btn btn-primary h-9 min-h-9 min-w-28"
                >
                  {sending && <span className="loading loading-spinner"></span>}
                  {t("Send")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {comments.length > 0 && (
        <div className="flex w-full justify-start pb-5 gap-2">
          <label
            htmlFor="hotComments"
            className={`font-semibold ${hotComment ? "text-secondary" : ""}`}
          >
            {t("Hot comments")}
          </label>
          <input
            type="checkbox"
            id="hotComments"
            disabled={loading}
            checked={hotComment}
            className="toggle toggle-secondary"
            onChange={(e) => setHotComment(e.target.checked)}
          />
        </div>
      )}
      {loading && (
        <div className="flex w-full justify-center">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      )}
      <div id="listComments" className="grid grid-cols-1 gap-5">
        {comments.map((comment) => (
          <PostComment comment={comment} key={`${comment.id}${comment.ulid}`} />
        ))}
        {!loading && !comments.length && (
          <div className="flex w-full justify-center">
            <div>{t("No Comments found")}</div>
          </div>
        )}
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
                fetchData(paginator.current_page - 1, hotComment, true)
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
                fetchData(paginator.current_page + 1, hotComment, true)
              }
            >
              »
            </button>
          </div>
        </div>
      )}
    </>
  );
}
