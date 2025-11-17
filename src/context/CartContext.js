import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useFetchData } from "../hooks/useFetchData";
import { API_ENDPOINTS, fetchWithCredentials } from "../config/api";
import { toast } from "sonner";

const CartContext = createContext();

/**
 * Hook único para acceder al carrito y todas sus funciones
 * Reemplaza tanto useCartData() como useCartContext()
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

/**
 * Alias para mantener compatibilidad con código existente
 * @deprecated Usar useCart() en su lugar
 */
export const useCartContext = () => useCart();

export const CartProvider = ({ children }) => {
  // ========== ESTADO DEL CARRITO (lógica de useCartData) ==========
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

  // ========== ESTADO DEL BUBBLE (lógica del bubble) ==========
  const [itemCount, setItemCount] = useState(0);
  const pendingIncrementsRef = useRef(0);
  const debounceTimerRef = useRef(null);

  // Sincronizar bubble con el backend cuando carga
  useEffect(() => {
    if (!loading && cartData.item_count !== undefined) {
      setItemCount(cartData.item_count);
    }
  }, [cartData.item_count, loading]);

  // Función para incrementar el contador con delay y batch
  const incrementItemCount = (
    isUnit = false,
    productId = null,
    quantity = 1
  ) => {
    if (!isUnit) {
      pendingIncrementsRef.current = 1;
    } else {
      pendingIncrementsRef.current += quantity;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const increments = pendingIncrementsRef.current;
      pendingIncrementsRef.current = 0;
      setItemCount((prev) => prev + increments);
    }, 400);
  };

  // Función para decrementar el contador
  const decrementItemCount = () => {
    setItemCount((prev) => Math.max(0, prev - 1));
  };

  // Función para establecer el contador directamente
  const setItemCountValue = (value) => {
    setItemCount(Math.max(0, value));
  };

  // Función para resetear el contador
  const resetItemCount = () => {
    setItemCount(0);
    pendingIncrementsRef.current = 0;
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  };

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Preparar el objeto cart para evitar recalcularlo
  const cart = cartData.cart || {};

  // ========== VALOR DEL CONTEXT (todo lo que se expone) ==========
  const value = {
    // Datos del carrito
    cart,
    sessionKey: cartData.session_key,
    itemCount: cartData.item_count,
    totalItems: cartData.total_items,
    sessionExpires: cartData.session_expires,

    // Estados
    loading,
    error,

    // Funciones del carrito
    refetch,
    addToCart,
    deleteFromCart,
    clearCart,
    updateQuantity,

    // Helpers del carrito
    isEmpty: Object.keys(cart).length === 0,
    hasItems: Object.keys(cart).length > 0,

    // Estado del bubble
    bubbleItemCount: itemCount,
    incrementItemCount,
    decrementItemCount,
    setItemCountValue,
    resetItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
