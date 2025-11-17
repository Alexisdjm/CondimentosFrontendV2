import { useCallback } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";

/**
 * Hook para manejar las acciones del carrito (eliminar, limpiar, proceder al pago)
 */
export function useCartActions() {
  const {
    cart,
    deleteFromCart,
    clearCart,
    decrementItemCount,
    setItemCountValue,
  } = useCart();

  // Función para proceder al pago (WhatsApp)
  const handleProceedToPayment = useCallback(
    (formatQuantity) => {
      const phoneNumber = "584129692100";
      const products = Object.values(cart)
        .map(
          (product) => `${product.name} - cantidad: ${formatQuantity(product)}`
        )
        .join("\n");

      const message = `Buen día, vengo desde su sitio web, me gustaría hacer la siguiente compra:\n${products}`;
      const encodedMessage = encodeURIComponent(message);
      const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

      window.location.href = url;
    },
    [cart]
  );

  // Función para eliminar producto
  const handleDeleteProduct = useCallback(
    async (productId) => {
      try {
        // Obtener información del producto antes de eliminarlo
        const product = cart[productId];
        if (!product) return;

        // Determinar si es producto por unidad
        const isProductUnit =
          product?.medida === "un" || product?.cantidad_total_unidades;

        // Eliminar del backend (esto actualizará el estado automáticamente)
        await deleteFromCart(productId);

        // Actualizar el bubble después de eliminar exitosamente
        if (isProductUnit && product?.cantidad) {
          // Producto por unidad: restar la cantidad de unidades del bubble
          const unidades = parseInt(product.cantidad) || 1;
          for (let i = 0; i < unidades; i++) {
            decrementItemCount();
          }
        } else {
          // Producto por peso: solo restar 1 (es un producto único)
          decrementItemCount();
        }
      } catch (error) {
        console.error("Error eliminando producto:", error);
        toast.error(
          "Error al eliminar el producto. Por favor, intenta nuevamente."
        );
      }
    },
    [cart, deleteFromCart, decrementItemCount]
  );

  // Función para limpiar todo el carrito
  const handleClearCart = useCallback(async () => {
    if (
      window.confirm("¿Estás seguro de que quieres limpiar todo el carrito?")
    ) {
      try {
        // Limpiar el carrito en el backend (esto actualizará el estado automáticamente)
        await clearCart();

        // Resetear el bubble a 0 después de limpiar exitosamente
        setItemCountValue(0);
      } catch (error) {
        console.error("Error limpiando carrito:", error);
        toast.error(
          "Error al limpiar el carrito. Por favor, intenta nuevamente."
        );
      }
    }
  }, [clearCart, setItemCountValue]);

  return {
    handleDeleteProduct,
    handleClearCart,
    handleProceedToPayment,
  };
}
