import { useState, useCallback } from "react";
import axios from "axios";
import type { AxiosResponse } from "axios";

// ⏳ تأخير التنفيذ (للـ retries)
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

interface ResponseState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  status: number | null;
}

export default function usePut<T = any, B = any>() {
  const [response, setResponse] = useState<ResponseState<T>>({
    data: null,
    loading: false,
    error: null,
    status: null,
  });

  const put = useCallback(
    async (
      url: string,
      body: B,
      retries = 0,
      retryDelay = 1000
    ): Promise<T | { success: false; error: string }> => {
      const token = localStorage.getItem("token");
      setResponse({ data: null, loading: true, error: null, status: null });

      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const res: AxiosResponse<T> = await axios.put(url, body, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              // "Content-Type": "application/json",
            },
          });

          setResponse({
            data: res.data,
            loading: false,
            error: null,
            status: res.status,
          });

          return res.data;
        } catch (err: any) {
          if (attempt < retries) {
            await delay(retryDelay);
            continue;
          }

     const apiError = err?.response?.data;

  const extractedMessage: string =
    apiError?.error?.message ??
    apiError?.message ??
    err?.response?.data?.message ??
    err?.message ??
    "Unknown error occurred";

          setResponse({
            data: null,
            loading: false,
            error: extractedMessage,
            status: err.response?.status || null,
          });

          return { success: false, error: extractedMessage };
        }
      }

      return { success: false, error: "Request failed after all retries" };
    },
    []
  );

  return { ...response, put };
}
