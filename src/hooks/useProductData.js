import { useState, useCallback, useMemo } from "react";
import { useFetchData } from "./useFetchData";
import useLastPathSegment from "./useLastPath";
import { API_ENDPOINTS } from "../config/api";

export function useProductData() {
  const lastPath = useLastPathSegment();
  const loc = API_ENDPOINTS.product(lastPath);

  const [product, setProduct] = useState(null);

  const handleData = useCallback((json) => {
    if ("detail" in json) {
      window.location.pathname = "/404";
      return;
    }
    if (json?.product) {
      setProduct(json.product);
      return;
    }
    // Fallback por si la API cambia y devuelve el objeto directo
    setProduct(json);
  }, []);

  const stableOptions = useMemo(() => ({}), []);

  const { loading, error, refetch } = useFetchData(
    loc,
    handleData,
    stableOptions
  );

  return { product, loading, error, refetch };
}
