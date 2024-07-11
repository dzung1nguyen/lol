"use client";

import { useTranslations } from "next-intl";
import IconBxTrendingUp from "../icons/IconBxTrendingUp";
import IconHeart from "../icons/IconHeart";
import IconHome from "../icons/IconHome";
import { Link, usePathname } from "@/navigation";
import { usePostStore } from "@/providers/post-store-provider";
import BoxSearch from "../BoxSearch";
import BtnNewPost from "../BtnNewPost";
import DropdownLocales from "../DropdownLocales";
import Image from "next/image";

export default function LeftMenu({
  categories,
}: {
  categories: Model.Category[];
}) {
  const path = usePathname();
  const t = useTranslations("");
  const { activeCategory } = usePostStore((state) => state);

  return (
    <>
      <div className="max-h-[calc(100vh-60px)] overflow-x-hidden overflow-y-auto scrollable-div py-5 px-1">
        <div className="grid grid-cols-1 gap-5">
          <ul className="menu rounded-box p-0">
            <li>
              <Link
                href="/"
                className={`font-bold ${path === "/" ? "active" : ""}`}
              >
                <IconHome className="h-5 w-5" />
                {t("Home")}
              </Link>
            </li>
            <li>
              <Link
                href="/hot"
                className={`font-bold ${path === "/hot" ? "active" : ""}`}
              >
                <IconHeart className="h-5 w-5" />
                {t("Hot")}
              </Link>
            </li>
            <li>
              <Link
                href="/trending"
                className={`font-bold ${path === "/trending" ? "active" : ""}`}
              >
                <IconBxTrendingUp className="h-5 w-5" />
                {t("Trending")}
              </Link>
            </li>
            <li className="block sm:hidden">
              <Link
                href={{
                  pathname: "/pages/[slug]",
                  params: { slug: "about-us" },
                }}
                className={`font-bold`}
              >
                <Image
                  src="/img/logo.webp"
                  width={20}
                  height={20}
                  alt={process.env.NEXT_PUBLIC_APP_NAME!}
                />
                {t("About Us")}
              </Link>
            </li>
          </ul>
          <ul className="lg:border lg:border-base-300 px-4 lg:py-4 lg:rounded-box w-full xl:hidden flex-col flex gap-3">
            <li>
              <BoxSearch />
            </li>
            <li>
              <BtnNewPost />
            </li>
            <li>
              <DropdownLocales
                langkey="LocaleFull"
                className="w-full border border-base-300 rounded-btn flex items-center gap-1 justify-center whitespace-nowrap h-10 min-h-10 px-4 text-sm font-semibold hover:bg-neutral hover:text-neutral-content"
              />
            </li>
          </ul>
          <ul className="menu rounded-box p-0">
            <li>
              <h2 className="menu-title">{t("Categories")}</h2>
              <ul>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={{
                        pathname: "/category/[code]",
                        params: { code: category.code },
                      }}
                      className={
                        category.code === activeCategory?.code ? "active" : ""
                      }
                    >
                      {category.name_locale}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
        <div className="h-10"></div>
      </div>
    </>
  );
}
