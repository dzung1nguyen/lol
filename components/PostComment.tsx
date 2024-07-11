"use client";

import { useEffect, useState } from "react";
import TimeAgo from "./TimeAgo";

export default function PostComment({ comment }: { comment: Model.Comment }) {
  const [readMore, setReadMore] = useState(true);

  const handleShowMore = () => {
    if (comment.content.length <= 300) {
      setReadMore(true);
    } else {
      setReadMore(!readMore);
    }
  };

  useEffect(() => {
    if (comment.content.length > 300) {
      setReadMore(false);
    }
  }, [comment]);

  return (
    <>
      <div
        className="border border-base-300 border-dashed overflow-hidden rounded-box p-3 hover:cursor-pointer select-none"
        onClick={() => handleShowMore()}
      >
        <div
          className={`${readMore ? "" : "line-clamp-3"}`}
          style={{ overflowWrap: "anywhere" }}
        >
          {comment.content}
        </div>
        <div className="flex w-full justify-between mt-3">
          <div className="text-secondary font-semibold text-sm">
            {comment.wallet?.name}
          </div>
          <div className="font-semibold text-sm">
            <TimeAgo value={comment.created_at} />
          </div>
        </div>
      </div>
    </>
  );
}
