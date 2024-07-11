"use client";

import { ReactNode, useEffect } from "react";
import Image from "next/image";
import { usePostStore } from "@/providers/post-store-provider";
import PostSourceType from "../PostSourceType";

type Props = {
  children: ReactNode;
  code: string;
};

export default function PageCategoryPost({ children, code }: Props) {
  const { categories, setActiveCategory, activeCategory } = usePostStore(
    (state) => state
  );

  useEffect(() => {
    setActiveCategory(code);

    return () => {
      setActiveCategory(undefined);
    };
  }, [categories.length, code, setActiveCategory]);
  return (
    <>
      <div className="mx-auto flex justify-center w-full max-w-[900px] gap-5">
        <div className="w-full max-w-[600px] flex-none">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{activeCategory?.name_locale}</h2>
            <div>
              <PostSourceType />
            </div>
          </div>
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
