# Guía de Dockerización - Condimentos Frontend

Este proyecto está dockerizado y listo para desplegarse en cualquier servicio de contenedores.

## Variables de Entorno

El proyecto utiliza variables de entorno para configurar las URLs de la API y los medios. Esto permite diferentes configuraciones para desarrollo y producción.

### Variables Disponibles

- `REACT_APP_API_URL`: URL base de la API backend
  - Desarrollo: `http://127.0.0.1:8000/api`
  - Producción: `https://casacondimentos.com/api`

- `REACT_APP_MEDIA_URL`: URL base para medios/imágenes (opcional)
  - Si no se define, se usa la misma base que la API pero sin `/api`
  - Desarrollo: `http://127.0.0.1:8000`
  - Producción: `https://casacondimentos.com`

## Desarrollo Local

### Con Docker Compose (Recomendado)

1. Crea un archivo `.env` en la raíz del proyecto:
```env
REACT_APP_API_URL=http://127.0.0.1:8000/api
REACT_APP_MEDIA_URL=http://127.0.0.1:8000
```

2. Construye y ejecuta:
```bash
docker-compose up --build
```

3. La aplicación estará disponible en `http://localhost:3000`

### Sin Docker (Desarrollo tradicional)

1. Crea un archivo `.env` en la raíz:
```env
REACT_APP_API_URL=http://127.0.0.1:8000/api
REACT_APP_MEDIA_URL=http://127.0.0.1:8000
```

2. Instala dependencias y ejecuta:
```bash
npm install
npm start
```

## Producción

### Construir la Imagen

```bash
docker build -t condimentos-frontend .
```

### Ejecutar el Contenedor

```bash
docker run -d \
  -p 3000:80 \
  -e REACT_APP_API_URL=https://casacondimentos.com/api \
  -e REACT_APP_MEDIA_URL=https://casacondimentos.com \
  --name condimentos-frontend \
  condimentos-frontend
```

### Con Docker Compose

1. Crea un archivo `.env` o usa variables de entorno del sistema:
```env
REACT_APP_API_URL=https://casacondimentos.com/api
REACT_APP_MEDIA_URL=https://casacondimentos.com
```

2. Ejecuta:
```bash
docker-compose up -d
```

## Características

- ✅ Multi-stage build para imágenes optimizadas
- ✅ Variables de entorno en runtime (no requiere rebuild para cambiar URLs)
- ✅ Nginx configurado para servir SPA (React Router)
- ✅ Compresión gzip habilitada
- ✅ Headers de seguridad configurados
- ✅ Cache para archivos estáticos

## Notas Importantes

1. **Variables de Entorno en Runtime**: El proyecto soporta variables de entorno tanto en tiempo de build como en runtime. Esto significa que puedes cambiar las URLs sin reconstruir la imagen, simplemente pasando las variables al contenedor.

2. **URLs de Imágenes**: Todas las URLs de imágenes se normalizan automáticamente usando la función `getImageUrl()` del archivo `src/config/api.js`. Si la API devuelve URLs completas, se usan tal cual. Si devuelve rutas relativas, se concatenan con `REACT_APP_MEDIA_URL`.

3. **Fallbacks**: Si no se definen variables de entorno:
   - En desarrollo: usa `http://127.0.0.1:8000` por defecto
   - En producción: usa `https://casacondimentos.com` por defecto

## Despliegue en Servicios Cloud

### AWS ECS / Fargate
- Configura las variables de entorno en la definición de la tarea
- Sube la imagen a ECR

### Google Cloud Run
- Configura las variables de entorno en el servicio
- Sube la imagen a Container Registry o Artifact Registry

### Azure Container Instances
- Pasa las variables de entorno al crear la instancia
- Sube la imagen a Azure Container Registry

### Heroku / Railway / Render
- Configura las variables de entorno en el panel de control
- Conecta el repositorio para despliegue automático
