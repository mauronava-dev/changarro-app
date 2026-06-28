---
trigger: always_on
glob: "src/**/*.{ts,vue}"
description: Definición de la interfaz de usuario, layout general, rutas y flujo de navegación principal de la aplicación.
---

# Changarro - Definición de Interfaz y Navegación

Este steering describe la estructura, comportamiento y resultado esperado de la
interfaz de Changarro: una app de gestión de ventas diarias para negocios locales.

---

## Concepto de producto

Aplicación instalable para registrar ventas diarias, gestionar un catálogo de
productos y consultar el historial de ventas. Local-first, funciona sin internet,
diseñada para comerciantes de negocios pequeños.

---

## Layout general

```
┌─────────────────────────────────────────────────────────┐
│  TopAppBar (fijo)                                       │
│  [Logo Changarro]               [$Total] [👤 Ajustes]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   Área principal                         │
│                                                         │
│   VISTA INICIO (catálogo + FAB venta rápida)            │
│   ó                                                     │
│   VISTA CARRITO (items + total + finalizar)             │
│   ó                                                     │
│   VISTA VENTAS (historial de ventas)                    │
│   ó                                                     │
│   VISTA AJUSTES (desde TopAppBar, no nav)               │
│   ó                                                     │
│   VISTA INVENTARIO (sub-página de Ajustes)              │
│   ó                                                     │
│   VISTA VENTA RÁPIDA (desde FAB en Inicio)              │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Bottom Navigation (3 tabs, fijo)                       │
│  [🏠 Inicio] [🛒 Carrito] [💰 Ventas]                   │
└─────────────────────────────────────────────────────────┘
```

---

## TopAppBar (Header)

### Contenido

- Logo + nombre "Changarro" (text-primary-fixed-dim, font-headline-md bold)
- Total de venta actual en badge pill (a la derecha)
- Botón avatar/perfil (icono account_circle) → navega a /settings

### Comportamiento

- Fijo arriba (fixed top-0, z-50)
- Altura 64px (h-16)
- `bg-surface-container` con backdrop-blur
- Borde inferior `border-outline-variant`
- El botón account_circle es un RouterLink a /settings

---

## Navegación principal (Bottom Nav)

### 3 tabs

| Tab     | Icono           | Label   | Ruta     |
| ------- | --------------- | ------- | -------- |
| Inicio  | `home`          | Inicio  | `/`      |
| Carrito | `shopping_cart` | Carrito | `/cart`  |
| Ventas  | `point_of_sale` | Ventas  | `/sales` |

### Comportamiento

- Fijo abajo (fixed bottom-0, z-50)
- `bg-surface-container-lowest/90` con backdrop-blur-xl
- Borde superior + sombra ascendente
- Tab activo: pill background `bg-primary-container text-on-primary-container`, icono FILL 1
- Tabs inactivos: `text-on-surface-variant`, icono FILL 0
- Feedback táctil: `active:scale-90` en cada tab

---

## Vistas principales

### Vista Inicio (Catálogo de Productos)

La vista principal. Muestra los productos del catálogo para venta rápida.

**Contenido:**

- Título: "Productos" (headline-lg-mobile)
- Subtítulo: "Toca un producto para agregarlo al carrito" (body-md, on-surface-variant)
- Lista de productos (cards clickeables)
- FAB (+) en bottom-right (above nav) → navega a /quick-sale

**Flujo:**

1. El comerciante ve los productos del catálogo
2. Toca un producto → se agrega al carrito
3. Toca el FAB → va al formulario de Venta Rápida

### Vista Venta Rápida

Formulario para agregar un producto o servicio personalizado a la venta actual.
Accesible desde el FAB en la vista de Inicio.

**Contenido:**

- Header con botón back (arrow_back) que regresa a /
- Título: "Venta Rápida" (headline-lg-mobile)
- Subtítulo explicativo (body-lg, on-surface-variant)
- Formulario en card elevada:
  - Input "Nombre del Producto" (pill, full-width)
  - Input "Precio (MXN)" (pill, grande, signo $ como prefix)
  - Chips de categoría (SERVICIO, PRODUCTO, OTRO)
  - Botón "Agregar al Carrito" (pill, full-width, bg-primary-container)
- Nota informativa al pie

### Vista Carrito

Muestra los items de la venta actual y permite finalizar. (Sin cambios)

