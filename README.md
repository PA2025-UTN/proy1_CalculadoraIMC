# Calculadora IMC

Este proyecto, denominado **Calculadora IMC**, consiste en una aplicación completa para calcular y gestionar el **Índice de Masa Corporal (IMC)**.  
Se desarrolló como parte de la materia **Programación Avanzada (UTN - FRVM)**, con el objetivo de aplicar conceptos de **ingeniería de software** como planificación de proyectos, pruebas, métricas, arquitectura de software y patrones de diseño.

Link al proyecto: <https://calculadora-imc-pa.netlify.app/>

---

## 📂 Estructura del proyecto

El proyecto está organizado en un **monorepo**, el cual incluye:

- **Frontend**:
  - Desarrollado con **React + Vite + TypeScript**.
  - Interfaz moderna con **TailwindCSS** y componentes de **shadcn/ui**.
  - Sistema de autenticación completo (login/registro).
  - Calculadora de IMC con interfaz intuitiva.
  - Historial de cálculos con filtros avanzados (fecha, categoría, orden).
  - Dashboard de estadísticas con gráficos interactivos (evolución de IMC, peso, distribución por categorías).
  - Enrutamiento con **React Router**.
  - Validación de formularios con **React Hook Form** y **Zod**.

- **Backend**:
  - Implementado en **NestJS (TypeScript)**.
  - Arquitectura modular con soporte multi-base de datos.
  - **Soporte para 3 bases de datos**: MongoDB, PostgreSQL y MySQL (configurable por variable de entorno).
  - Patrón Repository para abstracción de acceso a datos.
  - Autenticación con **JWT** (access token y refresh token).
  - Encriptación de contraseñas con **bcrypt**.
  - API RESTful con validación de DTOs.
  - Módulos: Auth, Users, IMC, Estadísticas.
  - Testing completo con **Jest**.

---

## ✨ Características principales

### Autenticación y usuarios

- Registro de usuarios con validación
- Login con JWT (access y refresh tokens)
- Protección de rutas mediante guards
- Gestión de sesiones

### Calculadora de IMC

- Cálculo de IMC basado en peso y altura
- Clasificación automática en categorías (bajo peso, normal, sobrepeso, obesidad)
- Almacenamiento de cada cálculo con fecha
- Endpoint de seed para generar datos de prueba (100 registros aleatorios)

### Historial

- Visualización de todos los cálculos realizados
- Filtros por:
  - Rango de fechas
  - Categoría de IMC
  - Ordenamiento (fecha, IMC, peso, altura)

### Estadísticas

- Resumen general (cantidad de registros, promedio de IMC, último registro)
- Gráfico de evolución del IMC a lo largo del tiempo
- Gráfico de evolución del peso
- Distribución de registros por categorías de IMC
- Visualización con **Recharts**

### Multi-base de datos

- Soporte intercambiable entre MongoDB, PostgreSQL y MySQL
- Scripts de utilidad:
  - `db:check` - Verifica conexión y estado de las bases de datos
  - `seed:postgres` - Carga datos de prueba en PostgreSQL
  - `migrate:all` - Migra datos entre bases de datos

---

## 🚀 Requisitos previos

- **Node.js** (>= 18)
- **npm** (>= 9)
- **Docker** (para ejecutar las bases de datos)

---

## Configuración de bases de datos

Antes de ejecutar la aplicación, sugerimos levantar al menos una de las bases de datos usando Docker:

### MongoDB

```bash
docker run -d --name mongo \
  -p 27018:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=imc \
  -e MONGO_INITDB_ROOT_PASSWORD=mongoimc \
  -e MONGO_INITDB_DATABASE=imc_db \
  mongo:latest
```

> **Nota:** En caso de error de CPU incompatible con AVX, usar `mongo:4.4` en lugar de `mongo:latest`

### MySQL

```bash
docker run -d --name mysql-imc \
  -e MYSQL_ROOT_PASSWORD=mysqlimc \
  -e MYSQL_DATABASE=imc_db \
  -e MYSQL_USER=admin \
  -e MYSQL_PASSWORD=mysqlimc \
  -p 3307:3306 \
  mysql:latest
```

### PostgreSQL

```bash
docker run -d --name postgres-imc \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgresimc \
  -e POSTGRES_DB=imc_db \
  -p 5433:5432 \
  postgres:latest
```

---

## ⚙️ Configuración del backend

1. Navega a la carpeta del backend:

   ```bash
   cd backend
   ```

2. Agrega el archivo `.env` y ajusta la configuración:

3. Configura la base de datos que deseas usar editando la variable `DB_TYPE` en el archivo `.env`:

   ```env
   # Opciones: postgres, mysql, mongo
   DB_TYPE=postgres
   ```

