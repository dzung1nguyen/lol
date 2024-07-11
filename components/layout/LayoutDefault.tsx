"use client";

import { ReactNode, useEffect, useState } from "react";
import Header from "./Header";
import { useLocale } from "next-intl";
import { getDefaultTheme } from "@/utils";
import LeftMenu from "./LeftMenu";
import LaravelApiRequest from "@/utils/LaravelApiRequest";
import { useGlobalStore } from "@/providers/global-store-provider";
import BackToTopButton from "./BackToTopButton";
import Footer from "./Footer";
import ModalLogin from "./ModalLogin";
import { usePathname } from "next/navigation";
import { usePostStore } from "@/providers/post-store-provider";

type Props = {
  children?: ReactNode;
  data: {
    categories: Model.Category[];
  };
};

export default function LayoutDefault({ data, children }: Props) {
  const [theme, setTheme] = useState<string | null>(null);
  const locale = useLocale();
  const pathname = usePathname();

  const { loading, mobileMenu, setMobileMenu, authenticated } = useGlobalStore(
    (state) => state
  );
  const { setCategories } = usePostStore((state) => state);

  useEffect(() => {
    setCategories(data.categories);
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", (e) => {
      const theme = getDefaultTheme();
      setTheme(theme);
    });
  }, []);

  useEffect(() => {
    LaravelApiRequest.locale(locale);
  }, [locale]);

  useEffect(() => {
    setMobileMenu(false);
  }, [pathname]);

  return (
    <>
      <div data-theme={theme}>
        <div className="bg-base-100 text-base-content w-full relative z-50 min-h-screen">
          <Header />
          <div className="container mx-auto px-5 pt-[60px] relative">
            <div className="flex w-full relative">
              <div
                className={`${
                  mobileMenu ? "" : "hidden"
                } menu-left left-0 md:left-auto shadow-lg fixed bg-base-200 w-[280px] z-10 xl:bg-base-100 flex-none xl:shadow-none xl:block xl:w-[280px] h-[calc(100vh-60px)] xl:border-r xl:border-base-200`}
              >
                <div className="relative z-10 bg-base-200 xl:bg-base-100">
                  <LeftMenu categories={data.categories} />
                </div>
                <div
                  className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 xl:hidden"
                  onClick={() => setMobileMenu(false)}
                ></div>
              </div>
              <div className="w-full pt-5 xl:w-[calc(100%-280px)] xl:ml-[280px]">
                <div className="relative xl:min-h-[calc(100vh-60px-600px)]">
                  {children}
                </div>
                <div className="relative mt-16">
                  <Footer />
                </div>
              </div>
            </div>
          </div>
        </div>
        {authenticated === false && <ModalLogin />}
        <BackToTopButton />
        {loading && (
          <div className="fixed top-0 left-0 w-full h-full z-[999] bg-neutral bg-opacity-90 flex items-center justify-center">
            <span className="loading loading-bars loading-lg text-neutral-content"></span>
          </div>
        )}
      </div>
    </>
  );
}
