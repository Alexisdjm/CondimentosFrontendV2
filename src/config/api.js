// Configuración centralizada de la API
// Soporta variables de entorno en build time (process.env) y runtime (window._env_)
// En desarrollo: usa REACT_APP_API_URL o por defecto localhost
// En producción: puede usar variables de entorno en runtime a través de window._env_

const getEnvVar = (varName, defaultValue) => {
  // Primero intentar leer de window._env_ (runtime, útil para Docker)
  if (typeof window !== "undefined" && window._env_ && window._env_[varName]) {
    return window._env_[varName];
  }
  // Luego intentar process.env (build time)
  if (process.env[varName]) {
    return process.env[varName];
  }
  return defaultValue;
};

const getApiBaseUrl = () => {
  const apiUrl = getEnvVar("REACT_APP_API_URL", null);
  if (apiUrl) {
    return apiUrl;
  }
  // Fallback para desarrollo local
  if (process.env.NODE_ENV === "development") {
    return "http://127.0.0.1:8000/api";
  }
  // En producción sin variable, usar dominio por defecto
  return "https://casacondimentos.com/api";
};

const API_BASE_URL = getApiBaseUrl();

// URL base para medios/imágenes (puede ser diferente de la API)
const getMediaBaseUrl = () => {
  const mediaUrl = getEnvVar("REACT_APP_MEDIA_URL", null);
  if (mediaUrl) {
    return mediaUrl;
  }
  // Si no hay MEDIA_URL, usar la misma base que la API pero sin /api
  const apiUrl = getApiBaseUrl();
  if (apiUrl.includes("/api")) {
    return apiUrl.replace("/api", "");
  }
  // Fallback para desarrollo
  if (process.env.NODE_ENV === "development") {
    return "http://127.0.0.1:8000";
  }
  return "https://casacondimentos.com";
};

const MEDIA_BASE_URL = getMediaBaseUrl();

// Función helper para normalizar URLs de imágenes
// Si la imagen ya es una URL completa, la devuelve tal cual
// Si es una ruta relativa, la concatena con MEDIA_BASE_URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";

  // Si ya es una URL completa (http:// o https://), devolverla tal cual
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Si es una ruta relativa, concatenar con MEDIA_BASE_URL
  // Asegurarse de que no haya doble slash
  const baseUrl = MEDIA_BASE_URL.endsWith("/")
    ? MEDIA_BASE_URL.slice(0, -1)
    : MEDIA_BASE_URL;
  const path = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${baseUrl}${path}`;
};

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

export { API_BASE_URL, MEDIA_BASE_URL };
