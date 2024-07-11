import { objectToFormData, toQueryString } from ".";

export default class NextApiRequest {
  static apiUrl: string = `${process.env.NEXT_PUBLIC_NEXT_API_URL!}`;

  static defaultHeader: Record<string, string> = {
    accept: "application/json",
    "content-Type": "application/json",
    "x-platform": "web",
    "x-locale": "en",
  };

  static setHeader(headers: Record<string, string> = {}) {
    NextApiRequest.defaultHeader = {
      ...NextApiRequest.defaultHeader,
      ...headers,
    };

    return NextApiRequest;
  }

  static getHeader() {
    return NextApiRequest.defaultHeader;
  }

  static locale(locale: string) {
    NextApiRequest.defaultHeader = {
      ...NextApiRequest.defaultHeader,
      "x-locale": locale,
    };
    return NextApiRequest;
  }

  static async get(
    path: string,
    input?: Record<string, any>,
    options?: Record<string, any>
  ): Promise<any> {
    const response: any = await NextApiRequest.request(
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
  ): Promise<any> {
    const response = await NextApiRequest.request(path, "POST", input, options);

    return response;
  }

  static async put(
    path: string,
    input?: Record<string, any>,
    options?: Record<string, any>
  ): Promise<any> {
    const response = await NextApiRequest.request(path, "PUT", input, options);

    return response;
  }

  static async patch(
    path: string,
    input?: Record<string, any>,
    options?: Record<string, any>
  ): Promise<any> {
    const response = await NextApiRequest.request(path, "PATCH", input, options);

    return response;
  }

  static async delete(
    path: string,
    input?: Record<string, any>,
    options?: Record<string, any>
  ): Promise<any> {
    const response = await NextApiRequest.request(path, "DELETE", input, options);

    return response;
  }

  static async request(
    path: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    input?: Record<string, any>,
    options?: Record<string, any>
  ): Promise<any> {
    const headers = NextApiRequest.getHeader();
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

    const url = `${NextApiRequest.apiUrl}${path}${queryString}`;

    const response = await fetch(url, {
      method,
      headers,
      ...data,
      ...(!options ? {} : options),
    });

    return response.json();
  }

  static async form(
    path: string,
    method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
    input?: Record<string, any>,
    options?: Record<string, any>
  ): Promise<any> {
    const headers = NextApiRequest.getHeader();

    const formData: FormData | undefined = input
      ? objectToFormData(input)
      : undefined;

    const response = await fetch(`${NextApiRequest.apiUrl}${path}`, {
      method,
      headers: {
        ...headers,
        "content-type": "multipart/form-data",
      },
      ...(formData ? { body: formData } : {}),
      ...(!options ? {} : options),
    });

    return response.json();
  }
}
