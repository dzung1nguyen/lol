import HomePosts from "@/components/HomePosts";
import PageAuthorPost from "@/components/pages/PageAuthorPost";
import LaravelApiRequest from "@/utils/LaravelApiRequest";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { locale: string; ulid: string };
};

const getMetadata = async (
  locale: string,
  ulid: string
): Promise<Model.Metadata> => {
  const response = await LaravelApiRequest.locale(locale).get(
    `/api/seo/wallets/${ulid}`
  );

  return response.data?.metadata;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const metadata: Model.Metadata = await getMetadata(
    params.locale,
    params.ulid
  );
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

export default async function AuthorPost({ params }: Props) {
  const metadata: Model.Metadata = await getMetadata(
    params.locale,
    params.ulid
  );

  const filter: Request.FilterPost = {
    order: "new",
    source_type: "all",
    locale: params.locale,
    author: params.ulid,
  };
  const data = await getData(filter);

  console.log('metadata.short_title', metadata.short_title)

  return (
    <>
      <PageAuthorPost author={metadata.short_title}>
        <HomePosts
          defaultPosts={data.posts.data}
          paginator={data.posts.paginator}
          filter={filter}
        />
      </PageAuthorPost>
    </>
  );
}
