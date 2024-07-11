"use client";

import { useRouter } from "@/navigation";
import { useGlobalStore } from "@/providers/global-store-provider";
import { useEffect } from "react";

export default function LoginPage() {
  const { authenticated } = useGlobalStore((state) => state);
  const { setLoading } = useGlobalStore((state) => state);

  const router = useRouter();

  useEffect(() => {
    return () => {
      setLoading(false);
      const loginModal = document.getElementById("loginModal");
      // @ts-ignore
      loginModal?.close();
    };
  }, []);

  useEffect(() => {
    if (authenticated === undefined) {
      setLoading(true);
    }
    if (authenticated === false) {
      setLoading(false);
      const loginModal = document.getElementById("loginModal");
      // @ts-ignore
      loginModal?.show();
    }

    if (authenticated) {
      router.replace("/account");
    }

    return setLoading(false);
  }, [authenticated]);

  return (
    <>
      <div className="mx-auto">
        <div className="relative min-h-[calc(100vh-60px-600px)] flex w-full justify-center items-center">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      </div>
    </>
  );
}
