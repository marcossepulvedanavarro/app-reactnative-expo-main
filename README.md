📱 Evaluación 3 – App Expo + Backend (Todo App)
Equipo compuesto por:

Christian Madrid Cano  —  Desarrollo de la app

Marcos Sepúlveda Navarro — Desarrollo de la app

Nota: Se utilizaron herramientas de IA como apoyo al estudio, documentación, refactorización de código y para resolución de errores de compatibilidad de versiones SDK.

📌 Descripción general

Aplicación móvil desarrollada con React Native, Expo y TypeScript, utilizando Expo Router para el enrutamiento.
La app implementa autenticación contra un backend real, persistencia de sesión, CRUD completo de tareas asociado al usuario autenticado y subida de imágenes a Cloudflare R2, cumpliendo los requisitos de la Evaluación 3.

El backend expone una API REST documentada con Swagger.

🚀 Funcionalidades implementadas (Evaluación 3)
🔐 Autenticación

Registro de usuarios (POST /auth/register)

Login con credenciales (POST /auth/login)

Autenticación basada en JWT

Persistencia de sesión usando AsyncStorage

Protección de rutas: el usuario debe estar autenticado para acceder a la app

📝 Todo List (100% Backend)

Listar tareas del usuario autenticado (GET /todos)

Crear tareas (POST /todos)

Marcar tareas como completadas / no completadas (PATCH /todos/:id)

Eliminar tareas (DELETE /todos/:id)

Las tareas están asociadas al usuario autenticado

El backend solo retorna tareas del usuario correspondiente

🖼️ Manejo de imágenes

Captura de imágenes desde la cámara del dispositivo

Subida de imágenes al backend mediante multipart/form-data

Almacenamiento de imágenes en Cloudflare R2

El backend retorna la URL pública de la imagen

Visualización de miniaturas en la lista de tareas

📍 Geolocalización

Captura opcional de ubicación al crear una tarea

Almacenamiento de latitud y longitud

Visualización de coordenadas en la lista

🎨 UI / UX

Estilos unificados en toda la aplicación

Botones reutilizables con identidad visual consistente

Estados de carga y manejo de errores

Feedback visual al usuario

🧱 Tecnologías utilizadas
Frontend

React Native

Expo SDK

Expo Router

TypeScript

Axios / Fetch

AsyncStorage

expo-image-picker

expo-location

Backend

API REST documentada con Swagger

Autenticación JWT

Cloudflare R2 para imágenes

📘 Documentación API:
👉 https://todo-list.dobleb.cl/docs

⚙️ Variables de entorno

Crear archivo .env.local en la raíz del proyecto:

EXPO_PUBLIC_API_URL=https://todo-list.dobleb.cl


🧠 Cumplimiento Evaluación 3

✔ Autenticación contra backend
✔ Persistencia de sesión
✔ CRUD completo conectado al backend
✔ Asociación de datos por usuario
✔ Subida de imágenes
✔ Uso de variables de entorno
✔ Manejo de errores
✔ UI consistente

🎥 Video demostrativo


📌 Observaciones finales

Este proyecto cumple con los requerimientos solicitados en la Evaluación 3, integrando frontend y backend de manera completa, siguiendo buenas prácticas de desarrollo móvil y consumo de APIs REST.

## 🎥 Video demostrativo

[Ver en YouTube] https://www.youtube.com/shorts/c9QUMCw7RzA
