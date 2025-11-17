import { useState, useCallback } from "react";
import { useFetchData } from "./useFetchData";

export function useProductsByCategory(url, category) {
  const [productsCache, setProductsCache] = useState({});
  const [elements, setElements] = useState(null);

  const handleProducts = useCallback(
    (json) => {
      setElements(json);
      setProductsCache(prev => ({
        ...prev,
        [category]: json
      }));
    },
    [category]
  );

  // ✅ Llamar siempre al hook
  const { loading, error } = useFetchData(url, handleProducts);

  // Si ya está en cache, usarlo
  const dataToShow = productsCache[category] || elements;

  return {
    elements: dataToShow,
    loading,
    error
  };
}