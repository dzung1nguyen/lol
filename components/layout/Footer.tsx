"use client";

import { useTranslations } from "next-intl";
import Channels from "./Channels";
import { Link } from "@/navigation";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations("");

  return (
    <>
      {/* <div className="font-bold xl:text-xl text-center">
        🇺🇦 | We <span className="text-2xl">❤️</span> Ukraine. To support Ukraine
        in their time of need, visit this{" "}
        <a
          href="https://war.ukraine.ua/support-ukraine/"
          className="underline hover:text-primary"
          target="_blank"
        >
          page
        </a>
        .
      </div> */}
      <div className="py-10 px-5 bg-base-200 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-5">
          <div className="sm:col-span-3 xl:col-span-2">
            <div className="text-center sm:text-left flex flex-col sm:flex-row items-center w-full gap-3">
              <div>
                <Link href="/" title="GodCat.lol" className="inline-block">
                  <Image
                    src="/img/logo.webp"
                    width={120}
                    height={120}
                    alt="GodCat.lol"
                  />
                </Link>
              </div>
              <div>
                <h1 className="text-lg 2xl:text-2xl font-bold">
                  {t.rich("Welcome to GodCat", {
                    span: (chunks) => (
                      <span className="text-primary">{chunks}</span>
                    ),
                  })}
                </h1>
                <p className="font-semibold">
                  {t("Where laughter meets blockchain")}
                </p>
                <p className="italic mt-4 text-sm">
                  {t.rich("A product from the Godzilla Cat family", {
                    link: (chunks) => (
                      <a
                        target="_blank"
                        className="link font-semibold text-secondary"
                        href="https://personal.local"
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="text-center sm:text-left flex flex-col gap-2">
            <h6 className="font-semibold">GodCat</h6>
            <ul className="grid grid-cols-1 gap-3">
              <li>
                <Link
                  href="/"
                  title={t("Home")}
                  className="hover:text-primary hover:link"
                >
                  {t("Home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/hot"
                  title={t("Hot")}
                  className="hover:text-primary hover:link"
                >
                  {t("Hot")}
                </Link>
              </li>
              <li>
                <Link
                  href="/trending"
                  title={t("Trending")}
                  className="hover:text-primary hover:link"
                >
                  {t("Trending")}
                </Link>
              </li>
              <li>
                <Link
                  href={{
                    pathname: "/pages/[slug]",
                    params: { slug: "about-us" },
                  }}
                  title={t("About Us")}
                  className="hover:text-primary hover:link"
                >
                  {t("About Us")}
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-center sm:text-left flex flex-col gap-2">
            <h6 className="font-semibold">{t("Account")}</h6>
            <ul className="grid grid-cols-1 gap-3">
              <li>
                <Link
                  href="/account/posts/create"
                  title={t("New Post")}
                  className="hover:text-primary hover:link"
                >
                  {t("New Post")}
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  title={t("Profile")}
                  className="hover:text-primary hover:link"
                >
                  {t("Profile")}
                </Link>
              </li>
              <li>
                <Link
                  href="/account/posts"
                  title={t("My Posts")}
                  className="hover:text-primary hover:link"
                >
                  {t("My Posts")}
                </Link>
              </li>
              <li>
                <Link
                  href="/account/comments"
                  title={t("My Comments")}
                  className="hover:text-primary hover:link"
                >
                  {t("My Comments")}
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-center sm:text-left flex flex-col gap-2">
            <h6 className="font-semibold">{t("Legal")}</h6>
            <ul className="grid grid-cols-1 gap-3">
              <li>
                <Link
                  href={{
                    pathname: "/pages/[slug]",
                    params: { slug: "commenting-guidelines" },
                  }}
                  title={t("Commenting Guidelines")}
                  className="hover:text-primary hover:link"
                >
                  {t("Commenting Guidelines")}
                </Link>
              </li>
              <li>
                <Link
                  href={{
                    pathname: "/pages/[slug]",
                    params: { slug: "posting-guidelines" },
                  }}
                  title={t("Posting Guidelines")}
                  className="hover:text-primary hover:link"
                >
                  {t("Posting Guidelines")}
                </Link>
              </li>
              <li>
                <Link
                  href={{
                    pathname: "/pages/[slug]",
                    params: { slug: "terms-and-policies" },
                  }}
                  title={t("Terms and Policies")}
                  className="hover:text-primary hover:link"
                >
                  {t("Terms and Policies")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto pt-8 text-center font-secondary">
          <div className="flex gap-3 sm:gap-5 mx-auto w-full justify-center mb-5">
            <Channels />
          </div>
          <div className="text-lg font-semibold">
            © 2024 Godzilla Cat - {t("All rights reserved")}
          </div>
        </div>
      </div>
    </>
  );
}
