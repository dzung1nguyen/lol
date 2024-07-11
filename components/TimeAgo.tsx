"use client";
import { useFormatter } from "next-intl";

export default function TimeAgo({ value }: { value: string }) {
  const format = useFormatter();
  const dateTime = new Date(value);

  return <>{format.relativeTime(dateTime)}</>;
}
