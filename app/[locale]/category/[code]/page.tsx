import HomePosts from "@/components/HomePosts";
import PageCategoryPost from "@/components/pages/PageCategoryPost";
import LaravelApiRequest from "@/utils/LaravelApiRequest";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { locale: string; code: string; };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const code = params.code;
  const locale = params.locale;

  const response = await LaravelApiRequest.locale(locale).get(
    `/api/seo/categories/${code}`
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

const getData = async (filter: Request.FilterPost) => {
  const { data } = await LaravelApiRequest.locale(filter.locale).get(
    "/api/posts",
    filter
  );

  return data;
};

export default async function CategoryPost({
  params,
}: {
  params: { locale: string; code: string };
}) {
  const filter: Request.FilterPost = {
    order: "new",
    source_type: "all",
    locale: params.locale,
    category: params.code,
  };
  const data = await getData(filter);

  return (
    <>
      <PageCategoryPost code={params.code}>
        <HomePosts
          defaultPosts={data.posts.data}
          paginator={data.posts.paginator}
          filter={filter}
        />
      </PageCategoryPost>
    </>
  );
}
