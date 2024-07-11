import { useTranslations } from "next-intl";

// Note that `app/[locale]/[...rest]/page.tsx`
// is necessary for this page to render.

export default function NotFoundPage() {
  const t = useTranslations("");

  return (
    <>
      <div className="container px-5 mx-auto text-center">
        <div className="min-h-[calc(100vh-75px-216px)] flex items-center justify-center py-10">
          <div>
            <div className="mb-8 text-[100px] lg:text-[150px] xl:text-[200px] 2xl:text-[250px] font-extrabold text-red-600 font-secondary">
              404
            </div>
            <p className="mb-5 text-2xl font-semibold text-primary">{t("Page Not Found")}</p>
            <div className="animate-bounce">
              <svg
                className="mx-auto h-16 w-16 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                ></path>
              </svg>
            </div>
            <p className="mt-5 text-lg font-secondary font-semibold">{t("The page you requested was not found")}</p>
          </div>
        </div>
      </div>
    </>
  );
}
