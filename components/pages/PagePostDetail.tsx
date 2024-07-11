"use client";

import Post from "@/components/Post";
import PostComments from "@/components/PostComments";

export default function PagePostDetail({ post }: { post: Model.Post }) {
  return (
    <>
      <div className="max-w-[700px] mx-auto">
        <Post post={post} autoPlay={true} />
        {post.status === "published" && (
          <div id="PostComments">
            <PostComments post={post} />
          </div>
        )}
      </div>
    </>
  );
}
