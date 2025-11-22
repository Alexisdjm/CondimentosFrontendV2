#!/bin/sh
# Script de entrada para Docker que inyecta variables de entorno en tiempo de ejecución

# Crear archivo de configuración JavaScript con las variables de entorno
cat > /usr/share/nginx/html/env-config.js <<EOF
window._env_ = {
  REACT_APP_API_URL: "${REACT_APP_API_URL:-https://casacondimentos.com/api}",
  REACT_APP_MEDIA_URL: "${REACT_APP_MEDIA_URL:-https://casacondimentos.com}",
  NODE_ENV: "${NODE_ENV:-production}"
};
EOF

# Inyectar el script en el index.html si no está ya incluido
# Buscar el patrón </head> y reemplazarlo con el script + </head>
if ! grep -q "env-config.js" /usr/share/nginx/html/index.html; then
  # Usar sed para insertar el script antes de </head>
  sed -i 's|</head>|<script src="/env-config.js"></script></head>|' /usr/share/nginx/html/index.html
fi

# Iniciar nginx
exec nginx -g "daemon off;"
