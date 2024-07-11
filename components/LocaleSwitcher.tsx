import { useLocale, useTranslations } from "next-intl";
import { locales } from "../i18nConfig";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";
import { useEffect } from "react";
import LaravelApiRequest from "@/utils/LaravelApiRequest";

export default function LocaleSwitcher() {
  const t = useTranslations("");
  const locale = useLocale();

  useEffect(() => {
    LaravelApiRequest.locale(locale);
  }, [locale]);

  return (
    <LocaleSwitcherSelect defaultValue={locale}>
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {t("LocaleShort", { locale: locale.replaceAll('-', '_') })}
        </option>
      ))}
    </LocaleSwitcherSelect>
  );
}
