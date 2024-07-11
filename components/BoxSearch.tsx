"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useRouter } from "@/navigation";
import IconSearch from "./icons/IconSearch";
import { usePostStore } from "@/providers/post-store-provider";

export default function BoxSearch() {
  const t = useTranslations("");
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const { search, setPostSearch } = usePostStore((state) => state);

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (!searchText) {
      return false;
    }
    setPostSearch(searchText);
    router.push({
      pathname: "/search",
      query: {
        q: searchText,
      },
    });
  };

  useEffect(() => {
    setSearchText(search);
  }, [search]);

  return (
    <>
      <label className="relative flex items-center gap-2 h-10">
        <input
          type="text"
          className="h-full w-full rounded-btn pl-2 pr-8 border border-base-300 bg-transparent xl:text-right xl:border-transparent xl:focus:border-base-300 focus:outline-none "
          placeholder={t("Search")}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <div className="absolute h-full flex justify-center right-1">
          <button className="text-center px-1" onClick={() => handleSearch()}>
            <IconSearch className="w-5 h-5 flex-none" />
          </button>
        </div>
      </label>
    </>
  );
}
