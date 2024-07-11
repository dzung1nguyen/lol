"use client";

import { ReactNode } from "react";
import HomeBar from "./HomeBar";
import Image from "next/image";

type Props = {
  children?: ReactNode;
};

export default function HomeLayout({ children }: Props) {
  return (
    <>
      <div className="mx-auto flex justify-center w-full max-w-[900px] gap-5">
        <div className="w-full max-w-[600px] flex-none">
          <HomeBar />
          <div className="grid grid-cols-1 mx-auto gap-5 mt-5">{children}</div>
        </div>
        <div className="hidden lg:block w-full relative">
          <a
            href="https://personal.local"
            target="_blank"
            className="block sticky top-[60px]"
          >
            <Image
              src={"/img/godzillacat-pro.gif"}
              width={280}
              height={280}
              alt="GodzillaCat"
              priority
              unoptimized
            />
          </a>
        </div>
      </div>
    </>
  );
}
