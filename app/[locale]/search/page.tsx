import HomePosts from "@/components/HomePosts";
import PageSearchPost from "@/components/pages/PageSearchPost";
import LaravelApiRequest from "@/utils/LaravelApiRequest";

type Props = {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const getData = async (filter: Request.FilterPost) => {
  const { data } = await LaravelApiRequest.locale(filter.locale).get("/api/posts", filter);

  return data;
};

export default async function SearchPage({ params, searchParams }: Props) {
  const filter: Request.FilterPost = {
    order: "new",
    source_type: "all",
    locale: params.locale,
    title: `${searchParams?.q ?? ""}`,
  };
  const data = await getData(filter);

  return (
    <>
      <PageSearchPost
        defaultPosts={data?.posts?.data ?? []}
        paginator={data?.posts?.paginator ?? null}
        filter={filter}
      ></PageSearchPost>
    </>
  );
}
