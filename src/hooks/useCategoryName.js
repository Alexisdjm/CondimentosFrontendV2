export function useCategoryName(code) {
  const categoryMap = {
    co: "Condimentos y Especias",
    bk: "Productos de Repostería",
    nt: "Frutos Secos",
    gr: "Granos y Cereales",
    gc: "Víveres",
    ch: "Químicos y Más",
  };

  return categoryMap[code] ?? "Sin categoría";
}