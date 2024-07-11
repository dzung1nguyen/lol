export const getDefaultTheme = (): string => {
  return typeof window !== "undefined" &&
    window?.matchMedia?.("(prefers-color-scheme:dark)")?.matches
    ? "dark"
    : "emerald";
};

export const formatFileSize = (fileSizeInBytes: number): string => {
  if (fileSizeInBytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(fileSizeInBytes) / Math.log(k));

  return (
    parseFloat((fileSizeInBytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};

export const timeAgo = (
  fromDateTime?: string | null,
  locales?: {
    year: string;
    month: string;
    day: string;
    hour: string;
    minute: string;
    second: string;
    ago: string;
  }
): string => {
  if (!fromDateTime) {
    return "";
  }
  const now = new Date();
  const datetime = new Date(fromDateTime);
  const seconds = Math.floor((now.getTime() - datetime.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1) {
    return `${interval} ${locales?.year ?? "year(s)"} ${locales?.ago ?? "ago"}`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return `${interval} ${locales?.month ?? "month(s)"} ${
      locales?.ago ?? "ago"
    }`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return `${interval} ${locales?.day ?? "day(s)"} ${locales?.ago ?? "ago"}`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return `${interval} ${locales?.hour ?? "hour(s)"} ${locales?.ago ?? "ago"}`;
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return `${interval} ${locales?.minute ?? "minute(s)"} ${
      locales?.ago ?? "ago"
    }`;
  }
  return `${Math.floor(seconds)} ${locales?.second ?? "second(s)"} ${
    locales?.ago ?? "ago"
  }`;
};

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const objectToFormData = (
  obj: Record<string, any>,
  formData?: FormData,
  parentKey?: string
): FormData => {
  formData = formData || new FormData();

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      const formKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value instanceof File) {
        // If the value is a File, append it directly
        formData.append(formKey, value);
      } else if (Array.isArray(value)) {
        // If the value is an array, handle it recursively
        value.forEach((item, index) => {
          objectToFormData({ [index]: item }, formData, formKey);
        });
      } else if (typeof value === "object" && value !== null) {
        // If the value is an object, handle it recursively
        objectToFormData(value, formData, formKey);
      } else {
        // If the value is not an array or object, append it as is
        formData.append(
          formKey,
          value === undefined || value === null ? "" : value
        );
      }
    }
  }

  return formData;
};

export const toQueryString = <T>(a: T): string => {
  const s: string[] = [];
  const rbracket = /\[\]$/;

  const _isArray = function (obj: any): boolean {
    return obj && Object.prototype.toString.call(obj) === "[object Array]";
  };

  const add = function (k: string, v: any) {
    v =
      typeof v === "function"
        ? v()
        : v === null
        ? ""
        : v === undefined
        ? ""
        : v;
    s[s.length] = encodeURIComponent(k) + "=" + encodeURIComponent(v);
  };

  const buildParams = function (prefix: string, obj: any) {
    let i: number, len: number, key: string;

    if (prefix) {
      if (_isArray(obj)) {
        for (i = 0, len = obj.length; i < len; i++) {
          if (rbracket.test(prefix)) {
            add(prefix, obj[i]);
          } else {
            buildParams(
              prefix + "[" + (typeof obj[i] === "object" ? i : "") + "]",
              obj[i]
            );
          }
        }
      } else if (obj && String(obj) === "[object Object]") {
        for (key in obj) {
          buildParams(prefix + "[" + key + "]", obj[key]);
        }
      } else {
        add(prefix, obj);
      }
    } else if (_isArray(obj)) {
      for (i = 0, len = obj.length; i < len; i++) {
        add(obj[i].name, obj[i].value);
      }
    } else {
      for (key in obj) {
        buildParams(key, obj[key]);
      }
    }
    return s;
  };

  return buildParams("", a).join("&").replace(/%20/g, "+");
};

export const getSecrectKey = (info: string = ""): string => {
  const str =
    "80471349761414719729861746212180382169763472108821093798164871462102187047146358184692103218308210472164871698462198080321803721986416487621218047134976141471972986174621218038216976347210882109379816487146210218704714635818469210321830821047216487169846219808032180372198641648762121";
  const timestamp = Date.now();

  const first = getRandomInt(0, 100);
  const last = getRandomInt(0, 100);

  const key = `${str.substring(first, first + 37)}${timestamp}${str.substring(
    last,
    last + 37
  )}${info}`;

  return btoa(key);
};

export const formatAddress = (inputStr: string): string => {
  const regex = /^(.{5}).*(.{5})$/;
  const match = inputStr.match(regex);
  if (match) {
    const firstFive = match[1];
    const lastFive = match[2];
    return `${firstFive}...${lastFive}`;
  } else {
    return "";
  }
};

export const isUrlPlatform = (url: string): boolean => {
  const patterns: { [key: string]: RegExp } = {
    youtube: /(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/,
    facebook: /(https?:\/\/)?(www\.)?(facebook\.com)\/.+$/,
    vimeo: /(https?:\/\/)?(www\.)?(vimeo\.com)\/.+$/,
    dailymotion: /(https?:\/\/)?(www\.)?(dailymotion\.com)\/.+$/,
  };

  let flag = false;

  for (const platform in patterns) {
    if (patterns[platform].test(url)) {
      flag = true;
      break;
    }
  }

  return flag;
};

export const isUrl = (url: string): boolean => {
  const urlPattern =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  return urlPattern.test(url);
};

export const isVideoFileUrl = (url: string): boolean => {
  const videoFileExtensions: RegExp =
    /\.(mp4|mov|avi|wmv|flv|mkv|webm|mpeg|mpg|m4v)$/i;
  return videoFileExtensions.test(url);
};

export const isImageFileUrl = (url: string): boolean => {
  const imageFileExtensions: RegExp = /\.(jpg|jpeg|png|gif|webp)$/i;
  return imageFileExtensions.test(url);
};

export const convertDateTimeToLocal = (
  datetime?: string | null,
  format: string = "DD/MM/YYYY HH:mm:ss"
): string => {
  if (!datetime) {
    return "";
  }
  const dateTimeFormat = "DD/MM/YYYY HH:mm:ss";
  const dateTimeShortFormat = "DD/MM/YYYY HH:mm";

  if (![dateTimeFormat, dateTimeShortFormat].includes(format)) {
    console.warn(`Unsupport datetime format ${format}`);
    return datetime;
  }

  const utcDatetime = new Date(datetime);

  const formats: Record<string, Intl.DateTimeFormatOptions> = {
    [dateTimeFormat]: {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
    [dateTimeShortFormat]: {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  };

  const options: Intl.DateTimeFormatOptions = formats[format];

  const localDatetimeFormatted = utcDatetime.toLocaleString(undefined, options);

  return localDatetimeFormatted;
};

export const addCommas = (number?: number, value = "0"): string => {
  if (!number) {
    return value;
  }
  const integerPart = Math.floor(number);
  return integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const limitText = (text: string, limit = 20): string => {
  if (!text || !limit) {
    return text;
  }
  const words: string[] = text.split(/\s+/);

  if (words.length > limit) {
    const truncatedText: string = words.slice(0, limit).join(" ");
    return truncatedText + "...";
  }

  return text;
};

export const scrollToDiv = (elId: string, plus = -60, time = 200, elTarget = 'window') => {
  setTimeout(() => {
    const targetDiv = document.getElementById(elId);
    if (targetDiv) {
      const offsetTop = targetDiv.offsetTop + plus;
      if (elTarget === 'window') {
        window.scroll({
          top: offsetTop,
          behavior: "smooth",
        });
      } else {
        const $elTarget = document.getElementById(elTarget);
        if ($elTarget) {
          $elTarget.scrollTop = 0;
        }
      }
    }
  }, time);
};
