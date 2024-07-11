"use client";

import { addCommas, convertDateTimeToLocal } from "@/utils";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function IndexPage() {
  const t = useTranslations("");
  const { data: session, status } = useSession();

  return (
    <>
      <div className="max-w-[700px] mx-auto">
        <div className="card shadow bg-base-200 bg-opacity-50">
          <table className="table">
            <tbody>
              <tr>
                <th>{t("Points")}</th>
                <td className="text-primary font-bold">{addCommas(session?.user?.point_available)}</td>
              </tr>
              <tr>
                <th>{t("Name")}</th>
                <td>{session?.user?.name}{" "}</td>
              </tr>
              <tr>
                <th>{t("Address")}</th>
                <td>{session?.user?.address_short}{" "}</td>
              </tr>
              <tr>
                <th>{t("Email")}</th>
                <td>{session?.user?.email ?? '---'}</td>
              </tr>
              <tr>
                <th>{t("Created at")}</th>
                <td>{convertDateTimeToLocal(session?.user?.created_at)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