### Vista Ventas (Historial)

Muestra el historial de ventas completadas.

**Contenido:**

- Título: "Ventas" (headline-lg-mobile)
- Estado vacío (cuando no hay ventas):
  - Icono receipt_long (48px, text-on-surface-variant/50)
  - Texto: "No se han realizado ventas aún" (font-display, semibold)
  - Subtítulo: "Las ventas finalizadas aparecerán aquí"
- Cuando hay ventas: lista de ventas completadas con fecha, total, items

### Vista Ajustes (Configuración)

Accesible desde el botón account_circle en el TopAppBar, NO desde el bottom nav.

**Contenido:**

- Link "Gestionar inventario" → /settings/inventory
- Nombre del negocio, moneda
- Configuración de impuestos (toggle + porcentaje)
- Exportar ventas
- Acerca de (versión)

### Vista Inventario (Gestión de productos)

Sub-página de Ajustes. Permite agregar, editar y eliminar productos del catálogo.

**Contenido:**

- Header con botón back → /settings
- Título: "Inventario" + badge con conteo de items
- Barra de búsqueda
- Lista de productos con acciones: editar, eliminar
- FAB para agregar nuevo producto

---

## Rutas (Vue Router)

```
/                       → HomeView (catálogo de productos + FAB)
/cart                   → CartView (carrito + total + finalizar)
/sales                  → SalesView (historial de ventas)
/quick-sale             → QuickSaleView (formulario venta rápida)
/settings               → SettingsView (configuración, acceso desde TopAppBar)
/settings/inventory     → InventoryView (gestión de productos)
```

---

## Gestión de datos (POC)

### Almacenamiento

- IndexedDB vía Dexie.js o abstracción propia
- Datos estructurados (productos, ventas, configuración)
- Persistencia local completa — funciona sin internet
- Eventual: exportar como CSV/JSON para respaldo manual

### Stores (Pinia)

- `useProductsStore` — catálogo de productos, búsqueda
- `useCartStore` — carrito de venta actual, agregar/quitar items, totales
- `useSalesStore` — historial de ventas completadas
- `useSettingsStore` — preferencias del negocio (nombre, moneda, impuestos)

---

## Tema visual

### Dark mode como base

- Dark mode es la identidad visual principal de Changarro
- No hay toggle de tema en el POC — solo dark mode
- Clase `dark` siempre presente en `<html>`
- Eventual: light mode como mejora futura

### Paleta aplicada

- Fondo base: #131313 (surface)
- Cards: #20201f (surface-container) con border #46464c (outline-variant)
- Texto primario: #e5e2e1 (on-surface)
- Texto secundario: #c7c5cc (on-surface-variant)
- Acentos/precios: #c5c5d8 (primary-fixed-dim / surface-tint)
- Botones primarios: #e1e1f5 (primary-container), texto #626374 (on-primary-container)

---

## Prioridad de implementación (fases)

### Fase 1 - POC funcional

1. Layout base (TopAppBar + Bottom Nav 3 tabs + área principal)
2. Vista Inicio: catálogo de productos con FAB para venta rápida
3. Vista Venta Rápida: formulario (nombre + precio + categoría + agregar)
4. Vista Carrito: lista de items, totales, botón finalizar venta
5. Vista Ventas: historial con empty state
6. Almacenamiento en IndexedDB (productos, carrito, ventas)
7. Total de venta actual visible en TopAppBar

### Fase 2 - Usabilidad

1. Búsqueda rápida de productos en Inventario
2. Categorías de productos (chips de selección)
3. Feedback visual en acciones (spinner → check en botones)
4. Animación de eliminación en carrito (scale + translateX)
5. Validaciones de formularios
6. Impuestos configurables

### Fase 3 - Funcionalidad extendida

1. Vista Ajustes completa (nombre negocio, moneda, impuestos)
2. Gestión de inventario (agregar/editar/eliminar productos)
3. Exportar datos (CSV/JSON)
4. Producto más vendido y estadísticas básicas
5. Desactivar/reactivar productos
6. Imágenes de productos (thumbnail)

### Fase 4 - Polish y distribución

1. Micro-interacciones y transiciones (active:scale, hover:glow)
2. Responsive completo (Android como prioridad)
3. Performance en dispositivos de gama baja
4. Build y distribución Android (APK)
5. Build Windows y macOS
