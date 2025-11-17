// Configuración centralizada de la API
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

// Configuración de fetch con credenciales para sesiones
export const fetchWithCredentials = (url, options = {}) => {
  return fetch(url, {
    ...options,
    credentials: "include", // CRUCIAL para sesiones
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
};

// Función helper para manejar errores
export const handleApiError = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
};

// URLs de endpoints
export const API_ENDPOINTS = {
  // Productos - Nueva estructura
  products: (page = 1) => `${API_BASE_URL}/consulta/?page=${page}`,
  productsFeatured: () => `${API_BASE_URL}/products/featured/`,
  productsByCategory: (category, page = 1) =>
    `${API_BASE_URL}/category/${category}/?page=${page}`,

  // Producto individual
  product: (id) => `${API_BASE_URL}/item/${id}/`,

  // Consulta y búsqueda
  allProducts: () => `${API_BASE_URL}/consulta/?page=1`,
  searchProducts: (term) =>
    `${API_BASE_URL}/consulta/?search=${encodeURIComponent(term)}`,

  // Carrito
  cart: () => `${API_BASE_URL}/cart/`,
  cartItem: (id) => `${API_BASE_URL}/cart/${id}/`,

  // Colecciones
  collections: () => `${API_BASE_URL}/collections/`,
};

export { API_BASE_URL };
