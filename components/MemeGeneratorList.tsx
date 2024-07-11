"use client";

import { formatFileSize, scrollToDiv } from "@/utils";
import LaravelApiRequest from "@/utils/LaravelApiRequest";
import { useTranslations } from "next-intl";
import { ChangeEvent, useEffect, useState } from "react";
import IconUpload from "./icons/IconUpload";
import IconClose from "./icons/IconClose";

export default function MemeGeneratorList({
  onSelectMeme,
  onUploadImage,
}: {
  onSelectMeme: any;
  onUploadImage: any;
}) {
  const t = useTranslations("");
  const [name, setName] = useState("");
  const [memes, setMemes] = useState<Model.Meme[]>([]);
  const [paginator, setPaginator] = useState<Model.Paginator>({
    count: 0,
    per_page: 10,
    has_pages: false,
    has_more_pages: false,
    current_page: 1,
    next_pageUrl: null,
    previous_page_url: null,
  });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"select" | "upload">("select");
  const [fileType, setFileType] = useState("file");
  const [fileSelected, setFileSelected] = useState<File>();
  const [fileSelectedUrl, setFileSelectedUrl] = useState<string>();

  const fetchMemes = async (page: number, name?: string, scroll?: boolean) => {
    const pagrams: Record<string, string | number | undefined> = {
      page,
      name,
    };

    setLoading(true);

    if (scroll) {
      scrollToDiv("listListMeme", 0, 0, 'modalListMeme');
    }

    const { data } = await LaravelApiRequest.get(`/api/memes`, pagrams);

    setMemes(data?.memes?.data ?? []);

    setPaginator((prevPaginator) => ({
      ...prevPaginator,
      ...(data?.memes?.paginator ?? null),
    }));

    setLoading(false);
  };

  const searchMeme = () => {
    fetchMemes(1, name);
  };

  const onKeyDown = (e: any) => {
    if (e.key === "Enter") {
      fetchMemes(1, name);
    }
  };

  const selectMeme = async (meme: Model.Meme) => {
    onSelectMeme(meme);
    setFileSelected(undefined);
    resetInputFile();
    hideMemeList();
  };

  const uploadImage = async (fileUrl: string) => {
    onUploadImage(fileUrl);
    setFileSelected(undefined);
    resetInputFile();
    hideMemeList();
  };

  const hideMemeList = () => {
    const modal = document.getElementById("modalMemeList");
    // @ts-ignore
    if (modal && modal?.close) {
      // @ts-ignore
      modal?.close();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target?.files?.length ? e.target?.files[0] : null;
    if (!selectedFile) {
      alert(t("Please select an image to upload"));
      return false;
    }

    resetInputFile();

    const type = selectedFile.type;
    const validFileTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (selectedFile.size > maxSize) {
      alert(
        t("File size should be smaller than max", {
          max: formatFileSize(maxSize),
        })
      );
      return false;
    }

    if (!validFileTypes.includes(type)) {
      alert(
        t("Invalid media type", {
          types: "JPG, PNG",
        })
      );
      return false;
    }

    setFileSelected(selectedFile);

    const url = URL.createObjectURL(selectedFile);
    setFileSelectedUrl(url);
  };

  const reset = () => {
    setName("");
    setTab("select");
    setFileSelected(undefined);
    resetInputFile();
    fetchMemes(1);
  };

  const resetInputFile = () => {
    setFileType("text");
    setTimeout(() => {
      setFileType("file");
    }, 500);
  };

  useEffect(() => {
    fetchMemes(1);
  }, []);

  return (
    <>
      <dialog id="modalMemeList" className="modal">
        <div className="modal-box w-11/12 max-w-5xl" id="modalListMeme">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <div className="flex justify-center mb-5">
            <div role="tablist" className="tabs tabs-boxed">
              <a
                role="tab"
                onClick={() => setTab("select")}
                className={`tab !h-auto !leading-none flex items-center justify-center min-h-10 ${tab === "select" ? "tab-active" : ""}`}
              >
                {t('Select Image')}
              </a>
              <a
                role="tab"
                onClick={() => setTab("upload")}
                className={`tab !h-auto !leading-none flex items-center justify-center min-h-10 ${tab === "upload" ? "tab-active" : ""}`}
              >
                {t('Upload Image')}
              </a>
            </div>
          </div>
          <div className={`${tab === "select" ? "block" : "hidden"}`}>
            <h3 className="font-bold text-lg">
              {t('Search and select an image')}
            </h3>
            <div className="py-4">
              <div className="flex gap-5 w-full mb-5">
                <input
                  type="text"
                  className="w-full input input-bordered input-sm focus:outline-none focus:border-primary"
                  placeholder={t("Search")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => onKeyDown(e)}
                />
                <div className="flex-none">
                  <button
                    disabled={loading}
                    className="btn btn-primary btn-sm min-w-24"
                    onClick={() => searchMeme()}
                  >
                    {t("Search")}
                  </button>
                </div>
              </div>

              <div className="relative min-h-10">
                {loading && (
                  <div className="w-full absolute h-full z-10 text-center bg-base-300 bg-opacity-30">
                    <span className="loading loading-dots loading-lg"></span>
                  </div>
                )}
                <div
                  id="listListMeme"
                  className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3"
                >
                  {memes.map((meme) => (
                    <div
                      className="border border-base-300 flex flex-col overflow-hidden hover:border-secondary hover:cursor-pointer hover:opacity-90 rounded-btn"
                      key={`${meme.id}`}
                      onClick={() => selectMeme(meme)}
                    >
                      <div className="w-full text-xs font-semibold mb-2 p-2">
                        {meme.name}
                      </div>
                      <div className="">
                        {/* eslint-disable-next-line @next/next/no-img-element*/}
                        <img
                          src={meme.url_thumb}
                          alt={meme.name}
                          className="object-contain block"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {!loading && !memes.length && (
                  <div className="flex w-full justify-center">
                    <div>{t("No memes found")}</div>
                  </div>
                )}
              </div>

              {!!paginator.count && (
                <div className="flex justify-center mt-5">
                  <div className="join">
                    <button
                      className="join-item btn w-14"
                      disabled={
                        !paginator.previous_page_url ||
                        loading ||
                        paginator.current_page <= 1
                      }
                      onClick={() =>
                        fetchMemes(paginator.current_page - 1, undefined, true)
                      }
                    >
                      «
                    </button>
                    <button className="join-item btn">
                      {t("Page")} {paginator.current_page ?? 1}
                    </button>
                    <button
                      className="join-item btn w-14"
                      disabled={!paginator.has_more_pages || loading}
                      onClick={() =>
                        fetchMemes(paginator.current_page + 1, undefined, true)
                      }
                    >
                      »
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={`${tab === "upload" ? "block" : "hidden"}`}>
            {!fileSelected && (
              <div className="flex w-full justify-center">
                <div>
                  <label className="btn btn-outline btn-lg w-full max-w-[500px]">
                    <input
                      type={fileType}
                      accept=".jpg,.jpeg,.png"
                      className="w-0 h-0 fixed top-[-10000px]"
                      onChange={handleFileChange}
                    />
                    <IconUpload className="size-8" />
                    <span>{t('Choose Image')}</span>
                  </label>
                  <div className="text-info italic text-sm mt-1">
                    {t("We only support file types", {
                      types: "JPG, PNG",
                    })}
                  </div>
                </div>
              </div>
            )}
            {fileSelected && fileSelectedUrl && (
              <>
                <div className="max-h-[500px] flex justify-center mt-3">
                  <div className="relative bg-base-300 min-h-[200px] min-w-[200px] flex justify-center items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element*/}
                    <img
                      src={fileSelectedUrl}
                      alt={fileSelected?.name}
                      className="max-w-full max-h-full block object-contain mx-auto border"
                    />
                    <button
                      onClick={() => setFileSelected(undefined)}
                      className="btn btn-sm btn-circle btn-outline btn-error absolute top-3 shadow right-3"
                    >
                      <IconClose />
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => uploadImage(fileSelectedUrl)}
                    className="btn btn-outline btn-primary w-24 mt-5"
                  >
                    {t('OK')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
