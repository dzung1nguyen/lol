"use client";

import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";

export default function AccountBar() {
  const path = usePathname();
  const t = useTranslations("");

  return (
    <div className="pb-2 sm:pb-0 flex w-full overflow-x-auto sm:border-b sm:border-base-300 gap-y-3 gap-x-4 sm:gap-y-0 sm:gap-x-5">
      <Link
        href="/account"
        className={`font-semibold whitespace-nowrap text-sm sm:text-base border border-base-300 flex items-center px-4 py-2 rounded-btn sm:rounded-none sm:px-0 sm:py-0 sm:border-0 sm:pb-2 sm:border-b-2 ${
          path === "/account" ? "text-primary border-primary" : "sm:border-b-transparent"
        }`}
      >
        {t("Profile")}
      </Link>
      <Link
        href="/account/posts"
        className={`font-semibold whitespace-nowrap text-sm sm:text-base border border-base-300 flex items-center px-4 py-2 rounded-btn sm:rounded-none sm:px-0 sm:py-0 sm:border-0 sm:pb-2 sm:border-b-2 ${
          path === "/account/posts"
            ? "text-primary border-primary"
            : "sm:border-b-transparent"
        }`}
      >
        {t("Posts")}
      </Link>
      <Link
        href="/account/comments"
        className={`font-semibold whitespace-nowrap text-sm sm:text-base border border-base-300 flex items-center px-4 py-2 rounded-btn sm:rounded-none sm:px-0 sm:py-0 sm:border-0 sm:pb-2 sm:border-b-2 ${
          path === "/account/comments"
            ? "text-primary border-primary"
            : "sm:border-b-transparent"
        }`}
      >
        {t("Comments")}
      </Link>
      <Link
        href="/account/transactions"
        className={`font-semibold whitespace-nowrap text-sm sm:text-base border border-base-300 flex items-center px-4 py-2 rounded-btn sm:rounded-none sm:px-0 sm:py-0 sm:border-0 sm:pb-2 sm:border-b-2 ${
          path === "/account/transactions"
            ? "text-primary border-primary"
            : "sm:border-b-transparent"
        }`}
      >
        {t("Transactions")}
      </Link>
    </div>
  );
}
