"use client";

import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import IconWallet from "./icons/IconWallet";
import IconGoogle from "./icons/IconGoogle";
import ConnectWallet from "./ConnectWallet";
import LoginWalletButton from "./LoginWalletButton";
import { useGlobalStore } from "@/providers/global-store-provider";
import LaravelApiRequest from "@/utils/LaravelApiRequest";
import { useParams } from "next/navigation";
import { Link, usePathname } from "@/navigation";

export default function LoginForm() {
  const t = useTranslations("");
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();
  const [loginWallet, setLoginWallet] = useState(false);
  const { authenticated, isHandelingLogin, setIsHandelingLogin } =
    useGlobalStore((state) => state);

  const loginByGoogle = async (pathname: any, params: any) => {
    setIsHandelingLogin(true);
    const response = await LaravelApiRequest.locale(locale).post(
      "/api/auth/login/redirect",
      {
        driver: "google",
      }
    );

    if (response?.success) {
      if (pathname !== "/auth/login") {
        const locale = params.locale ?? "en";
        if ("locale" in params) {
          delete params["locale"];
        }
        const obj = {
          pathname,
          params,
          locale,
        };
        localStorage.setItem("REDIRECT_BEFORE_LOGIN", JSON.stringify(obj));
      }

      window.location.href = response?.data?.socialite?.driver_url;
    } else {
      setIsHandelingLogin(false);
      alert(response?.message);
    }
  };

  useEffect(() => {
    return setIsHandelingLogin(false);
  }, []);

  return (
    <>
      <h3 className="font-bold text-lg text-center">
        {t("Log In to Use All Features")}
      </h3>
      <div className="flex flex-col gap-5 mt-5">
        {!loginWallet && (
          <button
            type="button"
            disabled={authenticated === undefined || isHandelingLogin}
            className="w-full btn btn-neutral"
            onClick={() => setLoginWallet(true)}
          >
            <IconWallet className="h-6 w-6 mr-4" />
            <span>{t("Connect Wallet")}</span>
          </button>
        )}
        {loginWallet && (
          <ConnectWallet>
            <LoginWalletButton />
          </ConnectWallet>
        )}

        <button
          type="button"
          disabled={authenticated === undefined || isHandelingLogin}
          onClick={() => loginByGoogle(pathname, params)}
          className="w-full btn btn-error"
        >
          <IconGoogle className="h-6 w-6 mr-4" />
          {t("Login by Google")}
        </button>
      </div>
      <div className="mt-5 text-xs italic">
        {t.rich("We will create a new account", {
          link: (chunks) => (
            <Link
              target="_blank"
              className="link"
              href={{
                pathname: "/pages/[slug]",
                params: { slug: "terms-and-policies" },
              }}
            >
              {chunks}
            </Link>
          ),
        })}
        .
      </div>
    </>
  );
}
