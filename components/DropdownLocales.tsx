"use client";

import { useLocale, useTranslations } from "next-intl";
import { locales } from "../i18nConfig";
import { useParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useRouter, usePathname } from "../navigation";
import LaravelApiRequest from "@/utils/LaravelApiRequest";

export default function DropdownLocales({
  langkey,
  className,
}: {
  langkey: "LocaleShort" | "LocaleFull";
  className?: string;
}) {
  const t = useTranslations("");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  const setLocale = (nextLocale: string) => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
    });
  };

  useEffect(() => {
    LaravelApiRequest.locale(locale);
  }, [locale]);

  return (
    <div
      className={`dropdown dropdown-end w-full ${
        isPending ? "pointer-events-none" : ""
      }`}
    >
      <div tabIndex={0} role="button" className={className ?? "bg-base-100 border border-base-300 rounded-btn hover:bg-neutral hover:text-neutral-content"}>
        <div className="flex whitespace-nowrap">
          {t(langkey, { locale: locale.replaceAll("-", "_") })}
        </div>
        <svg
          width="12px"
          height="12px"
          className="h-2 w-2 fill-current opacity-60 inline-block"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-fit"
      >
        {locales.map((locale) => (
          <li key={locale}>
            <a
              className="flex items-center whitespace-nowrap"
              onClick={() => setLocale(locale)}
            >
              {t(langkey, { locale: locale.replaceAll("-", "_") })}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
