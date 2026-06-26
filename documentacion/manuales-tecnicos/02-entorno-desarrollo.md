# Entorno de desarrollo

Este documento explica cómo preparar tu máquina para trabajar en Changarro.

---

## Requisitos previos

### Herramientas base

| Herramienta | Versión mínima | Para qué                            |
| ----------- | -------------- | ----------------------------------- |
| Node.js     | 20+            | Ejecutar el frontend en desarrollo  |
| npm         | 10+            | Gestionar dependencias del frontend |
| Rust        | 1.77+          | Compilar el shell nativo de Tauri   |
| Git         | 2.x            | Control de versiones                |

### Para desarrollo Android (opcional)

| Herramienta    | Notas                                        |
| -------------- | -------------------------------------------- |
| Android Studio | SDK y emulador                               |
| Android SDK    | API 24+ (Android 7.0 mínimo)                 |
| NDK            | Requerido por Tauri para compilación cruzada |

### Para desarrollo de escritorio

- **macOS**: Xcode Command Line Tools (`xcode-select --install`)
- **Windows**: Visual Studio Build Tools con carga de trabajo "Desktop development with C++"
- **Linux**: `build-essential`, `libwebkit2gtk-4.1-dev`, `libssl-dev`

---

## Instalación del proyecto

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd changarro-app
```

### 2. Instalar dependencias del frontend

```bash
npm install
```

### 3. Verificar que Tauri funciona

```bash
cd src-tauri
cargo check
```

Si no tienes Rust instalado:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

---

## Desarrollo

### Aplicación completa (frontend + shell nativo)

```bash
npm run tauri:dev
```

Esto levanta el servidor de Vite y abre la ventana nativa de Tauri con
recarga automática. Es la forma recomendada para trabajar en el proyecto.

### Solo el frontend (sin Tauri)

```bash
npm run dev
```

Abre `http://localhost:5173` en el navegador. Útil para desarrollo rápido
de UI sin esperar la compilación de Rust.

### Desarrollo Android

```bash
npm run tauri android dev
```

Requiere un emulador corriendo o un dispositivo conectado por USB con
depuración habilitada.

---

## Build de producción

### Escritorio (plataforma actual)

```bash
npm run tauri:build
```

Genera el instalador para la plataforma actual en `src-tauri/target/release/bundle/`.

### Solo frontend

```bash
npm run build
```

Ejecuta verificación de tipos con TypeScript y genera los archivos estáticos
optimizados en `dist/`.

### Android

```bash
npm run tauri android build
```

Genera el APK en `src-tauri/gen/android/app/build/outputs/apk/`.

---

## Pruebas

```bash
npm run test:unit     # Ejecuta pruebas una vez y sale
```

Las pruebas usan Vitest con happy-dom y fake-indexeddb para simular el entorno
del navegador y la base de datos local.

---

## Estructura de comandos

| Comando                       | Descripción                                                |
| ----------------------------- | ---------------------------------------------------------- |
| `npm run dev`                 | Servidor de desarrollo (solo frontend, localhost:5173)     |
| `npm run build`               | Build de producción del frontend con verificación de tipos |
| `npm run test:unit`           | Ejecutar pruebas unitarias con Vitest                      |
| `npm run tauri:dev`           | Desarrollo completo con shell nativo + hot reload          |
| `npm run tauri:build`         | Build de producción completo para la plataforma actual     |
| `npm run tauri android dev`   | Desarrollo en Android                                      |
| `npm run tauri android build` | Build APK de producción                                    |

---

## Siguientes pasos

- [Arquitectura del proyecto](./01-arquitectura.md)
- [Estructura del código](./03-estructura-codigo.md)
- [Volver al índice](./README.md)
