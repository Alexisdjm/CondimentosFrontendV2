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
  // En producción sin variable, usar dominio de API por defecto
  return "https://api.casacondimentos.com/api";
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

  let mediaBase = apiUrl;

  // Fallback para desarrollo
  if (process.env.NODE_ENV === "development") {
    return mediaBase || "http://127.0.0.1:8000";
  }
  // En producción, usar el mismo subdominio de la API para medios
  return mediaBase || "https://api.casacondimentos.com";
};

const MEDIA_BASE_URL = getMediaBaseUrl();

// Función helper para normalizar URLs de imágenes
// Si la imagen ya es una URL completa, la devuelve tal cual
// Si es una ruta relativa, la concatena con MEDIA_BASE_URL
// Las imágenes del backend siempre vienen como /images/image.webp (sin /api/)
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";

  // Si ya es una URL completa (http:// o https://), devolverla tal cual
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Obtener MEDIA_BASE_URL y asegurarse de que no termine en /
  const baseUrl = MEDIA_BASE_URL.replace(/\/api\/?$/, "");

  // Asegurarse de que el path comience con /
  const path = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  return `${baseUrl}${path}`;
};

// Cache para el token CSRF para evitar múltiples peticiones
let csrfTokenCache = null;
let csrfTokenPromise = null;

// Función para obtener el token CSRF del endpoint del backend
const getCsrfTokenFromEndpoint = async () => {
  // Si ya tenemos un token en cache, devolverlo
  if (csrfTokenCache) {
    return csrfTokenCache;
  }

  // Si ya hay una petición en curso, esperar a que termine
  if (csrfTokenPromise) {
    return csrfTokenPromise;
  }

  // Crear nueva petición para obtener el token
  csrfTokenPromise = fetch(`${API_BASE_URL}/csrf-token/`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to get CSRF token: ${response.status}`);
      }
      const data = await response.json();
      const token = data.csrfToken;
      csrfTokenCache = token;
      csrfTokenPromise = null;
      return token;
    })
    .catch((error) => {
      csrfTokenPromise = null;
      console.error("Error obteniendo CSRF token:", error);
      throw error;
    });

  return csrfTokenPromise;
};

// Función para invalidar el cache del CSRF token
// Útil cuando se recibe un error 403 o cuando el token puede haber expirado
export const invalidateCsrfTokenCache = () => {
  csrfTokenCache = null;
  csrfTokenPromise = null;
};

// Configuración de fetch con credenciales para sesiones
export const fetchWithCredentials = async (url, options = {}) => {
  // Determinar si es una petición que requiere CSRF (POST, PUT, DELETE, PATCH)
  const method = options.method || "GET";
  const needsCsrf = ["POST", "PUT", "DELETE", "PATCH"].includes(
    method.toUpperCase()
  );

  // Construir headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Obtener el token CSRF si es necesario
  if (needsCsrf) {
    try {
      const csrfToken = await getCsrfTokenFromEndpoint();
      if (csrfToken) {
        headers["X-CSRFToken"] = csrfToken;
      }
    } catch (error) {
      console.error("Error obteniendo CSRF token para la petición:", error);
      // Invalidar el cache para que el siguiente intento obtenga un nuevo token
      invalidateCsrfTokenCache();
      // Continuar sin el token, el backend rechazará si es necesario
    }
  }

  const response = await fetch(url, {
    ...options,
    credentials: "include", // CRUCIAL para sesiones y cookies
    headers,
  });

  // Si recibimos un 403, puede ser que el token CSRF haya expirado
  // Invalidar el cache para que el siguiente intento obtenga un nuevo token
  if (response.status === 403 && needsCsrf) {
    console.warn("Recibido 403, invalidando cache del CSRF token");
    invalidateCsrfTokenCache();
  }

  return response;
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
    `${API_BASE_URL}/consulta/search/?q=${encodeURIComponent(term)}`,

  // Carrito
  cart: () => `${API_BASE_URL}/cart/`,
  cartItem: (id) => `${API_BASE_URL}/cart/${id}/`,

  // CSRF Token
  csrfToken: () => `${API_BASE_URL}/csrf-token/`,

  // Colecciones
  collections: () => `${API_BASE_URL}/collections/`,
};

export { API_BASE_URL, MEDIA_BASE_URL };
