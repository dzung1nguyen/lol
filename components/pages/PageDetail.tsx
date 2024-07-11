"use client";

import { convertDateTimeToLocal } from "@/utils";
import { useTranslations } from "next-intl";

export default function PageDetail({
  html,
  updated_at,
}: {
  html: string;
  updated_at: string;
}) {
  const t = useTranslations("");

  return (
    <>
      <div className="max-w-[700px] mx-auto">
        <>
          <article
            className="prose"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div className="text-right mt-5 text-sm font-semibold">
            {t("Updated at")} {convertDateTimeToLocal(updated_at)}
          </div>
        </>
      </div>
    </>
  );
}
