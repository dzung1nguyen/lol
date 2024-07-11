import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import PostSourceType from "./PostSourceType";

export default function HomeBar() {
  const t = useTranslations("");
  const path = usePathname();

  return (
    <div className="flex w-full items-center gap-3">
      <div className="overflow-x-auto flex items-top w-full gap-5 sm:gap-7">
        <Link
          href="/"
          className={`font-semibold whitespace-nowrap sm:text-lg pb-2 border-b-[3px] ${
            path === "/"
              ? "text-primary border-primary"
              : "border-b-transparent"
          }`}
        >
          {t("Home")}
        </Link>
        <Link
          href="/hot"
          className={`font-semibold whitespace-nowrap sm:text-lg pb-2 border-b-[3px] ${
            path === "/hot"
              ? "text-primary border-primary"
              : "border-b-transparent"
          }`}
        >
          {t("Hot")}
        </Link>
        <Link
          href="/trending"
          className={`font-semibold whitespace-nowrap sm:text-lg pb-2 border-b-[3px] ${
            path === "/trending"
              ? "text-primary border-primary"
              : "border-b-transparent"
          }`}
        >
          {t("Trending")}
        </Link>
      </div>
      <div className="flex-none">
        <PostSourceType />
      </div>
    </div>
  );
}
