# Evaluación 2 – App Expo + Expo Router


Equipo:

- Christian Madrid Cano — Desarrollo de la app
- Marcos Sepúlveda — Desarrollo de la app

Nota: Usamos herramientas de IA como apoyo al estudio y para acelerar tareas de documentación y refactorización.

Aplicación móvil hecha con Expo, React Native y TypeScript usando Expo Router (enrutamiento basado en archivos). Este repositorio recoge y amplía las funcionalidades desarrolladas en la Evaluación 1 y en la Evaluación 2: incluye autenticación simple, pantalla de Login, navegación por pestañas (Home y Profile), un Todo list completo, captura de fotos desde la cámara y guardado de ubicación (geolocalización), entre otras mejoras.

## Características

- Expo SDK 54 con React Native 0.81 y React 19
- Expo Router con `_layout.tsx`, tabs 
- Autenticación en memoria (usuarios de ejemplo)
- TypeScript configurado
- ESLint con `eslint-config-expo`
- Iconos (expo-symbols, @expo/vector-icons) y Haptics
 - Todo list integrado: crear, marcar como completada y eliminar tareas
 - Captura de fotos con la cámara (`expo-image-picker`) y adjunto a cada tarea
 - Geolocalización (`expo-location`): se guarda la ubicación al crear la tarea (si el usuario lo permite)
 - Visualización de miniaturas en la lista de tareas y coordenadas mostradas junto a cada tarea

##  Requisitos

- Node.js 18+ (LTS recomendado)
- npm 9+ (o pnpm/yarn si prefieres, pero el proyecto trae scripts con npm)
- Android Studio (emulador Android) o Xcode (simulador iOS) si deseas emular; o la app Expo Go en tu dispositivo

## Instalación y ejecución

1) Instalar dependencias

```powershell
npm install
```

2) Iniciar el proyecto (Metro + menú Expo)

```powershell
npx expo start
```

3) Abrir la app en:

- Dispositivo físico con Expo Go (escanea el QR)
- Emulador Android: selecciona "a" en la terminal o usa `npm run android`
- Simulador iOS (solo macOS): selecciona "i" o usa `npm run ios`
- Web: `npm run web`

##  Estructura principal

```
app/
   _layout.tsx           # Stack raíz: (tabs), login, modal
   login.tsx             # Pantalla de login
   modal.tsx             # Modal
   (tabs)/
      _layout.tsx         # Layout de pestañas
      index.tsx           # Home (contador, toggle, logout)
      profile.tsx         # Pantalla Profile
components/
   context/
      auth-context.tsx    # Contexto de autenticación (in‑memory)
constants/
   theme.ts              # Colores y tema
```

##  Autenticación (demo)

El contexto `auth-context.tsx` mantiene un usuario en memoria y valida contra una lista fija:

- user@mail.com / 1234
- admin@mail.com / admin

Si el login es exitoso, se navega a `/(tabs)`. En Home puedes cerrar sesión (Logout) y regresar a `/login`.

##  Uso: Todo list, Fotos y Ubicación

1. Abre la app y ve a la pestaña "Home".
2. Pulsa el botón "+" para crear una nueva tarea.
3. En el formulario puedes:
   - Introducir el título de la tarea.
   - Tomar una foto con la cámara (permiso requerido). La miniatura se muestra en la lista.
   - Al guardar, la app solicitará permiso de ubicación y, si se concede, guardará latitud/longitud con la tarea.
4. En la lista de tareas puedes:
   - Marcar tareas como completadas tocando el círculo.
   - Ver la miniatura de la foto adjunta (si existe).
   - Ver las coordenadas guardadas junto al título (si existe ubicación).
   - Eliminar tareas con el icono de papelera.

Nota: Actualmente los datos (tareas, fotos, coordenadas) se mantienen en memoria durante la ejecución de la app (demo). No hay persistencia en disco ni sincronización con un backend en esta versión.

## Scripts disponibles

