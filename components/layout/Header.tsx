"use client";

import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { Link } from "@/navigation";
import LoginButton from "../LoginButton";
import { useGlobalStore } from "@/providers/global-store-provider";
import BoxSearch from "../BoxSearch";
import BtnNewPost from "../BtnNewPost";
import DropdownLocales from "../DropdownLocales";
import Image from "next/image";

export default function Header() {
  const t = useTranslations("");
  const { mobileMenu, setMobileMenu } = useGlobalStore((state) => state);

  useEffect(() => {
    if (mobileMenu) {
      if (!document?.body?.classList.contains("max-xl:overflow-hidden")) {
        document?.body?.classList.add("max-xl:overflow-hidden");
      }
    } else {
      if (document?.body?.classList.contains("max-xl:overflow-hidden")) {
        document?.body?.classList.remove("max-xl:overflow-hidden");
      }
    }
  }, [mobileMenu]);

  return (
    <div className="fixed top-0 left-0 w-full bg-base-100 z-20 border-b border-base-300">
      <div className="relative container mx-auto px-5">
        <div className="max-xl:overflow-hidden hidden"></div>
        <div className="flex justify-between items-center py-1 h-[59px]">
          <div className="flex items-center gap-5">
            <div className="block xl:hidden">
              <div
                id="hamburger"
                onClick={() => setMobileMenu(!mobileMenu)}
                className={`${
                  mobileMenu ? "open" : ""
                } hamburger select-none hover:cursor-pointer`}
              >
                <div className="icon bg-primary before:bg-primary after:bg-primary"></div>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center relative py-3 font-extrabold text-primary"
            >
              {process.env.NEXT_PUBLIC_APP_NAME!}
            </Link>
            <Link
              href={{
                pathname: "/pages/[slug]",
                params: { slug: "about-us" },
              }}
              className="font-semibold hover:text-primary hidden sm:flex items-center gap-1 text-sm"
            >
              <Image
                src="/img/logo.webp"
                width={20}
                height={20}
                alt={process.env.NEXT_PUBLIC_APP_NAME!}
              />
              {t("About Us")}
            </Link>
          </div>
          <div
            id="menu"
            className={`bg-base-100 text-lg static block w-auto ml-auto`}
          >
            <ul className="flex items-center py-0 flex-row gap-4">
              <li className="hidden xl:block">
                <BoxSearch />
              </li>
              <li className="hidden lg:block">
                <DropdownLocales
                  langkey="LocaleShort"
                  className="bg-base-100 border border-base-300 rounded-btn hover:bg-neutral hover:text-neutral-content flex items-center gap-1 justify-center whitespace-nowrap h-10 min-h-10 px-4 text-sm font-semibold"
                />
              </li>
              <li className="hidden md:block">
                <BtnNewPost />
              </li>
              <li>
                <LoginButton />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
