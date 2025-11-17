import { useState, useCallback } from "react";
import axios from "axios";
import type { AxiosResponse } from "axios";

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

interface ResponseState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  status: number | null;
}

export default function useGet<T = []>() {
  const [response, setResponse] = useState<ResponseState<T>>({
    data: null,
    loading: false,
    error: null,
    status: null,
  });

  const get = useCallback(
    async (url: string, retries = 0, retryDelay = 1000): Promise<T | null> => {
      const token = localStorage.getItem("token");

      setResponse({ data: null, loading: true, error: null, status: null });

      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const res: AxiosResponse<any> = await axios.get(url, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          });

          const normalizedData = Array.isArray(res.data)
            ? res.data
            : res.data?.data?.users || res.data?.data || res.data;

          setResponse({
            data: normalizedData,
            loading: false,
            error: null,
            status: res.status,
          });

          return normalizedData;
        } catch (err: any) {
          if (attempt < retries) {
            await delay(retryDelay);
            continue;
          }

          setResponse({
            data: null,
            loading: false,
            error:
              err.response?.data?.message ||
              err.message ||
              "Unknown error occurred",
            status: err.response?.status || null,
          });
        }
      }

      return null;
    },
    []
  );

  return { ...response, get };
}