4. Las credenciales por defecto coinciden con los comandos Docker proporcionados arriba.

## ⚙️ Configuración del frontend

1. Navega a la carpeta del frontend:

   ```bash
   cd frontend
   ```

2. Agrega el archivo `.env.local` y ajusta la configuración:

3. Configura la url donde corre el back editando la variable `VITE_BACK_URL` en el archivo `.env.local`:

   ```env
   VITE_BACK_URL=http://localhost:3000
   ```

---

## ▶️ Cómo correr la aplicación

### 1. Clonar el repositorio

```bash
git clone https://github.com/PA2025-UTN/proy1_CalculadoraIMC
cd proy1_CalculadoraIMC
```

### 2. Instalar dependencias

Dentro de cada carpeta (frontend/ y backend/):

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Levantar la base de datos

Ejecuta uno de los comandos Docker mostrados en la sección anterior según la base de datos que desees usar.

### 4. Verificar conexión a la base de datos (opcional)

```bash
cd backend
npm run db:check
```

Este comando te mostrará el estado de conexión de todas las bases de datos configuradas.

### 5. Ejecutar en modo desarrollo

```bash
# Backend (desde la carpeta backend/)
npm run dev

# Frontend (desde la carpeta frontend/)
npm run dev
```

Por defecto:

- **Frontend**: <http://localhost:5173>
- **Backend**: <http://localhost:3000>

---

## 🧪 Testing

El backend cuenta con una suite completa de pruebas implementadas con Jest.

```bash
cd backend

# Ejecutar todos los tests
npm run test

# Ver cobertura de código
npm run test:cov

# Tests en modo watch
npm run test:watch
```

---

## 📜 Comandos disponibles

### Frontend (React + Vite)

```bash
npm run dev       # Inicia el servidor de desarrollo
npm run build     # Genera la build de producción
npm run preview   # Sirve la build generada
npm run lint      # Ejecuta el linter
```

### Backend (NestJS)

```bash
# Desarrollo
npm run dev              # Inicia el servidor en modo desarrollo (con hot reload)
npm run start:debug      # Inicia en modo debug

# Producción
npm run build            # Compila el proyecto
npm run start            # Inicia el servidor en modo normal
npm run start:prod       # Inicia el servidor en producción

# Testing
npm run test             # Ejecuta los tests
npm run test:watch       # Tests en modo watch
npm run test:cov         # Tests con reporte de cobertura

# Utilidades de base de datos
npm run db:check         # Verifica conexión y estado de las bases de datos
npm run seed:postgres    # Carga datos de prueba en PostgreSQL
npm run migrate:all      # Migra datos entre bases de datos (pg a mongo)

# Calidad de código
npm run lint             # Ejecuta el linter
npm run format           # Formatea el código con Prettier
```

---

## 🏗️ Arquitectura y patrones

### Backend

- **Arquitectura modular**: Separación en módulos independientes (Auth, Users, IMC, Estadísticas)
- **Patrón Repository**: Abstracción de acceso a datos para soportar múltiples bases de datos
- **DTOs y validación**: Uso de class-validator para validación de datos de entrada
- **Guards y decoradores**: Protección de rutas y extracción de información del usuario
- **Dependency Injection**: Sistema de inyección de dependencias de NestJS
- **Mappers**: Transformación entre entidades de diferentes bases de datos

### Frontend

- **Componentes reutilizables**: UI components con shadcn/ui
- **Gestión de estado**: Local state con React hooks
- **Rutas protegidas**: Sistema de autenticación con context
- **Validación de formularios**: Zod schemas con React Hook Form
- **Diseño consistente**: TailwindCSS

---

## 🛠️ Stack tecnológico

### Frontend

- React 18
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- React Router
- React Hook Form
- Zod
- Recharts
- Axios

### Backend

- NestJS
- TypeScript
- TypeORM (PostgreSQL/MySQL)
- Mongoose (MongoDB)
- JWT
- bcrypt
- Jest
- class-validator

### Base de datos

- MongoDB
- PostgreSQL
- MySQL

---

## 📝 Endpoints de la API

### Autenticación (`/auth`)

- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/me` - Obtener usuario actual (requiere autenticación)
- `GET /auth/refresh-token` - Renovar access token

### IMC (`/imc`)

- `POST /imc/calcular` - Calcular y guardar IMC
- `GET /imc/historial` - Obtener historial con filtros
- `POST /imc/seed` - Generar 100 registros de prueba

### Estadísticas (`/estadisticas`)

- `GET /estadisticas` - Resumen general
- `GET /estadisticas/serie-imc` - Serie temporal de IMC
- `GET /estadisticas/serie-peso` - Serie temporal de peso
- `GET /estadisticas/categorias` - Distribución por categorías

---
