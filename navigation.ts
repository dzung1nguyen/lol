import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';
import {locales, pathnames, localePrefix} from './i18nConfig';

export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({
    locales,
    pathnames,
    localePrefix
  });
