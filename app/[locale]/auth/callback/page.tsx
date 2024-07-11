"use client";

import { useRouter } from "@/navigation";
import { useGlobalStore } from "@/providers/global-store-provider";
import { signIn } from "next-auth/react";
import { useLocale } from "next-intl";
import { useEffect } from "react";

export default function LoginCallback() {
  const { setLoading, authenticated } = useGlobalStore((state) => state);
  const router = useRouter();
  const locale = useLocale();

  const handleCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const scope = urlParams.get("scope");
    const error = urlParams.get("error");

    if (error) {
      alert(error);
      router.replace("/auth/login");
      return false;
    }

    if (!code) {
      alert("Code not found");
      router.replace("/auth/login");
      return false;
    }

    const response = await signIn("Google", {
      redirect: false,
      code: code,
      scope: scope ?? "",
      locale
    });

    if (response?.error) {
      alert(response?.error);
      router.replace("/auth/login");
    }
  };

  const getRedirectData = () => {
    const data = localStorage.getItem("REDIRECT_BEFORE_LOGIN");
    if (data) {
      const obj = JSON.parse(data);
      return obj;
    }
    return undefined;
  };

  useEffect(() => {
    setLoading(true);
    if (authenticated === false) {
      handleCallback();
    }
    if (authenticated === true) {
      try {
        const redirectData = getRedirectData();
        localStorage.removeItem("REDIRECT_BEFORE_LOGIN");

        if (redirectData) {
          router.replace(
            // are used in combination with a given `pathname`. Since the two will
            // always match for the current route, we can skip runtime checks.
            { pathname: redirectData.pathname, params: redirectData.params },
            { locale: locale }
          );
        } else {
          router.replace("/account");
        }
      } catch (e) {
        router.replace("/account");
      }
    }

    return () => {
      setLoading(false);
    };
  }, [authenticated]);

  return (
    <>
      <div className="mx-auto">
        <div className="relative min-[300px] flex w-full justify-center items-center">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      </div>
    </>
  );
}
