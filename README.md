## Examen Final 
Equipo compuesto por:

Christian Madrid Cano  —  Desarrollo de la app

Marcos Sepúlveda Navarro — Desarrollo de la app


## Examen Final (En grupo)

Esta app cumple los requisitos del examen final grupal: Expo + TypeScript + Expo Router, autenticación con token persistido, Todo List 100% backend, manejo de imágenes/ubicación y encapsulación de lógica en hooks. Backend obligatorio: https://todo-list.dobleb.cl/docs

## Checklist de cumplimiento (lo que hicimos)

- TypeScript: todo el código del proyecto está en TS (ver estructura y tsconfig).
- Expo Router: navegación basada en la carpeta `app/` con layouts y tabs (ej.: [app/_layout.tsx](app/_layout.tsx), [app/(tabs)/index.tsx](app/(tabs)/index.tsx)).
- Autenticación JWT con persistencia en AsyncStorage: el token se guarda/lee con la key `@token` y se envía como `Authorization: Bearer` en cada request ([src/api/client.ts](src/api/client.ts#L3-L80)).
- Todo List 100% backend: sin almacenamiento local; se consumen GET/POST/PATCH/DELETE contra el backend en [src/services/todo-service.ts](src/services/todo-service.ts#L16-L62) y se expone como API en [src/hooks/todos-api.ts](src/hooks/todos-api.ts#L5-L35).
- Custom Hook obligatorio: `useTodos` orquesta estado, loading/error, CRUD, toggle y stats, con UI optimista y rollback ante error ([src/hooks/useTodos.ts](src/hooks/useTodos.ts#L59-L206)).
- Manejo de errores HTTP: `normalizeErrorMessage` mapea 401/403/500 a mensajes claros ([src/hooks/useTodos.ts](src/hooks/useTodos.ts#L41-L57)).
- Variables de entorno: `EXPO_PUBLIC_API_URL` con fallback a https://todo-list.dobleb.cl ([src/api/client.ts](src/api/client.ts#L3-L3)). Ejemplo:

```env
EXPO_PUBLIC_API_URL=https://todo-list.dobleb.cl
```

## Cómo ejecutar el proyecto

1. Requisitos: Node 18+, npm o yarn, Expo CLI.
2. Instala dependencias: `npm install`.
3. Crea un archivo `.env` (o `.env.local`) con `EXPO_PUBLIC_API_URL=https://todo-list.dobleb.cl`.
4. Inicia el proyecto: `npx expo start`.
5. Registra usuario o usa credenciales propias en la pantalla de login; luego prueba crear/editar/borrar tareas (CRUD) y adjuntar imagen/ubicación desde las pantallas de la app.

## Video de preguntas (obligatorio)

Preguntas respondidas mostrando el código en pantalla:


## Uso de IA (obligatorio)

Se utilizaron herramientas de IA (por ejemplo, GitHub Copilot) para apoyo en redacción del README, refactorizaciones menores y resolución puntual de dudas en hooks/SDK; la implementación final fue revisada y ajustada manualmente.

## Integrantes y roles

| Integrante | Rol | Commits |
| --- | --- | --- |
| Christian Madrid Cano | Desarrollo de la app | (pendiente) |
| Marcos Sepúlveda Navarro | Desarrollo de la app | (pendiente) |

## Pauta oficial del examen

# Examen Final (En grupo)

## **Objetivo de la evaluación**

Evaluar la capacidad del estudiante para desarrollar una aplicación móvil profesional utilizando **React Native con Expo**, integrando correctamente:

- **TypeScript**
- **Expo Router**
- **Gestión de estado**
- **Consumo de API REST**
- **Autenticación con persistencia del token**
- **CRUD completo de tareas utilizando únicamente un backend**
- **Uso de APIs nativas**
- **Encapsulación de lógica mediante Custom Hooks**

El examen evalúa tanto el dominio práctico como la capacidad de **explicar técnicamente** las decisiones de implementación.

Trabajo en grupos de **3 a 4 personas**, con un repositorio por grupo y **commits de al menos 2 integrantes**.

---

## **Requerimientos técnicos generales**

- No se permite persistencia local de tareas
- El **token** debe persistirse en **AsyncStorage**
- Toda la data de tareas debe provenir del **backend**
- Backend obligatorio del examen

---

## **Backend obligatorio**

[**https://todo-list.dobleb.cl/docs**](https://todo-list.dobleb.cl/docs)

---

##  **1. Autenticación contra el backend**

El login debe:

- Enviar credenciales al backend.
- Guardar el token en `AsyncStorage`.
- Proteger rutas si el token no existe o es inválido.
- Manejar errores HTTP (401, 403, 500).

---

## **2. Todo List 100% conectado al backend**

Las tareas **no se guardan localmente**.

| Acción | Requisito |
| --- | --- |
| Listar | GET backend |
| Crear | POST backend |
| Actualizar | PATCH / PUT |
| Eliminar | DELETE |

**Restricciones:**

- Tareas asociadas al usuario autenticado.
- Solo se muestran tareas del usuario.

---

## **3. Manejo de imágenes (OBLIGATORIO)**

- Captura desde el dispositivo (**API nativa**).
- Subida usando **POST `/images`** (Swagger).
- Asociar la imagen a una tarea.
- Mostrar la **URL retornada por el backend**.

---

## **4. Uso obligatorio de Custom Hooks**

La lógica del Todo List debe estar encapsulada en **custom hooks** (ej. `useTodos`):

- Obtener tareas
- Crear / eliminar
- Cambiar estado
- Manejo de `loading` y `error`

 No se permite lógica de negocio directamente en las vistas.

---

##  **5. Variables de entorno**

Ejemplo:

```env
EXPO_PUBLIC_API_URL=https://todo-list.dobleb.cl
