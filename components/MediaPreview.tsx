"use client";

import { formatFileSize } from "@/utils";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function MediaPreview({ file }: { file: File }) {
  const t = useTranslations("");
  const [media, setMedia] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [mimeType, setMimeType] = useState("");

  const handleFileChange = (file: File) => {
    if (file) {
      const fileType = file.type.split("/")[0];
      setMediaType(fileType);
      const url = URL.createObjectURL(file);
      setMedia(url);
      setMimeType(file.type);
    }
  };

  useEffect(() => {
    if (file) {
      handleFileChange(file);
    }
  }, [file]);

  return (
    <>
      {media && mediaType === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={media}
          alt={file?.name}
          className="max-w-full block object-contain"
        />
      )}
      {media && mediaType === "video" && (
        <video
          controls
          style={{ display: "block", maxWidth: "100%", height: "auto" }}
        >
          <source src={media} type={`${mimeType === "video/quicktime" ? 'video/mp4': mimeType}`} />
          {t("Your browser does not support the video tag")}
        </video>
      )}
      <div className="absolute top-2 bg-neutral px-3 py-2 text-neutral-content bg-opacity-80">
        {file.name} ({formatFileSize(file.size)})
      </div>
    </>
  );
}
