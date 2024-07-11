import { ReactNode } from "react";
import LayoutDefault from "./layout/LayoutDefault";
import LaravelApiRequest from "@/utils/LaravelApiRequest";
import { useLocale } from "next-intl";

type Props = {
  children?: ReactNode;
};

const getData = async (locale: string) => {
  const { data } = await LaravelApiRequest.locale(locale).get(
    "/api/categories"
  );
  const categories: Model.Category[] = data?.categories ?? [];

  return { categories };
};

export default async function LayoutMain({ children }: Props) {
  const locale = useLocale();
  const defaultData = await getData(locale);

  return (
    <>
      <LayoutDefault data={defaultData}>{children}</LayoutDefault>
    </>
  );
}
