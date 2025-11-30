import { useState, useCallback, useMemo, useEffect } from "react";

// measure puede ser: 'kg', 'g', 'bo', 'un'
export function useQuantity(measure) {
  // Determinar si es solo gramos (medición en gramos únicamente)
  const isGramsOnly = measure === "g";

  // Estado para cantidad y unidad seleccionada
  // Si es solo gramos, empezar en 100 (cantidad se maneja directamente en gramos: 100, 200, 300...)
  const [cantidad, setCantidad] = useState(() => {
    // Función inicializadora: se ejecuta solo una vez al montar
    return measure === "g" ? 100 : 1;
  });

  // Solo para 'bo' (ambas), permite alternar entre gramos/kilos
  // Si es 'g', usar 'gm' como unidad interna
  const [unidad, setUnidad] = useState(() => {
    // Función inicializadora: se ejecuta solo una vez al montar
    return measure === "g" ? "gm" : "kg";
  });

  // Efecto para actualizar el estado cuando measure cambia (cuando el producto se carga)
  useEffect(() => {
    if (measure === "g") {
      // Si es gramos, asegurar que cantidad sea 100 y unidad sea "gm"
      setCantidad(100);
      setUnidad("gm");
    } else if (measure === "kg") {
      // Si es kilos, asegurar que cantidad sea 1 y unidad sea "kg"
      setCantidad(1);
      setUnidad("kg");
    } else if (measure === "bo") {
      // Si es both, empezar con kilos por defecto
      setCantidad(1);
      setUnidad("kg");
    } else if (measure === "un") {
      // Si es unidades, cantidad 1
      setCantidad(1);
      setUnidad("kg"); // unidad no importa para unidades
    }
  }, [measure]);

  // Alternar unidad solo si es 'bo'
  const toggleUnidad = useCallback(() => {
    if (measure === "bo") {
      setUnidad((prev) => {
        const newUnidad = prev === "kg" ? "gm" : "kg";
        // Si cambia a gramos, empezar en 100; si cambia a kilos, empezar en 1
        setCantidad(newUnidad === "gm" ? 100 : 1);
        return newUnidad;
      });
    }
  }, [measure]);

  // Incrementar cantidad
  // Si es solo gramos ('g') o si es 'bo' y unidad es 'gm', incrementar de 100 en 100
  const increment = useCallback(() => {
    if (isGramsOnly || (measure === "bo" && unidad === "gm")) {
      setCantidad((prev) => prev + 100);
    } else {
      setCantidad((prev) => prev + 1);
    }
  }, [isGramsOnly, measure, unidad]);

  // Decrementar cantidad
  // Si es solo gramos ('g') o si es 'bo' y unidad es 'gm', decrementar de 100 en 100
  const decrement = useCallback(() => {
    if (isGramsOnly || (measure === "bo" && unidad === "gm")) {
      setCantidad((prev) => (prev > 100 ? prev - 100 : 100));
    } else {
      setCantidad((prev) => (prev > 1 ? prev - 1 : 1));
    }
  }, [isGramsOnly, measure, unidad]);

  // Valor a mostrar en el input
  // Para 'g': cantidad ya está en gramos (100, 200, etc.), no multiplicar
  // Para 'bo' con gramos: cantidad ya está en gramos (100, 200, etc.), no multiplicar
  // Para 'bo' con kilos: cantidad está en kilos (1, 2, etc.)
  // Para 'kg': cantidad está en kilos (1, 2, etc.)
  const displayValue = useMemo(() => {
    // La cantidad ya está en la unidad correcta en todos los casos
    return cantidad;
  }, [cantidad]);

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
