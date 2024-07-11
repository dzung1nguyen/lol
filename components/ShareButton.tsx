"use client";

import { useTranslations } from "next-intl";
import IconShareAlt from "./icons/IconShareAlt";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WeiboIcon,
  WeiboShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "next-share";
import IconCopy from "./icons/IconCopy";

export default function ShareButton({
  url,
  title,
}: {
  url: string;
  title: string | undefined;
}) {
  const t = useTranslations("");

  const writeClipboardText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(t("Copied text", { text }));
    } catch (error) {
      console.error(error);
    }
  };

  const close = () => {
    if (document?.activeElement instanceof HTMLElement) {
      document?.activeElement?.blur();
    }
  };

  return (
    <>
      <div className="dropdown dropdown-top dropdown-end">
        <div tabIndex={0} role="button" className="">
          <div className="flex items-center whitespace-nowrap gap-2 hover:text-primary">
            <IconShareAlt className="w-5 h-5" />
            <div>{t("Share")}</div>
          </div>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu py-0 px-0 shadow bg-base-200 rounded-box w-fit min-w-[150px]"
        >
          <li>
            <a onClick={() => writeClipboardText(url)}>
              <div className="flex items-center whitespace-nowrap gap-2">
                <span className="rounded-full flex items-center justify-center size-[25px] text-white bg-gray-700">
                  <IconCopy className="size-4 block"/>
                </span>
                {t("Copy link")}
              </div>
            </a>
          </li>
          <li>
            <a>
              <FacebookShareButton url={url} title={title} hashtag={"#godcat"}>
                <div className="flex items-center whitespace-nowrap gap-2">
                  <FacebookIcon size={25} round /> Facebook
                </div>
              </FacebookShareButton>
            </a>
          </li>
          <li>
            <a>
              <TwitterShareButton
                url={url}
                title={title}
                hashtags={["godcat", "godzillacat"]}
              >
                <div className="flex items-center whitespace-nowrap gap-2">
                  <TwitterIcon size={25} round /> Twitter
                </div>
              </TwitterShareButton>
            </a>
          </li>
          <li>
            <a>
              <TelegramShareButton url={url} title={title}>
                <div className="flex items-center whitespace-nowrap gap-2">
                  <TelegramIcon size={25} round /> Telegram
                </div>
              </TelegramShareButton>
            </a>
          </li>
          <li>
            <a>
              <RedditShareButton url={url} title={title ?? "GodCat.lol"}>
                <div className="flex items-center whitespace-nowrap gap-2">
                  <RedditIcon size={25} round /> Reddit
                </div>
              </RedditShareButton>
            </a>
          </li>
          <li>
            <a>
              <EmailShareButton url={url} subject={title ?? "GodCat.lol"}>
                <div className="flex items-center whitespace-nowrap gap-2">
                  <EmailIcon size={25} round /> Email
                </div>
              </EmailShareButton>
            </a>
          </li>
          <li>
            <a>
              <WhatsappShareButton url={url} title={title ?? "GodCat.lol"}>
                <div className="flex items-center whitespace-nowrap gap-2">
                  <WhatsappIcon size={25} round /> Whatsapp
                </div>
              </WhatsappShareButton>
            </a>
          </li>
          <li>
            <a>
              <WeiboShareButton url={url} title={title ?? "GodCat.lol"}>
                <div className="flex items-center whitespace-nowrap gap-2">
                  <WeiboIcon size={25} round /> Weibo
                </div>
              </WeiboShareButton>
            </a>
          </li>
          <li>
            <a onClick={() => close() } className="text-sm font-semibold bg-error text-error-content text-center flex justify-center">{t("Close")}</a>
          </li>
        </ul>
      </div>
    </>
  );
}
