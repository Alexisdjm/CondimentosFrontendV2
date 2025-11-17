import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";

/**
 * Hook personalizado para manejar la lógica de agregar productos al carrito
 * Incluye batch/debounce, actualización del bubble, y manejo de errores
 */
export function useAddToCart(
  product,
  cantidad,
  unidad,
  displayValue,
  isUnidad
) {
  const {
    addToCart,
    loading: cartLoading,
    cart,
    incrementItemCount,
    decrementItemCount,
  } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAdded, setShowAdded] = useState(false);
  const pendingAddsRef = useRef([]);

  // Determinar si el producto se vende por unidad
  const isProductUnit = product?.measurement === "un" || isUnidad;

  // Handler para agregar al carrito
  const handleAddToCart = useCallback(async () => {
    if (!product?.id) {
      return;
    }

    // Mostrar "added" inmediatamente
    setShowAdded(true);
    setTimeout(() => {
      setShowAdded(false);
    }, 1000); // Mostrar "added" por 1 segundo

    // Acumular el clic para procesarlo después del delay
    pendingAddsRef.current.push({
      productId: product.id,
      cantidad,
      unidad: isUnidad ? "un" : unidad,
      displayValue,
    });

    // Verificar si el producto ya está en el carrito (para productos por peso)
    const productAlreadyInCart = cart && cart[product.id] ? true : false;

    // Incrementar el contador con delay:
    // - Si es producto por unidad: incrementar por la cantidad seleccionada
    //   Ejemplo: si se seleccionan 2 unidades, sumar 2 al bubble
    // - Si es producto por peso: solo incrementar si NO está en el carrito (primera vez)
    //   Si ya está en el carrito, el backend solo suma cantidades, no agrega nuevo producto
    if (isProductUnit) {
      // Producto por unidad: sumar la cantidad seleccionada al bubble
      // Si se seleccionan 2 unidades, el bubble pasa de 0 a 2, de 1 a 3, etc.
      incrementItemCount(true, product.id, cantidad);
    } else if (!productAlreadyInCart) {
      // Producto por peso: solo incrementar si es la primera vez
      incrementItemCount(false, product.id);
    }
    // Si es producto por peso y ya está en el carrito, no incrementar el bubble

    // Procesar después de 0.4 segundos (batch)
    setTimeout(async () => {
      const addsToProcess = [...pendingAddsRef.current];
      pendingAddsRef.current = [];

      if (addsToProcess.length === 0) return;

      setIsAddingToCart(true);

      // Procesar todas las adiciones acumuladas
      const promises = addsToProcess.map((add) =>
        addToCart(add.productId, add.cantidad, add.unidad, add.displayValue)
      );

      try {
        const results = await Promise.all(promises);
        const allSuccess = results.every((res) => res && res.message);

        if (allSuccess) {
          toast.success(
            `${addsToProcess.length} producto${
              addsToProcess.length > 1 ? "s" : ""
            } agregado${addsToProcess.length > 1 ? "s" : ""} al carrito`
          );
        } else {
          toast.error("Error al agregar algunos productos al carrito");
          // Revertir los incrementos fallidos
          const failedCount = results.filter(
            (res) => !res || !res.message
          ).length;
          for (let i = 0; i < failedCount; i++) {
            decrementItemCount();
          }
        }
      } catch (error) {
        console.error("❌ Error al agregar al carrito:", error);
        toast.error("Error al agregar al carrito");
        // Revertir todos los incrementos en caso de error
        for (let i = 0; i < addsToProcess.length; i++) {
          decrementItemCount();
        }
      } finally {
        setIsAddingToCart(false);
      }
    }, 400);
  }, [
    product,
    cantidad,
    unidad,
    displayValue,
    isUnidad,
    isProductUnit,
    cart,
    addToCart,
    incrementItemCount,
    decrementItemCount,
  ]);

  return {
    handleAddToCart,
    isAddingToCart,
    showAdded,
    cartLoading,
  };
}
