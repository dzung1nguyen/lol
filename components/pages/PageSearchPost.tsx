"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePostStore } from "@/providers/post-store-provider";
import { useGlobalStore } from "@/providers/global-store-provider";
import { useTranslations } from "next-intl";
import HomePosts from "../HomePosts";
import { useRouter } from "@/navigation";

export default function PageSearchPost({
  defaultPosts,
  paginator,
  filter,
}: {
  defaultPosts: Model.Post[];
  paginator: Model.Paginator;
  filter: Request.FilterPost;
}) {
  const t = useTranslations("");
  const { search, setPostSearch } = usePostStore((state) => state);
  const { setMobileMenu } = useGlobalStore((state) => state);
  const [searchText, setSearchText] = useState(filter.title ?? "");
  const router = useRouter();

  useEffect(() => {
    setMobileMenu(false);
    if (filter.title) {
      setPostSearch(filter.title ?? "");
    }

    return () => {
      setPostSearch("");
    };
  }, []);

  useEffect(() => {
    setMobileMenu(false);
    setSearchText(search);
  }, [search]);

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    setPostSearch(searchText);
    router.push({
      pathname: "/search",
      query: {
        q: searchText,
      },
    });
  };

  return (
    <>
      <div className="mx-auto flex justify-center w-full max-w-[900px] gap-5">
        <div className="w-full max-w-[600px] flex-none">
          <div className="w-full flex items-center gap-5">
            <input
              type="text"
              className="input input-bordered w-full focus:outline-none"
              placeholder={t("Search")}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={() => handleSearch()}
              className="btn btn-primary min-w-28 float-none"
            >
              {t("Search")}
            </button>
          </div>
          <div className="grid grid-cols-1 mx-auto gap-5 mt-5">
            <HomePosts
              defaultPosts={defaultPosts}
              paginator={paginator}
              filter={{
                ...filter,
                title: search ? search : filter.title,
              }}
            />
          </div>
        </div>
        <div className="hidden lg:block w-full relative">
          <a
            href="https://personal.local"
            target="_blank"
            className="block sticky top-[60px]"
          >
            <Image
              src={"/img/godzillacat-pro.gif"}
              width={280}
              height={280}
              alt="GodzillaCat"
              priority
              unoptimized
            />
          </a>
        </div>
      </div>
    </>
  );
}
