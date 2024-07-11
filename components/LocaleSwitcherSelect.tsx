"use client";

import clsx from "clsx";
import { useParams } from "next/navigation";
import { ChangeEvent, ReactNode, useTransition } from "react";
import { useRouter, usePathname } from "../navigation";

type Props = {
  children: ReactNode;
  defaultValue: string;
};

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
    });
  }

  return (
    <label
      className={clsx(
        " bg-base-100 flex border px-2 h-[38px] items-center rounded-btn",
        isPending && "transition-opacity [&:disabled]:opacity-30"
      )}
    >
      <div className="relative">
        <select
          className="inline-flex appearance-none bg-base-100 pr-5 border-none outline-none text-sm font-semibold"
          defaultValue={defaultValue}
          disabled={isPending}
          onChange={onSelectChange}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute right-1 top-2">
          <svg
            fill="currentColor"
            viewBox="0 0 16 16"
            height="12px"
            width="12px"
          >
            <path
              fillRule="evenodd"
              d="M1.646 4.646a.5.5 0 01.708 0L8 10.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z"
            />
          </svg>
        </span>
      </div>
    </label>
  );
}
