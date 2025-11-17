import { useState } from "react";
import { fetchWithCredentials, API_ENDPOINTS } from "../config/api";

function useCart() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addToCart = async (url, id, cantidad, medida, displayValue = null) => {
    // Prevenir múltiples peticiones simultáneas
    if (loading) {
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchWithCredentials(url, {
        method: "POST",
        body: JSON.stringify({
          product_id: id,
          cantidad: cantidad,
          measurement: medida,
          display_value: displayValue,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setLoading(false);
      return data;
    } catch (err) {
      console.error("❌ Error agregando al carrito:", err);
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const deleteCart = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithCredentials(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setLoading(false);
      return data;
    } catch (err) {
      console.error("❌ Error eliminando del carrito:", err);
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  // Nuevos métodos usando la configuración centralizada
  const getCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithCredentials(API_ENDPOINTS.cart());

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setLoading(false);
      return data;
    } catch (err) {
      console.error("❌ Error obteniendo carrito:", err);
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const addToCartById = async (
    productId,
    cantidad = 1,
    medida = "gm",
    displayValue = null
  ) => {
    return addToCart(
      API_ENDPOINTS.cart(),
      productId,
      cantidad,
      medida,
      displayValue
    );
  };

  const deleteCartById = async (productId) => {
    return deleteCart(API_ENDPOINTS.cartItem(productId));
  };

  return {
    addToCart,
    deleteCart,
    getCart,
    addToCartById,
    deleteCartById,
    loading,
    error,
  };
}

export default useCart;
