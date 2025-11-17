import { useState, useCallback } from "react";
import axios from "axios";
import type { AxiosResponse  } from "axios";

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

interface ResponseState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  status: number | null;
}

export default function useDelete<T = any>() {
  const [response, setResponse] = useState<ResponseState<T>>({
    data: null,
    loading: false,
    error: null,
    status: null,
  });

  const del = useCallback(
    async (
      url: string,
      retries = 0,
      retryDelay = 1000
    ): Promise<T | { success: false; error: string }> => {
      const token = localStorage.getItem("token");
      setResponse({ data: null, loading: true, error: null, status: null });

      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const res: AxiosResponse<T> = await axios.delete(url, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          });

          setResponse({
            data: res.data,
            loading: false,
            error: null,
            status: res.status,
          });

          return res.data;
        } 
          catch (err: any) {
          if (attempt < retries) {
            await delay(retryDelay);
            continue;
          }

       const errorData = err.response?.data;
const extractedMessage: string =
  typeof errorData?.error?.message === "string"
    ? errorData.error.message
    : Array.isArray(errorData?.error?.message)
    ? errorData.error.message.join(", ")
    : errorData?.error?.message?.message ||
      errorData?.message ||
      err.message ||
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

  return { ...response, del };
}
