# Jornadas Laborales

Espacio de trabajo desarrollado con Angular Material para planificar jornadas laborales, revisar la cobertura semanal y gestionar el listado de empleados. El frontend comienza utilizando datos simulados realistas mediante una capa de abstracción de API tipada; actualmente, la API de Azure Functions proporciona el endpoint para comprobar el estado de conexión con PostgreSQL.

## Requisitos previos

- Node.js 20.19+ o 22.12+, npm y Azure Functions Core Tools v4.
- Docker Compose para ejecutar PostgreSQL localmente.

## Configuración local

1. Copia el archivo `.env.example` y renómbralo como `.env`. Configura `API_BASE_URL` con la URL base del backend (por ejemplo, `http://localhost:5000/api`) y ajusta los valores de PostgreSQL si es necesario.
2. Inicia PostgreSQL ejecutando `docker compose up -d postgres`.
3. Instala las dependencias del frontend con `npm --prefix services/web install`.
4. Instala las dependencias de la API con `npm --prefix services/functions install`.
5. Inicia el frontend con `npm --prefix services/web start` y abre `http://localhost:4200` en el navegador.
6. Inicia la API en una terminal independiente con `npm --prefix services/functions start`. El endpoint para comprobar su estado estará disponible en `http://localhost:7071/api/health`.

## Verificaciones

- **Compilación de producción del frontend:** `npm --prefix services/web run build`
- **Pruebas del frontend:** `npm --prefix services/web test`
- **Compilación de TypeScript de la API:** `npm --prefix services/functions run build`

## Imagen Docker del frontend

Construye la imagen desde la raíz del repositorio. El contenedor del frontend utiliza un proxy para redirigir las solicitudes a `/api` hacia un backend publicado en el puerto `7071` del host.

```sh
docker build -f services/web/Dockerfile -t jornadas-laborales-web .
docker run --rm -p 8080:80 jornadas-laborales-web
```

Abre `http://localhost:8080` en el navegador. El navegador envía las solicitudes a la API utilizando el mismo origen, y Nginx las redirige a `http://host.docker.internal:7071/api`.

La configuración local de la API se encuentra en `services/functions/local.settings.json` y está excluida del control de versiones de Git.

En producción, las conexiones a PostgreSQL utilizan un token de identidad administrada (*Managed Identity*). Para el desarrollo local se utiliza la variable `DATABASE_URL`.

## Arquitectura del frontend

El código fuente de Angular está organizado por responsabilidades dentro de `services/web/src/app/`:

- **`domain/`**: contiene los modelos y tipos de negocio independientes de cualquier framework.
- **`application/ports/`**: define los contratos de la aplicación. **`application/use-cases/`** coordina las acciones de la aplicación sin depender de Angular ni de la infraestructura.
- **`infrastructure/`**: contiene los adaptadores de API, los tokens y proveedores de inyección de dependencias de Angular, y el estado de previsualización almacenado en el navegador.
- **`features/`**: contiene la página correspondiente a cada ruta y los componentes de interfaz específicos de cada funcionalidad.
- **`presentation/`**: contiene la estructura principal de la aplicación (*app shell*), las rutas, el tema visual y los controles de previsualización para desarrolladores.
- **`shared/ui/`**: contiene los componentes de interfaz reutilizables y compartidos entre las diferentes funcionalidades.

### Flujo de dependencias

Las dependencias apuntan hacia el interior de la arquitectura: las funcionalidades y la capa de presentación utilizan los casos de uso de la aplicación; la infraestructura implementa los contratos definidos en los puertos de aplicación y configura las dependencias en `app.providers.ts`.

Para sustituir la API simulada por un adaptador HTTP real, solo debería ser necesario modificar la configuración de los proveedores e implementar el contrato existente de `ApiClient`.

## Configuración de la API en el frontend

El frontend lee la variable `API_BASE_URL` del archivo `.env` del espacio de trabajo al iniciar o compilar la aplicación.

Durante el desarrollo, Angular utiliza un proxy para redirigir las solicitudes a `/api` hacia el backend configurado, evitando las restricciones de CORS del navegador.

En las compilaciones de producción, el frontend utiliza directamente la URL del backend configurada. Por lo tanto, el despliegue debe permitir las solicitudes desde el origen del frontend o proporcionar un proxy inverso (*reverse proxy*) para gestionar dichas solicitudes.
