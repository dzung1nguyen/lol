"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { Link } from "@/navigation";
import IconPen from "./icons/IconPen";
import { useGlobalStore } from "@/providers/global-store-provider";

export default function BtnNewPost() {
  const t = useTranslations("");
  const { authenticated } = useGlobalStore((state) => state);

  const showModal = () => {
    const modal = document.getElementById("loginModal");
    // @ts-ignore
    if (modal && modal?.show) {
      // @ts-ignore
      modal?.show();
    }
  };

  return (
    <>
      {!authenticated && (
        <div
          className="w-full xl:w-auto tooltip tooltip-bottom"
          data-tip={t("Please login to continue")}
        >
          <button onClick={() => showModal()} className="w-full xl:w-auto btn h-10 min-h-10 btn-secondary">
            <IconPen className="h-4 w-4" />
            <span>{t("New Post")}</span>
          </button>
        </div>
      )}
      {authenticated && (
        <Link
          href="/account/posts/create"
          className="w-full xl:w-auto btn h-10 min-h-10 btn-secondary"
        >
          <span>{t("New Post")}</span>
          <IconPen className="h-4 w-4" />
        </Link>
      )}
    </>
  );
}
