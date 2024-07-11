import axios, { AxiosResponse } from "axios";
import { getSecrectKey, objectToFormData, toQueryString } from ".";
import { signOut } from "next-auth/react";

export default class LaravelApiRequest {
  static apiUrl: string = `${process.env.NEXT_PUBLIC_LARAVEL_API_URL!}`;

  static _locale: string = `en`;

  static defaultHeader: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Platform": "web",
    "X-Locale": "en",
  };

  static setHeader(headers: Record<string, string> = {}) {
    LaravelApiRequest.defaultHeader = {
      ...LaravelApiRequest.defaultHeader,
      ...headers,
    };

    return LaravelApiRequest;
  }

  static getHeader() {
    return LaravelApiRequest.defaultHeader;
  }

  static auth(token: string) {
    LaravelApiRequest.defaultHeader = {
      ...LaravelApiRequest.defaultHeader,
      Authorization: `Bearer ${token}`,
    };
    return LaravelApiRequest;
  }

  static locale(locale?: string) {
    if (locale) {
      LaravelApiRequest._locale = locale;
      LaravelApiRequest.defaultHeader = {
        ...LaravelApiRequest.defaultHeader,
        "X-Locale": locale,
      };
    }

    return LaravelApiRequest;
  }

  static async get(
    path: string,
    input?: Record<string, any>,
    options?: Record<string, any>
  ): Promise<LaravelResponseData> {
    const response: LaravelResponseData = await LaravelApiRequest.request(
      path,
      "GET",
      input,
      options
    );

    return response;
  }

  static async post(
    path: string,
    input?: Record<string, any>,
    options?: Record<string, any>
  ): Promise<LaravelResponseData> {
    const response = await LaravelApiRequest.request(
      path,
      "POST",
      input,
      options
    );

    return response;
  }

  static async put(
    path: string,
    input?: Record<string, any>,
    options?: Record<string, any>
  ): Promise<LaravelResponseData> {
    const response = await LaravelApiRequest.request(
      path,
      "PUT",
      input,
      options
    );

    return response;
  }

  static async patch(
    path: string,
    input?: Record<string, any>,
    options?: Record<string, any>
  ): Promise<LaravelResponseData> {
    const response = await LaravelApiRequest.request(
      path,
      "PATCH",
      input,
      options
    );

    return response;
  }

  static async delete(
    path: string,
    input?: Record<string, any>,
    options?: Record<string, any>
  ): Promise<LaravelResponseData> {
    const response = await LaravelApiRequest.request(
      path,
      "DELETE",
      input,
      options
    );

    return response;
  }

  static async request(
    path: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    input?: Record<string, any>,
    options?: Record<string, any>
  ): Promise<LaravelResponseData> {
    const headers = LaravelApiRequest.getHeader();

    let data = {};
    let queryString = "";

    if (method === "GET" && input) {
      queryString = `?${toQueryString(input)}`;
    }

    if (method !== "GET" && input) {
      data = {
        body: JSON.stringify(input),
      };
    }

    const url = `${LaravelApiRequest.apiUrl}${path}${queryString}`;

    try {
      const response = await fetch(url, {
        method,
        headers,
        ...data,
        ...(!options ? {} : options),
      });

      return LaravelApiRequest.handleResponse(response);
    } catch (error) {
      console.log(`ERROR ${method}-${path}`, error);
      return {
        success: false,
        message: "Request failed",
        response_ok: false,
      };
    }
  }

  static async form(
    path: string,
    method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
    input?: Record<string, any>,
    options?: Record<string, any>
  ): Promise<LaravelResponseData> {
    let headers = LaravelApiRequest.getHeader();

    const formData: FormData | undefined = input
      ? objectToFormData(input)
      : undefined;

    const url = `${LaravelApiRequest.apiUrl}${path}`;

    // Remove Content-Type to upload file
    if ("Content-Type" in headers) {
      delete headers["Content-Type"];
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        ...(formData ? { body: formData } : {}),
        ...(!options ? {} : options),
      });

      return LaravelApiRequest.handleResponse(response);
    } catch (error) {
      console.log(`ERROR ${method}-${path}`, error);
      return {
        success: false,
        message: "Request failed",
        response_ok: false,
      };
    }
  }

  static async upload(
    path: string,
    input?: Record<string, any>,
    options?: Record<string, any>
  ): Promise<LaravelResponseData> {
    let headers = LaravelApiRequest.getHeader();

    const formData: FormData | undefined = input
      ? objectToFormData(input)
      : undefined;

    const url = `${LaravelApiRequest.apiUrl}${path}`;

    // @ts-ignore
    headers["Content-Type"] = "multipart/form-data";

    try {
      const response: AxiosResponse = await axios.post(url, formData, {
        headers: headers,
        ...(options ? options : {}),
      });

      const data: LaravelResponseData = response.data;
      data.response_ok = response.statusText === "OK";
      data.response_status = response.status;

      return data;
    } catch (error: any) {
      console.log(`ERROR upload-${path}`, error);
      await LaravelApiRequest.unauthentication(
        +(error?.response?.status ?? 400)
      );

      return {
        success: false,
        message: "Request failed",
        response_ok: false,
        response_status: error?.response?.status ?? 400,
        ...(error?.response?.data ?? {}),
      };
    }
  }

  static async handleResponse(response: Response) {
    const responseData: LaravelResponseData = await response.json();

    responseData["response_status"] = response.status;
    responseData["response_ok"] = response.ok;

    await LaravelApiRequest.unauthentication(+(response.status ?? 400));

    return responseData;
  }

  static async unauthentication(status: number) {
    if (status === 401 && typeof window !== "undefined") {
      const locale = LaravelApiRequest._locale;
      LaravelApiRequest.auth("");
      await signOut({
        callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/auth/login`,
      });
    }
  }
}
