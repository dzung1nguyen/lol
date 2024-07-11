import { useLocale } from "next-intl";

export const useFormattedNumber = () => {
  const lang = useLocale();

  const format = (num: number) => {
    let thousand, million;

    switch (lang) {
      case "en": // 🇺🇸 English
      case "fr": // 🇫🇷 Français
      case "de": // 🇩🇪 Deutsch
      case "es": // 🇪🇸 Español
      case "pt": // 🇵🇹 Português
      case "tr": // 🇹🇷 Türkçe
        thousand = "K";
        million = "M";
        break;
      case "ja": // 🇯🇵 日本語
        thousand = "千";
        million = "百万";
        break;
      case "ko": // 🇰🇷 한국어
        thousand = "천";
        million = "백만";
        break;
      case "zh-CN": // 🇨🇳 中文
      case "zh-TW": // 🇹🇼 台語
        thousand = "千";
        million = "百万";
        break;
      case "vi": // 🇻🇳 Tiếng việt
        thousand = "K";
        million = " Triệu";
        break;
      case "th": // 🇹🇭 ภาษาไทย
        thousand = "พัน";
        million = "ล้าน";
        break;
      case "id": // 🇮🇩 Bahasa Indonèsia
        thousand = "Rb";
        million = "Jt";
        break;
      default:
        thousand = "K";
        million = "M";
    }

    if (num < 1000) {
      return num.toString();
    }

    if (num < 1000000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + thousand;
    }

    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + million;
  };

  return {
    format,
  };
};
