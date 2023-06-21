import { useEffect, useId, useMemo, useState } from "react";

const errorSchema = { happened: false, message: "", cause: null };
const process = {};

export function useFetch() {
  const id = useId();
  // const fetcherRef = useRef(fetcher);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(errorSchema);

  useEffect(() => {
    process[id] = true;
    return () => {
      console.log("cleaning up useFetch for:", id);
      process[id] = false;
    };
  }, [id]);

  const request = useMemo(
    () => ({
      loading: false,
      data: null,
      error: errorSchema,
      success: false,
      trigger: async (fetcher = async () => {}) => {
        console.log("triggering...");
        setLoading(true);
        setError(errorSchema);

        try {
          const data = await fetcher();
          if (!process[id]) {
            console.log("preventing rerendering updating...");
            delete process[id];
            return;
          }

          console.log(typeof data, data);
          setData(data);
          setSuccess(true);
        } catch (error) {
          if (!process[id]) {
            console.log("preventing rerendering updating...");
            delete process[id];
            return;
          }
          setError({ happened: true, message: error.message, cause: error });
          setSuccess(false);
          setData(null);
        } finally {
          setLoading(false);
        }
      },
    }),
    [id],
  );

  request.success = success;
  request.data = data;
  request.loading = loading;
  request.error = error;

  return request;
}
