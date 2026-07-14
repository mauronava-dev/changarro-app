# Estructura del código

Este documento explica la organización interna del código fuente de Changarro,
para que puedas orientarte rápidamente al contribuir.

---

## Organización general

El código del frontend vive en `src/` y sigue una estructura por responsabilidad:

```
src/
├── assets/
│   └── main.css           ← Estilos globales y design system
├── components/
│   └── layout/            ← Componentes de layout (TopAppBar, TabBar)
├── router/
│   └── index.ts           ← Definición de rutas
├── services/
│   ├── db.ts              ← Capa de persistencia (Dexie.js)
│   └── backup.ts          ← Servicio de respaldo e importación (combinación JSON)
├── stores/
│   ├── products.ts        ← Catálogo de productos
│   ├── cart.ts            ← Carrito de venta actual
│   ├── sales.ts           ← Historial de ventas
│   └── settings.ts        ← Configuración del negocio
├── views/                 ← Vistas (una por ruta)
├── App.vue                ← Componente raíz
└── main.ts                ← Punto de entrada
```

---

## Stores (Pinia)

Los stores manejan el estado global de la aplicación. Cada uno tiene una
responsabilidad única y se comunica con IndexedDB para persistir los datos.

Todos usan el patrón **Setup Store** (función) de Pinia.

### products.ts

Gestiona el catálogo de productos del negocio.

- **Estado**: lista de productos, término de búsqueda
- **Computed**: productos filtrados por búsqueda (insensible a acentos)
- **Acciones**: crear, editar, eliminar, cargar desde IndexedDB

### cart.ts

Gestiona el carrito de la venta actual. Se persiste en IndexedDB para
que no se pierda al cerrar la aplicación.

- **Estado**: lista de items en el carrito
- **Computed**: subtotal, monto de IVA, total
- **Acciones**: agregar producto, modificar cantidad, eliminar item, vaciar carrito, cargar desde IndexedDB

### sales.ts

Gestiona el historial de ventas completadas.

- **Estado**: lista de ventas
- **Acciones**: crear venta (a partir del carrito actual), cargar historial, obtener venta por ID

### settings.ts

Gestiona la configuración del negocio.

- **Estado**: nombre del negocio, moneda, IVA activo/inactivo, tasa de impuesto
- **Acciones**: cargar configuración, actualizar ajustes, persistir cambios

---

## Capa de servicios (services/)

### db.ts

Define la base de datos IndexedDB usando Dexie.js. Contiene:

- Las interfaces TypeScript de cada entidad (Product, Sale, SaleItem, AppSettings, CartItemRecord)
- La instancia de Dexie con la definición de tablas e índices
- El esquema de versionado de la base de datos

La base de datos se llama `changarro` y tiene cuatro tablas:

- `products` — índices: id, name, category, isActive, createdAt
- `sales` — índices: id, createdAt
- `settings` — índice: id
- `cartItems` — índices: id, productId

Los stores importan `db` directamente y ejecutan operaciones CRUD sobre las tablas.

### backup.ts

Servicio encargado de la exportación e importación (migración y copias de seguridad) de la base de datos en formato JSON.

- **Exportación**: Lee todos los registros de IndexedDB, codifica las imágenes binarias `Blob` de productos a Base64 y empaqueta la información en un archivo JSON descargable.
- **Importación con Combinación (Merge)**: Lee el archivo JSON seleccionado y realiza una combinación transaccional mediante el método `.put()` de Dexie. Inserta nuevos registros e incrementa/actualiza los existentes sin borrar ningún dato que el usuario tenga actualmente en su base de datos local.

---

## Vistas y rutas (views/ + router/)

Cada vista corresponde a una ruta de la aplicación:

| Vista             | Ruta                                                       | Descripción                                              |
| ----------------- | ---------------------------------------------------------- | -------------------------------------------------------- |
| HomeView          | `/`                                                        | Catálogo de productos con búsqueda y FAB de venta rápida |
| CartView          | `/cart`                                                    | Carrito con controles de cantidad y finalizar venta      |
| SalesView         | `/sales`                                                   | Historial de ventas ordenado por fecha                   |
| SaleDetailView    | `/sales/:id`                                               | Detalle completo de una venta específica                 |
| QuickSaleView     | `/quick-sale`                                              | Formulario para agregar item personalizado al carrito    |
| SettingsView      | `/settings`                                                | Configuración del negocio                                |
| InventoryView     | `/settings/inventory`                                      | Gestión CRUD del catálogo de productos                   |
| InventoryFormView | `/settings/inventory/new` y `/settings/inventory/:id/edit` | Formulario de creación y edición de producto             |

Las rutas se definen en `src/router/index.ts` con carga diferida (lazy loading)
para cada vista.

---

## Sistema de diseño (assets/main.css)

El archivo `src/assets/main.css` es el punto de entrada de estilos y contiene:

1. **Importación de Tailwind CSS**: `@import "tailwindcss"`
2. **Tokens del tema** (`@theme`): colores, tipografía, radios, sombras y espaciado del design system Serene Hearth
3. **Utilidades personalizadas** (`@utility`): clases reutilizables para glass effects, paneles, inputs estilizados, etc.
4. **Variables CSS custom**: variables adicionales que complementan los tokens de Tailwind

No existe archivo `tailwind.config.js`. Toda la configuración del tema se hace
directamente en CSS siguiendo el enfoque CSS-first de Tailwind v4.

El plugin `@tailwindcss/vite` se encarga de procesar los estilos durante el
desarrollo y el build.

---

## Componentes (components/)

Los componentes reutilizables se organizan por dominio dentro de `components/`.

### layout/

Componentes estructurales que definen el layout global:

- Barra superior (TopAppBar)
- Barra de navegación inferior (TabBar)

Estos se renderizan en `App.vue` y están presentes en todas las vistas.

---

## Convenciones de código

- **SFC**: siempre `<script setup lang="ts">`, orden: script → template → style
- **Stores**: patrón Setup Store (función), un store por dominio
- **TypeScript**: strict mode habilitado, interfaces para los shapes de datos
- **Nombres de archivo**: PascalCase para componentes y vistas, camelCase para stores y servicios
- **Código en inglés**: variables, funciones, comentarios en inglés
- **Interfaz en español**: todo texto visible para el usuario en español neutro

---

## Siguientes pasos

- [Arquitectura del proyecto](./01-arquitectura.md)
- [Entorno de desarrollo](./02-entorno-desarrollo.md)
- [Volver al índice](./README.md)
