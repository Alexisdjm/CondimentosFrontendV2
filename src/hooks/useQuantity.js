import { useState, useCallback, useMemo } from "react";

// measure puede ser: 'kg', 'gm', 'bo', 'un'
export function useQuantity(measure) {
  // Estado para cantidad y unidad seleccionada
  const [cantidad, setCantidad] = useState(1);
  // Solo para 'bo' (ambas), permite alternar entre gramos/kilos
  const [unidad, setUnidad] = useState(measure === "gm" ? "gm" : "kg");

  // Alternar unidad solo si es 'bo'
  const toggleUnidad = useCallback(() => {
    if (measure === "bo") {
      setUnidad((prev) => (prev === "kg" ? "gm" : "kg"));
      setCantidad(1); // reinicia cantidad al cambiar unidad
    }
  }, [measure]);

  // Incrementar cantidad
  const increment = useCallback(() => {
    setCantidad((prev) => prev + 1);
  }, []);

  // Decrementar cantidad
  const decrement = useCallback(() => {
    setCantidad((prev) => (prev > 1 ? prev - 1 : 1));
  }, []);

  // Valor a mostrar en el input
  const displayValue = useMemo(() => {
    if (measure === "gm") return cantidad * 100; // gramos
    if (measure === "kg") return cantidad; // kilos
    if (measure === "bo") return unidad === "gm" ? cantidad * 100 : cantidad;
    if (measure === "un") return cantidad; // unidades
    return cantidad;
  }, [cantidad, unidad, measure]);

  return {
    cantidad,
    unidad, // 'kg' o 'gm'
    displayValue,
    increment,
    decrement,
    toggleUnidad,
    canToggle: measure === "bo", // para mostrar el switch solo si es ambas
    isUnidad: measure === "un", // para mostrar "Unidad"
  };
}
