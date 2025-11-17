import { useState, useEffect } from "react";
import { fetchWithCredentials, API_ENDPOINTS } from "../config/api";

const useFeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchWithCredentials(
          API_ENDPOINTS.productsFeatured()
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Manejar diferentes formatos de respuesta
        const featuredProducts =
          data.featured_products || data.results || data.products || data || [];
        setProducts(featuredProducts);
      } catch (err) {
        console.error("❌ Error cargando productos destacados:", err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return {
    products,
    loading,
    error,
  };
};

export default useFeaturedProducts;
