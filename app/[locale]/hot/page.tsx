import HomePosts from "@/components/HomePosts";
import HomeLayout from "@/components/HomeLayout";
import LaravelApiRequest from "@/utils/LaravelApiRequest";

type Props = {
  params: { locale: string };
};

const getData = async (filter: Request.FilterPost) => {
  const { data } = await LaravelApiRequest.locale(filter.locale).get(
    "/api/posts",
    filter
  );

  return data;
};

export default async function HotPage({ params }: Props) {
  const filter: Request.FilterPost = {
    order: "hot",
    source_type: "all",
    locale: params.locale,
  };
  const data = await getData(filter);

  return (
    <>
      <HomeLayout>
        <HomePosts
          defaultPosts={data.posts.data}
          paginator={data.posts.paginator}
          filter={filter}
        />
      </HomeLayout>
    </>
  );
}
