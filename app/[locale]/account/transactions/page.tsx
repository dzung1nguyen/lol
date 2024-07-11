"use client";

import { useTranslations } from "next-intl";

export default function IndexPage() {
  const t = useTranslations("");

  return (
    <>
      <div className="max-w-[700px] mx-auto">
        <div className="text-center flex items-center justify-center">
          {t("Coming soon")}
        </div>
      </div>
    </>
  );
}
