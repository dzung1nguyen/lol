"use client";
import { formatFileSize, scrollToDiv } from "@/utils";
import { useLocale, useTranslations } from "next-intl";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { usePostStore } from "@/providers/post-store-provider";
import { Link, useRouter } from "@/navigation";
import LaravelApiRequest from "@/utils/LaravelApiRequest";
import { locales } from "@/i18nConfig";
import MediaPreview from "@/components/MediaPreview";
import MemeGenerator, { MemeGeneratorRef } from "@/components/MemeGenerator";
import IconClose from "@/components/icons/IconClose";
import IconUpload from "@/components/icons/IconUpload";

export default function PostCreatePage() {
  const t = useTranslations("");
  const locale = useLocale();
  const [type, setType] = useState("upload");
  const [postLocale, setPostLocale] = useState("all");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState("file");
  const [error, setError] = useState<null | string>(null);
  const { categories } = usePostStore((state) => state);
  const [selecttedCategories, setSelecttedCategories] = useState<number[]>([]);
  const [allowComment, setAllowComment] = useState(true);
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const memeGeneratorRef = useRef<MemeGeneratorRef>(null);

  const handleSelectCategoryChange = (e: any) => {
    const { value, checked } = e.target;

    if (checked) {
      if (selecttedCategories.length >= 5) {
        return;
      }
      setSelecttedCategories([...selecttedCategories, +value]);
    } else {
      setSelecttedCategories([
        ...selecttedCategories.filter((e) => e !== +value),
      ]);
    }
  };

  const onTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setType(e.target.value);
    setFile(null);
    setError(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target?.files?.length ? e.target?.files[0] : null;
    setError("");
    if (!selectedFile) {
      setError(t("Please select a media to upload"));
      return false;
    }

    if (selectedFile) {
      const fileType = selectedFile.type;
      const validFileTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "video/mp4",
        "video/quicktime",
      ];
      const maxSize = 30 * 1024 * 1024; // 30MB

      if (selectedFile.size > maxSize) {
        fileError(
          t("File size should be smaller than max", {
            max: formatFileSize(maxSize),
          })
        );
        return false;
      }

      if (!validFileTypes.includes(fileType)) {
        fileError(
          t("Invalid media type", {
            types: "JPG, PNG, GIF, MP4, MOV",
          })
        );
        return false;
      }

      setFile(selectedFile);
    }
  };

  const fileError = (error: string) => {
    setError(error);
    setFile(null);
    setFileType("text");
    setTimeout(() => {
      setFileType("file");
    }, 500);
  };

  const submit = async () => {
    setError("");
    let memeImage: string | null | undefined;
    if (!title || title?.trim().length > 120) {
      setError(
        t("Please input a title with less than max characters", { max: 120 })
      );
      scrollToDiv("CreateNewPost");
      return false;
    }
    if (type === "upload") {
      if (!file) {
        setError(t("Please select a media to upload"));
        scrollToDiv("CreateNewPost");
        return false;
      }
    } else {
      memeImage = await memeGeneratorRef.current?.getMeme();
      if (!memeImage) {
        setError(t("Please select or upload an image and then create a meme"));
        scrollToDiv("elPostType");
        return false;
      }
    }

    if (!selecttedCategories.length || selecttedCategories.length > 5) {
      setError(t("Please select number catogories", { min: 1, max: 5 }));
      scrollToDiv("CreateNewPost");
      return false;
    }

    setProgress(1);

    const onUploadProgress = (progressEvent: any) => {
      if (progressEvent.loaded && progressEvent.total) {
        let progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        if (progress < 2) {
          progress = 1;
        }
        setProgress(Math.min(progress, 99));
      }
    };

    let resFile:LaravelResponseData;

    if (type === "upload") {
      resFile = await LaravelApiRequest.upload(
        "/api/private/file",
        {
          file,
          type: "posts",
          name: title,
        },
        { onUploadProgress }
      );
    } else {
      resFile = await LaravelApiRequest.upload(
        "/api/private/generator",
        {
          file: memeImage,
          type: "posts",
          name: title,
        },
        { onUploadProgress }
      );
    }

    if (!resFile.response_ok || !resFile?.success) {
      setProgress(0);
      alert(resFile.message);
      return false;
    }

    const uploadedFile: Model.File = resFile.data.file;

    const resPost = await LaravelApiRequest.post("/api/private/posts", {
      title: title,
      locale: postLocale,
      type: type,
      file_id: uploadedFile.ulid,
      categories: selecttedCategories,
      allow_comment: allowComment,
    });

    if (!resPost.response_ok || !resPost?.success) {
      alert(resPost.message);
      setProgress(0);
      return false;
    }

    router.push("/account/posts");

    setProgress(0);

    return false;
  };

  useEffect(() => {
    setPostLocale(locale);
  }, [locale]);

  return (
    <>
      {progress > 0 && (
        <div className="fixed bg-fixed flex items-center justify-center top-0 left-0 w-full h-full bg-base-300 bg-opacity-90 z-[100]">
          <div className="flex relative items-center justify-center">
            <span className="loading loading-ring text-primary w-20"></span>
            <span className="absolute text-primary font-bold">{progress}%</span>
          </div>
        </div>
      )}
      <div
        id="CreateNewPost"
        className="flex flex-wrap gap-3 justify-between w-full mb-5"
      >
        <div>
          <h2 className="text-2xl font-semibold">{t("Create new post")}</h2>
          <div className="italic text-sm">
            {t.rich(
              "Remember to keep post respectful and to follow our guidelines",
              {
                link: (chunks) => (
                  <Link
                    target="_blank"
                    className="link text-secondary"
                    href={{
                      pathname: "/pages/[slug]",
                      params: { slug: "posting-guidelines" },
                    }}
                  >
                    {chunks}
                  </Link>
                ),
              }
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/account/posts" className="btn">
            {t("Cancel")}
          </Link>
          <button
            onClick={(e) => submit()}
            className="btn btn-primary min-w-24"
          >
            {t("Submit")}
          </button>
        </div>
      </div>
      {error && (
        <div role="alert" className="alert alert-error mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <div className="grid grid-cols-1 gap-5">
            <div className="border border-base-300 card card-compact p-5">
              <div className="grid grid-cols-1 gap-5 w-full">
                <div>
                  <div className="text-sm font-semibold mb-1">{t("Title")}</div>
                  <input
                    type="text"
                    placeholder={t("Title")}
                    className="w-full input input-bordered focus:outline-none focus:border-primary"
                    value={title}
                    onInput={(e: any) => setTitle(e.target.value)}
                  />
                  <div
                    className={`italic text-sm text-right ${
                      (title?.trim().length ?? 0) > 120 ? "text-error" : ""
                    }`}
                  >
                    {title?.trim().length ?? 0}/120
                  </div>
                </div>
                <div id="elPostType">
                  <div className="w-full">
                    <div className="text-sm font-semibold mb-1">
                      {t("Type")}
                    </div>
                    <div className="flex gap-5">
                      <label className="flex items-center font-semibold cursor-pointer">
                        <input
                          type="radio"
                          name="postType"
                          className="radio radio-primary mr-2"
                          value="upload"
                          checked={type === "upload"}
                          onChange={onTypeChange}
                        />
                        {t("Upload a media")}
                      </label>

                      <label className="flex items-center font-semibold cursor-pointer">
                        <input
                          type="radio"
                          name="postType"
                          className="radio radio-primary mr-2"
                          checked={type === "generator"}
                          value="generator"
                          onChange={onTypeChange}
                        />
                        {t("Meme generator")}
                      </label>
                    </div>
                  </div>
                </div>
                <div className={`${type === "upload" ? "block" : "hidden"}`}>
                  {!file && (
                    <div>
                      <label className="btn btn-outline btn-lg w-full">
                        <input
                          type={fileType}
                          accept=".jpg,.jpeg,.png,.gif,.mp4,.mov"
                          className="w-0 h-0 fixed top-[-10000px] "
                          onChange={handleFileChange}
                        />
                        <IconUpload className="size-8" />
                        <span>{t("Upload a media")}</span>
                      </label>

                      <div className="text-center text-info italic text-sm mt-1">
                        {t("We only support file types", {
                          types: "JPG, PNG, GIF, MP4, MOV",
                        })}
                      </div>
                    </div>
                  )}

                  {file && (
                    <div className="relative flex w-full justify-center border border-base-300 max-h-[800px] mt-2 overflow-hidden rounded-box bg-base-300">
                      <button
                        onClick={() => fileError("")}
                        className="absolute z-10 top-2 right-2 btn btn-circle btn-error"
                      >
                        <IconClose className="size-6" />
                      </button>
                      <MediaPreview file={file} />
                    </div>
                  )}
                </div>
                <div className={`${type === "generator" ? "block" : "hidden"}`}>
                  <MemeGenerator ref={memeGeneratorRef} />
                </div>
              </div>
            </div>
            <div className="card border border-base-300 card-compact p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <div className="text-sm font-semibold mb-1">
                    {t("Allow comments")}
                  </div>
                  <label className={`cursor-pointer label`}>
                    <span
                      className={`font-semibold ${
                        allowComment ? "text-primary" : "text-error"
                      }`}
                    >
                      {allowComment ? t("Yes") : t("No")}
                    </span>
                    <input
                      type="checkbox"
                      className={`toggle toggle-primary`}
                      checked={allowComment}
                      onChange={(e) => setAllowComment(e.target.checked)}
                    />
                  </label>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">
                    {t("Select a language for display")}
                  </div>
                  <select
                    value={postLocale}
                    onChange={(e) => setPostLocale(e.target.value)}
                    className="select select-bordered w-full focus:outline-none focus:border-primary"
                  >
                    <option value="all">{t("All languages")}</option>
                    {locales.map((option) => (
                      <option key={option} value={option}>
                        {t("LocaleFull", {
                          locale: option.replaceAll("-", "_"),
                        })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-1 gap-5">
            <div className="card border border-base-300 card-compact p-5">
              <div className="text-sm font-semibold">{t("Categories")}</div>
              <div
                className={`italic text-sm mt-1 ${
                  !selecttedCategories.length || selecttedCategories.length > 5
                    ? "text-error"
                    : "text-info"
                }`}
              >
                {t("Selected number categories", {
                  from: selecttedCategories.length,
                  to: 5,
                })}
              </div>
              <div className="overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-x-5">
                  {categories.map((category) => (
                    <div key={category.code}>
                      <label className="cursor-pointer label flex items-center hover:bg-primary hover:bg-opacity-10">
                        <span
                          className={`${
                            selecttedCategories.includes(category.id)
                              ? "text-primary"
                              : ""
                          }`}
                        >
                          {category.name_locale}
                        </span>
                        <input
                          type="checkbox"
                          name="categories[]"
                          multiple
                          value={category.id}
                          onChange={(e) => handleSelectCategoryChange(e)}
                          checked={selecttedCategories.includes(category.id)}
                          className={`checkbox ${
                            selecttedCategories.includes(category.id)
                              ? "checkbox-primary"
                              : ""
                          }`}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center">
        <div className="flex gap-3 mt-5">
          <Link href="/account/posts" className="btn">
            {t("Cancel")}
          </Link>
          <button
            onClick={(e) => submit()}
            className="btn btn-primary min-w-24"
          >
            {t("Submit")}
          </button>
        </div>
      </div>
    </>
  );
}
