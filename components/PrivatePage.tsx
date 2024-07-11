"use client";

import React, { ReactNode, useState } from "react";
import { useEffect } from "react";
import { useGlobalStore } from "@/providers/global-store-provider";
import { useRouter } from "@/navigation";
import LaravelApiRequest from "@/utils/LaravelApiRequest";
import { usePathname } from "next/navigation";

type Props = {
  children?: ReactNode;
};

export default function PrivatePage({ children }: Props) {
  const { authenticated } = useGlobalStore((state) => state);
  const router = useRouter();
  const pathname = usePathname();

  const ping = async (authenticated?: boolean) => {
    if (authenticated === false) {
      router.push("/auth/login");
      return true;
    }

    if (authenticated === true) {
      await LaravelApiRequest.post("/api/private/wallet/ping");
    }
  };

  useEffect(() => {
    ping(authenticated);
  }, [authenticated, pathname]);

  return (
    <>
      {!authenticated && (
        <div className="flex w-full items-center justify-center absolute h-20 z-10">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      )}
      {authenticated === true && children}
    </>
  );
}
