import { useState, useCallback } from "react";
import { useFetchData } from "./useFetchData";
import { API_ENDPOINTS, fetchWithCredentials } from "../config/api";
import { toast } from "sonner";

export function useCartData() {
  const [cartData, setCartData] = useState({
    cart: {},
    session_key: null,
    item_count: 0,
    total_items: 0,
    session_expires: null,
  });

  // Callback para procesar los datos del carrito
  const processCartData = useCallback((data) => {
    const cart = data.cart || {};
    // Usar item_count o total_items del backend si está disponible
    // El backend ahora calcula correctamente total_items considerando productos por unidad
    const itemCount =
      data.item_count !== undefined
        ? data.item_count
        : data.total_items !== undefined
        ? data.total_items
        : Object.keys(cart).length;

    setCartData({
      cart: cart,
      session_key: data.session_key,
      item_count: itemCount,
      total_items: data.total_items || itemCount,
      session_expires: data.session_expires,
    });
  }, []);

  // Hook para obtener datos del carrito
  const { loading, error, refetch } = useFetchData(
    API_ENDPOINTS.cart(),
    processCartData
  );

  // Función para eliminar producto del carrito
  const deleteFromCart = useCallback(async (productId) => {
    try {
      const response = await fetchWithCredentials(
        API_ENDPOINTS.cartItem(productId),
        { method: "DELETE" }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();

      // Actualizar el estado local usando datos del backend si están disponibles
      const backendItemCount =
        data.item_count !== undefined
          ? data.item_count
          : data.total_items !== undefined
          ? data.total_items
          : undefined;

      setCartData((prevData) => {
        const newCart = { ...prevData.cart };
        delete newCart[productId];

        const itemCount =
          backendItemCount !== undefined
            ? backendItemCount
            : Object.keys(newCart).length;

        return {
          ...prevData,
          cart: data.cart || newCart,
          item_count: itemCount,
          total_items:
            data.total_items !== undefined ? data.total_items : itemCount,
        };
      });

      toast.success("Producto eliminado del carrito");
      return data;
    } catch (error) {
      console.error("❌ Error eliminando del carrito:", error);
      toast.error(`Error al eliminar del carrito: ${error.message}`);
      throw error;
    }
  }, []);

  // Función para agregar producto al carrito
  const addToCart = useCallback(
    async (productId, cantidad, medida, displayValue) => {
      try {
        const response = await fetchWithCredentials(API_ENDPOINTS.cart(), {
          method: "POST",
          body: JSON.stringify({
            product_id: productId,
            cantidad: cantidad,
            measurement: medida,
            display_value: displayValue,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Error response:", errorText);
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`
          );
        }

        const data = await response.json();

        // Actualizar el estado local con los nuevos datos del carrito
        // Usar item_count o total_items del backend si está disponible
        // El backend ahora calcula correctamente total_items considerando productos por unidad
        const backendItemCount =
          data.item_count !== undefined
            ? data.item_count
            : data.total_items !== undefined
            ? data.total_items
            : data.cart
            ? Object.keys(data.cart).length
            : 0;

        setCartData({
          cart: data.cart || {},
          session_key: data.session_key,
          item_count: backendItemCount,
          total_items: data.total_items || backendItemCount,
          session_expires: data.session_expires,
        });

        // No mostrar toast aquí, el componente que llama a addToCart maneja los toasts
        // para poder mostrar mensajes más específicos (ej: cantidad de productos agregados)
        return data;
      } catch (error) {
        console.error("❌ Error agregando al carrito:", error);
        toast.error(`Error al agregar al carrito: ${error.message}`);
        throw error;
      }
    },
    []
  );

  // Función para limpiar todo el carrito
  const clearCart = useCallback(async () => {
    try {
      const response = await fetchWithCredentials(
        `${API_ENDPOINTS.cart().replace("/cart/", "/cart-clear/")}`,
        { method: "POST" }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();

      // Limpiar estado local
      setCartData({
        cart: {},
        session_key: data.session_key,
        item_count: 0,
        total_items: 0,
        session_expires: data.session_expires,
      });

      toast.success("Carrito limpiado");
      return data;
    } catch (error) {
      console.error("❌ Error limpiando carrito:", error);
      throw error;
    }
  }, []);

  // Función para actualizar cantidad de un producto
  const updateQuantity = useCallback(async (productId, newQuantity) => {
    try {
      const response = await fetchWithCredentials(
        API_ENDPOINTS.cartItem(productId),
        {
          method: "PUT",
          body: JSON.stringify({ cantidad: newQuantity }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();

      // Actualizar estado local
      // Usar item_count o total_items del backend si está disponible
      const backendItemCount =
        data.item_count !== undefined
          ? data.item_count
          : data.total_items !== undefined
          ? data.total_items
          : data.cart
          ? Object.keys(data.cart).length
          : 0;

      setCartData((prevData) => ({
        ...prevData,
        cart: data.cart,
        item_count: backendItemCount,
        total_items: data.total_items || backendItemCount,
      }));

      return data;
    } catch (error) {
      console.error("❌ Error actualizando cantidad:", error);
      throw error;
    }
  }, []);

  let cart = cartData.cart || {};

  return {
    // Datos del carrito
    cart,
    sessionKey: cartData.session_key,
    itemCount: cartData.item_count,
    totalItems: cartData.total_items,
    sessionExpires: cartData.session_expires,

    // Estados
    loading,
    error,

    // Funciones
    refetch,
    addToCart,
    deleteFromCart,
    clearCart,
    updateQuantity,

    // Helpers
    isEmpty: Object.keys(cart).length === 0,
    hasItems: Object.keys(cart).length > 0,
  };
}
