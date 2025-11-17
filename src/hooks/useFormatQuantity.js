/**
 * Hook para formatear la cantidad de un producto según su tipo de medida
 * @param {Object} product - Producto con información de cantidad y medida
 * @returns {string} - Cantidad formateada (ej: "3kg 500g", "2 unidades")
 */
export function useFormatQuantity() {
  const formatQuantity = (product) => {
    if (product.cantidad_formateada) {
      return product.cantidad_formateada;
    }

    const { cantidad, medida } = product;

    if (product.cantidad_total_gramos != null) {
      const totalGrams = Math.round(product.cantidad_total_gramos);
      const kilos = Math.floor(totalGrams / 1000);
      const grams = totalGrams % 1000;
      if (kilos > 0 && grams > 0) {
        return `${kilos}kg ${grams}g`;
      }
      if (kilos > 0) {
        return `${kilos}kg`;
      }
      return `${totalGrams}g`;
    }

    if (medida === "gm") {
      return `${cantidad}g`;
    } else if (medida === "kg") {
      return `${cantidad}kg`;
    } else if (medida === "un") {
      return `${cantidad} unidades`;
    }

    // Fallback para productos con medida antigua
    if (product.gramos) {
      return `${parseFloat(cantidad) * 100}g`;
    } else if (product.name && product.name.includes(" gr")) {
      return `${cantidad} unidades`;
    } else {
      return `${cantidad}kg`;
    }
  };

  return { formatQuantity };
}
