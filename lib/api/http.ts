type QueryValue = string | number | boolean | null | undefined;

type QueryParams = Record<string, QueryValue | QueryValue[]>;

export class ApiError extends Error {
  status: number;
  url: string;
  details: unknown;

  constructor(message: string, status: number, url: string, details: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.url = url;
    this.details = details;
  }
}

export interface ApiRequestOptions extends Omit<RequestInit, "body" | "method" | "headers"> {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  query?: QueryParams;
  body?: unknown;
}

function getBaseUrl(): string {
  const baseUrl = process.env.BASE_URL ?? process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error(
      "Missing BASE_URL in environment. Please define BASE_URL (or NEXT_PUBLIC_BASE_URL for client use) in .env.",
    );
  }

  return baseUrl.replace(/\/+$/, "");
}

function buildUrl(path: string, query?: QueryParams): string {
  const normalizedPath = path.startsWith("http")
    ? path
    : `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  if (!query) {
    return normalizedPath;
  }

  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, rawValue]) => {
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];

    values.forEach((value) => {
      if (value === null || value === undefined) {
        return;
      }

      searchParams.append(key, String(value));
    });
  });

  const queryString = searchParams.toString();
  if (!queryString) {
    return normalizedPath;
  }

  return `${normalizedPath}${normalizedPath.includes("?") ? "&" : "?"}${queryString}`;
}

function shouldStringifyBody(body: unknown): body is Record<string, unknown> | unknown[] {
  if (body === null || body === undefined) {
    return false;
  }

  if (
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    body instanceof ReadableStream
  ) {
    return false;
  }

  return typeof body === "object";
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    headers = {},
    query,
    body,
    ...rest
  } = options;

  const url = buildUrl(path, query);

  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };

  let requestBody: BodyInit | undefined;

  if (body !== undefined) {
    if (shouldStringifyBody(body)) {
      requestBody = JSON.stringify(body);
      if (!requestHeaders["Content-Type"]) {
        requestHeaders["Content-Type"] = "application/json";
      }
    } else {
      requestBody = body as BodyInit;
    }
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: requestBody,
    ...rest,
  });

  if (!response.ok) {
    let details: unknown;

    try {
      details = await parseResponse<unknown>(response);
    } catch {
      details = null;
    }

    throw new ApiError(
      `Request failed with status ${response.status}`,
      response.status,
      url,
      details,
    );
  }

  return parseResponse<T>(response);
}

export const http = {
  get: <T = unknown>(path: string, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...options, method: "GET" }),

  post: <T = unknown>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...options, method: "POST", body }),

  put: <T = unknown>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...options, method: "PUT", body }),

  patch: <T = unknown>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...options, method: "PATCH", body }),

  delete: <T = unknown>(path: string, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...options, method: "DELETE" }),
};
