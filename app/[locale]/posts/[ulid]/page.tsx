import PagePostDetail from "@/components/pages/PagePostDetail";
import LaravelApiRequest from "@/utils/LaravelApiRequest";

import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: { ulid: string; locale: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const ulid = params.ulid;
  const locale = params.locale;

  const response = await LaravelApiRequest.locale(locale).get(
    `/api/seo/posts/${ulid}`
  );

  const metadata: Model.Metadata = response?.data?.metadata;
  const previousImages = (await parent).openGraph?.images || [];
  const twitterImages = (await parent).twitter?.images || [];
  const image = metadata?.image ?? null;
  const title = metadata.title;
  const description = metadata.description ?? undefined;

  return {
    title,
    description,
    openGraph: {
      images: image
        ? [
            {
              alt: metadata.short_title,
              url: image,
              width: 500,
              height: 500,
              type: "image/jpeg",
            },
          ]
        : twitterImages,
    },
    twitter: {
      title,
      description,
      images: image
        ? [
            {
              alt: metadata.short_title,
              url: image,
              width: 500,
              height: 500,
              type: "image/jpeg",
            },
          ]
        : previousImages,
    },
  };
}

async function getData(locale: string, ulid: string) {
  const response = await LaravelApiRequest.locale(locale).get(
    `/api/posts/${ulid}`
  );

  return response;
}

export default async function PostShowPage({ params }: Props) {
  const response = await getData(params.locale, params.ulid);

  if (!response.response_ok) {
    return notFound();
  }

  if (!["reviewing", "published"].includes(response.data.post.status)) {
    return notFound();
  }

  return (
    <>
      <PagePostDetail post={response.data.post} />
    </>
  );
}
