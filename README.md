#  StreamMatch — Sistema de Recomendación Personalizado con IA

Proyecto final — Administración de Tecnologías de la Información  
Stack: React + Vite + TypeScript + Tailwind | Node.js + Express + TypeScript + MySQL

---

##  Estructura del Repositorio

```
streaming-recommender/
├─ client/         → Frontend (React + Vite + TypeScript + Tailwind)
├─ server/         → Backend (Node.js + Express + TypeScript + MySQL)
└─ README.md
```

---

##  Cómo iniciar el proyecto

### Requisitos previos
- Node.js v18 o superior
- MySQL Workbench con una base de datos creada
- Una API Key de Claude (Anthropic) — cuenta gratuita en console.anthropic.com

---

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/streaming-recommender.git
cd streaming-recommender
```

---

### 2. Configurar el Backend

```bash
cd server
npm install
cp .env.example .env
```

Edita el archivo `.env` con tus datos de MySQL y tu API Key.

Luego ejecuta los scripts de base de datos en MySQL Workbench en este orden:
```
server/src/db/schema.sql        ← Crea las tablas
server/src/db/seed-completo.sql ← Carga 214 películas con imágenes reales
```

Inicia el servidor:
```bash
npm run dev
```

El servidor corre en: `http://localhost:3001`

---

### 3. Configurar el Frontend

```bash
cd client
npm install
cp .env.example .env
```

Inicia la app:
```bash
npm run dev
```

La app corre en: `http://localhost:5173`

---

##  Plan de desarrollo (19–30 mayo)

| Días | Tarea |
|------|-------|
| Día 1 | Repositorio, estructura base, README, variables de entorno |
| Días 2–3 | Backend: conexión MySQL, carga del dataset, endpoints base |
| Días 4–5 | Algoritmo de filtrado colaborativo |
| Día 6 | Integración con API de Claude (enriquecimiento de recomendaciones) |
| Días 7–8 | Frontend: interfaz de preferencias + visualización |
| Día 9 | Conexión Frontend ↔ Backend completa |
| Día 10 | Pruebas, ajustes y pulido visual |
| Día 11 | Presentación y documento final |

---

##  Equipo

| Nombre | Rol |
|--------|-----|
| Javier Jose Luis Rivera Pérez | Desarrollo (Backend + Frontend) |
| Marvin Alexander Vásquez López| Desarrollo (Backend + Frontend) |
| Karla Waleska Rodríguez Arévalo| Documentación |
| Jaqueline Natalia Lorenzana León| Documentación |
| Gelen Dayanna López Morales | Documentación |

---

##  Variables de entorno necesarias

### Server (.env)
```
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=streamingdb
ANTHROPIC_API_KEY=sk-ant-...
CLIENT_URL=http://localhost:5173
```

### Client (.env)
```
VITE_API_BASE_URL=http://localhost:3001
```
