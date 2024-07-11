import IconFilter from "./icons/IconFilter";
import { usePostStore } from "@/providers/post-store-provider";
import { postSourceTypes } from "@/config";
import { useTranslations } from "next-intl";

export default function PostSourceType() {
  const t = useTranslations("");
  const { sourceType, setSourceType } = usePostStore((state) => state);

  const handleFilter = (value: string) => {
    if (sourceType === value) {
      return false;
    }
    setSourceType(value);

    if (document?.activeElement instanceof HTMLElement) {
      document?.activeElement?.blur();
    }
  };

  return (
    <>
      <div className="dropdown dropdown-bottom dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="border border-base-300 rounded-btn flex items-center gap-1 justify-center whitespace-nowrap text-sm font-semibold hover:bg-neutral hover:text-neutral-content h-10 px-2 w-fit "
        >
          <IconFilter className="h-5 w-5" />
          <div className="ml-1 hidden sm:block">{t("PostSourceType", { option: sourceType })}</div>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-btn w-fit"
        >
          {postSourceTypes.map((option) => (
            <li key={option}>
              <a
                onClick={() => handleFilter(option)}
                className={option === sourceType ? "active" : ""}
              >
                <span className="whitespace-nowrap">
                  {t("PostSourceType", { option })}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
