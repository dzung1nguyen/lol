import { NextIntlClientProvider, useMessages } from "next-intl";
import { GlobalStoreProvider } from "@/providers/global-store-provider";
import { primary } from "../fonts";
import { PostStoreProvider } from "@/providers/post-store-provider";
import React from "react";
import SessionWrapper from "@/components/SessionWrapper";
import type { Metadata } from "next";
import LayoutMain from "@/components/LayoutMain";

export const metadata: Metadata = {
  metadataBase: new URL("https://personal.local"),
  title: "Welcome to ABC – Where laughter meets blockchain!",
  description:
    "ABC is your ultimate destination for hilarious and entertaining content! Our platform is designed for users to upload, share, and enjoy funny videos and images from around the world",
};

export default function Root({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();

  return (
    <html lang={locale} className={`${primary.variable}`}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionWrapper>
            <GlobalStoreProvider>
              <PostStoreProvider>
                <LayoutMain>{children}</LayoutMain>
              </PostStoreProvider>
            </GlobalStoreProvider>
          </SessionWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