```json
"start": "expo start",            // Inicia el servidor de desarrollo
"android": "expo start --android", // Abre en emulador Android
"ios": "expo start --ios",        // Abre en simulador iOS (macOS)
"web": "expo start --web",        // Ejecuta en web
"lint": "expo lint",              // Linter (ESLint)
"reset-project": "node ./scripts/reset-project.js" // Restaura proyecto base
```

Comandos rápidos (PowerShell):

```powershell
npm run lint
npm run android
npm run web
```

##  Desarrollo

- Enrutamiento por archivos: cada archivo en `app/` es una ruta. `_layout.tsx` define layouts/anidaciones.
- Estilos con `StyleSheet` de React Native.
- Tipado con TypeScript (tsconfig incluido).
- Linting: el workspace incluye reglas y acciones de guardado para ordenar imports y aplicar fixes.

##  Solución de problemas

- Metro cache extraño: limpia caché
   ```powershell
   npx expo start -c
   ```
- Emulador Android no abre: verifica que Android Studio esté instalado y que tengas un AVD creado; abre Android Studio una vez y luego reintenta `npm run android`.
- Error de sintaxis (por ejemplo “Identifier expected”): normalmente es una coma faltante o JSX mal formado; revisa el archivo que indique el error y valida objetos/JSX.

### Error común: "TypeError: _os.default.availableParallelism is not a function"

Si al ejecutar `npx expo start` ves un error similar a:

```
TypeError: _os.default.availableParallelism is not a function
```

Esto indica que la versión de Node instalada en tu sistema es demasiado antigua: Metro (el bundler) usa `os.availableParallelism()` que aparece en Node más recientes. Solución recomendada:

1) Verifica tu versión actual de Node:

```powershell
node -v
npm -v
```

2) Si `node -v` es menor a `v18.x`, actualiza Node a una versión LTS (18.x o 20.x). En Windows tienes dos opciones:

- Instalar desde el instalador oficial: https://nodejs.org/ (descarga la versión LTS)
- Usar `nvm-windows` para administrar versiones de Node (recomendado si quieres cambiar versiones frecuentemente):

  - Descargar e instalar `nvm-windows` desde: https://github.com/coreybutler/nvm-windows/releases
  - Luego en PowerShell:

```powershell
nvm install 18.20.0
nvm use 18.20.0
node -v
```

3) Después de actualizar Node, elimina `node_modules` y `package-lock.json`, reinstala dependencias y arranca Expo limpiando cache:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
npx expo start -c
```

4) Si tienes una instalación global antigua de `expo-cli`, elimínala para evitar conflictos:

```powershell
npm uninstall -g expo-cli
npm uninstall -g expo
npx --ignore-existing expo start -c
```

Si después de esto sigues con problemas, pega aquí la salida de `node -v` y el log completo de `npx expo start -c` y lo reviso.

## 📱 Permisos necesarios

- Cámara: requerida para tomar fotos desde el formulario de creación de tareas. La app pedirá permiso en tiempo de ejecución.
- Ubicación: la app solicita permiso "when in use" para obtener coordenadas al guardar una tarea. En `app.json` está incluida la clave `NSLocationWhenInUseUsageDescription` para iOS.

Consejos:
- Acepta los permisos cuando la app los solicite en el emulador o dispositivo físico para probar la funcionalidad de foto/ubicación.
- En Android, revisa la configuración de permisos de la app si la cámara o ubicación no funcionan.

##  Build y publicación

Para builds de producción con EAS (recomendado):

- Documentación: https://docs.expo.dev/eas/
- Requiere una cuenta Expo y configurar `eas.json`.

##  Recursos

- Expo: https://docs.expo.dev/
- Expo Router: https://docs.expo.dev/router/introduction/
- React Native: https://reactnative.dev/docs/environment-setup

---

Hecho con Expo + React Native. Si necesitas agregar más pantallas, endpoints o un backend real de auth, puedo ayudarte a extender esta base.

## 🎥 Video demostrativo

[Ver en YouTube](https://www.youtube.com/shorts/ziSA8LvgR1g)
