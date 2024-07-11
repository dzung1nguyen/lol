import createMiddleware from "next-intl/middleware";
import { pathnames, locales, localePrefix } from "./i18nConfig";

export default createMiddleware({
  defaultLocale: "en",
  locales,
  pathnames,
  localePrefix,
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    "/",
    "/((?!_next|api|_vercel|.*\\..*).*)",
    '/(en|fr|de|es|ja|ko|pt|tr|zh-CN|zh-TW|vi|th|id)/:path*'
  ],
};
