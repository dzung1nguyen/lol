import { Pathnames } from "next-intl/navigation";

export const locales = [
  "en",
  "fr",
  "de",
  "es",
  "ja",
  "ko",
  "pt",
  "tr",
  "zh-CN",
  "zh-TW",
  "vi",
  "th",
  "id",
] as const;

export const pathnames = {
  "/": "/",
  "/home": "/home",
  "/hot": "/hot",
  "/trending": "/trending",
  "/new": "/new",
  "/search": "/search",
  "/category/[code]": "/category/[code]",
  "/author/[ulid]": "/author/[ulid]",
  //
  "/posts/[ulid]": "/posts/[ulid]",
  "/pages/[slug]": "/pages/[slug]",
  //
  "/account": "/account",
  "/account/posts": "/account/posts",
  "/account/posts/create": "/account/create/create",
  "/account/comments": "/account/comments",
  "/account/transactions": "/account/transactions",
  //
  "/auth/login": "/auth/login",
} satisfies Pathnames<typeof locales>;

// Use the default: `always`
export const localePrefix = undefined;

export type AppPathnames = keyof typeof pathnames;
