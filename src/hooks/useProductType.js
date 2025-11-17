/**
 * Hook para determinar el tipo de producto y su estado en el carrito
 * @param {Object} product - Producto a analizar
 * @param {Object} cart - Carrito actual
 * @param {boolean} isUnidad - Si el producto está en modo unidad
 * @returns {Object} - Información sobre el tipo de producto
 */
export function useProductType(product, cart, isUnidad = false) {
  // Determinar si el producto se vende por unidad
  const isProductUnit = product?.measurement === "un" || isUnidad;

  // Verificar si el producto ya está en el carrito
  const productAlreadyInCart = cart && product?.id && cart[product.id] ? true : false;

  return {
    isProductUnit,
    productAlreadyInCart,
  };
}
