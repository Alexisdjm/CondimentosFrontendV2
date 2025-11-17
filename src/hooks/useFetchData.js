import { useState, useEffect, useCallback } from "react";

export function useFetchData(url, callback, options) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Configuración por defecto con credenciales para sesiones
      const defaultOptions = {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        ...options,
      };

      const res = await fetch(url, defaultOptions);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();

      window.scrollTo(0, 0);

      if (typeof callback === "function") {
        callback(json);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, options, callback]);

  useEffect(() => {
    if (url) fetchData();
  }, [url, fetchData]);

  return { loading, error, refetch: fetchData };
}
