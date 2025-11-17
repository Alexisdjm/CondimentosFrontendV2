import { useState, useEffect, useCallback, useRef } from "react";
import { fetchWithCredentials, API_ENDPOINTS } from "../config/api";

const useInfiniteProducts = (category = null) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  // Ref para evitar múltiples llamadas simultáneas
  const loadingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Función para agregar delay
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Función para cargar productos
  const loadProducts = useCallback(
    async (page = 1, isInitialLoad = false) => {
      if (loadingRef.current) {
        return;
      }

      loadingRef.current = true;

      try {
        // Construir URL según la categoría
        let url;
        if (category && category !== "all") {
          url = `${API_ENDPOINTS.productsByCategory(category, page)}`;
        } else {
          url = `${API_ENDPOINTS.products(page)}`;
        }

        const response = await fetchWithCredentials(url);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        const newProducts = data.results || data.products || [];
        const paginationInfo = data.pagination || {};
        const total =
          data.count ||
          data.total ||
          paginationInfo.total_products ||
          newProducts.length;

        // Actualizar total conocido de productos
        setTotalProducts(total);

        if (page === 1) {
          // Primera carga
          setProducts(newProducts);
          setCurrentPage(1);
          if (category && category !== "all") {
            setHasMore(paginationInfo.has_next ?? false);
          } else {
            setHasMore(
              paginationInfo.has_next ??
                (newProducts.length > 0 && newProducts.length < total)
            );
          }
        } else {
          // Carga adicional
          setProducts((prevProducts) => {
            // Filtrar duplicados basado en ID
            const existingIds = new Set(prevProducts.map((p) => p.id));
            const uniqueNewProducts = newProducts.filter(
              (p) => !existingIds.has(p.id)
            );

            const updatedProducts = [...prevProducts, ...uniqueNewProducts];
            const totalLoaded = updatedProducts.length;

            // Verificar si hay más productos
            if (category && category !== "all") {
              setHasMore(paginationInfo.has_next ?? false);
            } else {
              setHasMore(paginationInfo.has_next ?? totalLoaded < total);
            }

            return updatedProducts;
          });
          setCurrentPage(page);
        }

        setError(null);
      } catch (err) {
        console.error(`❌ Error cargando página ${page}:`, err);
        setError(err.message);
        setHasMore(false);
      } finally {
        loadingRef.current = false;
      }
    },
    [category]
  );

  // Carga inicial
  useEffect(() => {
    setLoading(true);
    setError(null);
    setProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    setTotalProducts(0);
    setIsLoadingMore(false);
    loadingRef.current = false;

    loadProducts(1, true).finally(() => {
      setLoading(false);
    });
  }, [category, loadProducts]);

  // Función para detectar si estamos cerca del final
  const isNearBottom = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Si está a 1500px del final, cargar más
    const isNear = scrollTop + windowHeight >= documentHeight - 1500;

    return isNear;
  }, []);

  // Manejar scroll para cargar más productos
  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        if (hasMore && !loading && !isLoadingMore && isNearBottom()) {
          setIsLoadingMore(true);

          // Agregar delay de 1-2 segundos
          delay(1500).then(() => {
            loadProducts(currentPage + 1).finally(() => {
              setIsLoadingMore(false);
            });
          });
        }
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [
    hasMore,
    loading,
    isLoadingMore,
    currentPage,
    isNearBottom,
    loadProducts,
  ]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    products,
    loading,
    hasMore,
    error,
    isLoadingMore,
    totalProducts,
  };
};

export default useInfiniteProducts;
