"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { useRouter } from "@/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import NextApiRequest from "@/utils/NextApiRequest";
import LaravelApiRequest from "@/utils/LaravelApiRequest";
import { useGlobalStore } from "@/providers/global-store-provider";
import IconUser from "./icons/IconUser";

export default function LoginButton() {
  const t = useTranslations("");
  const { data: session, status } = useSession();
  const router = useRouter();
  const { authenticated, setAuthenticated, setLoading } = useGlobalStore(
    (state) => state
  );

  const getToken = async () => {
    if (status === "unauthenticated") {
      setAuthenticated(false);
    }
    if (status === "authenticated") {
      const response = await NextApiRequest.post("/api/auth/token");
      if (response?.token) {
        LaravelApiRequest.auth(response.token);
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        logOut();
      }
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await LaravelApiRequest.post("/api/auth/logout");
      await signOut();
    } catch (e) {
      setLoading(false);
      console.log("logOut", e);
    }
  };

  useEffect(() => {
    getToken();
  }, [status]);

  const handleMenuAccount = (value: string) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    // @ts-ignore
    router.push(value);
  };

  const showModal = () => {
    const modal = document.getElementById("loginModal");
    // @ts-ignore
    if (modal && modal?.show) {
      // @ts-ignore
      modal?.show();
    }
  };

  return (
    <>
      {authenticated === undefined && (
        <button className="btn border-base-300 btn-outline hover:border-base-300 hover:bg-neutral hover:text-neutral-content h-10 min-h-10 whitespace-nowrap">
          <IconUser className="h-5 w-5" />
          <span>{t("Loading")}</span>
        </button>
      )}
      {authenticated === false && (
        <button
          onClick={() => showModal()}
          className="btn border-base-300 btn-outline hover:border-base-300 hover:bg-neutral hover:text-neutral-content h-10 min-h-10 whitespace-nowrap"
        >
          <IconUser className="h-5 w-5" />
          <span>{t("Login")}</span>
        </button>
      )}
      {authenticated && (
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="border border-base-300 rounded-btn flex items-center gap-1 justify-center whitespace-nowrap h-10 min-h-10 px-4 text-sm font-semibold hover:bg-neutral hover:text-neutral-content"
          >
            <IconUser className="h-5 w-5" />{" "}
            <span className="hidden sm:block">{session?.user?.name}</span>
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
            className="menu dropdown-content mt-2 z-[1] p-2 shadow bg-base-100 rounded-box w-fit min-w-48"
          >
            <li className="md:hidden">
              <a
                className="font-bold"
                onClick={() => handleMenuAccount("/account/posts/create")}
              >
                {t("New Post")}
              </a>
            </li>
            <li>
              <a
                className="font-bold"
                onClick={() => handleMenuAccount("/account")}
              >
                {t("Profile")}
              </a>
            </li>
            <li>
              <a
                className="font-bold"
                onClick={() => handleMenuAccount("/account/posts")}
              >
                {t("Posts")}
              </a>
            </li>
            <li>
              <a
                className="font-bold"
                onClick={() => handleMenuAccount("/account/comments")}
              >
                {t("Comments")}
              </a>
            </li>
            <li>
              <a className="text-error font-bold" onClick={() => logOut()}>
                {t("Logout")}
              </a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
