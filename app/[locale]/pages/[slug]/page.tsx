import PageDetail from "@/components/pages/PageDetail";
import LaravelApiRequest from "@/utils/LaravelApiRequest";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { remark } from "remark";
import html from "remark-html";

type Props = {
  params: { slug: string; locale: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const locale = params.locale;
  const slug = params.slug;

  const response = await LaravelApiRequest.locale(locale).get(
    `/api/seo/pages/${slug}`
  );

  const metadata: Model.Metadata = response?.data?.metadata;
  const previousImages = (await parent).openGraph?.images || [];
  const image = metadata?.image ?? null;
  const title = metadata.title;
  const description = metadata.description ?? undefined;

  return {
    title,
    description,
    openGraph: {
      images: [...(image ? [image] : []), ...previousImages],
    },
  };
}

async function getData(locale: string, slug: string) {
  const response = await LaravelApiRequest.locale(locale).get(
    `/api/pages/${slug}`
  );

  return response;
}

export default async function PostShowPage({ params }: Props) {
  const response = await getData(params.locale, params.slug);

  if (!response.response_ok) {
    return notFound();
  }

  const processedContent = await remark()
    .use(html)
    .process(response.data.page.content);
  const contentHtml = processedContent.toString();

  return (
    <>
      <PageDetail
        html={contentHtml}
        updated_at={response.data.page.updated_at}
      />
    </>
  );
}
