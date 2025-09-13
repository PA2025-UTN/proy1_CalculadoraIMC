# Calculadora IMC

Este proyecto, denominado **Calculadora IMC**, consiste en una aplicación para calcular el **Índice de Masa Corporal (IMC)**.  
Se desarrolló como parte de la materia **Programación Avanzada (UTN - FRVM)**, con el objetivo de aplicar conceptos de **ingeniería de software** como planificación de proyectos, pruebas, métricas, entre otros.

Link al proyecto: <https://calculadora-imc-pa.netlify.app/>

---

## 📂 Estructura del proyecto

El proyecto está organizado en un **monorepo**, el cual incluye:

- **Frontend**:  
  - Desarrollado con **React + Vite**.  
  - Proporciona la interfaz de usuario para ingresar datos (peso y altura).  
  - Muestra el resultado del IMC junto con su categoría correspondiente (bajo peso, normal, sobrepeso, obesidad).

- **Backend**:  
  - Implementado en **NestJS (TypeScript)**.  
  - Contiene la lógica de cálculo del IMC.  
  - Expone una API que es consumida por el frontend.

---

## 🚀 Requisitos previos

- Node.js (>= 18)
- npm (>= 9)

---

## ▶️ Cómo correr la aplicación

### 1. Clonar el repositorio

 ```bash
git clone <https://github.com/PA2025-UTN/proy1_CalculadoraIMC>
```

### 2. Instalar dependencias

Dentro de cada carpeta (frontend/ y backend/):

```bash
npm install
```

### 3. Ejecutar en modo desarrollo

```bash
# Frontend (React + Vite)
npm run dev

# Backend (NestJS)
npm run dev
```

Por defecto:

Frontend: <http://localhost:5173>\
Backend: <http://localhost:3000>

## 🧪 Testeo (Backend)

El backend cuenta con casos de prueba implementados en Jest.
Para correrlos:

```bash
# Comando para correr tests
npm run test

# Comando para ver la cobertura de código
npm run test:cov
```

## 📜 Comandos disponibles

A continuación se detallan los scripts más importantes del proyecto:

```bash
# --------------------
# FRONTEND (React + Vite)
# --------------------
npm run dev       # Inicia el servidor de desarrollo
npm run build     # Genera la build de producción
npm run preview   # Sirve la build generada

# --------------------
# BACKEND (NestJS)
# --------------------
npm run dev       # Inicia el servidor en modo desarrollo (con hot reload)
npm run build     # Compila el proyecto
npm run start     # Inicia el servidor en modo normal
npm run start:prod# Inicia el servidor en producción
npm run test      # Comando para correr tests
npm run test:cov  # Ejecuta los tests con cobertura
```
