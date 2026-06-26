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
│  [☰ Menú] [Logo Changarro]         [$Total] [👤 Perfil]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   Área principal                         │
│                                                         │
│   VISTA VENTAS (venta rápida / agregar producto)        │
│   ó                                                     │
│   VISTA INVENTARIO (catálogo de productos)              │
│   ó                                                     │
│   VISTA CARRITO (items + total + finalizar)             │
│   ó                                                     │
│   VISTA AJUSTES (configuración)                         │
│                                                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Bottom Navigation (4 tabs, fijo)                       │
│  [💰 Ventas] [📦 Inventario] [🛒 Carrito] [⚙ Ajustes]  │
└─────────────────────────────────────────────────────────┘
```

---

## TopAppBar (Header)

### Contenido

- Botón menú (hamburguesa) a la izquierda
- Logo + nombre "Changarro" (text-primary-fixed-dim, font-headline-md bold)
- Total de venta actual en badge pill (a la derecha)
- Botón avatar/perfil (icono account_circle)

### Comportamiento

- Fijo arriba (fixed top-0, z-50)
- Altura 64px (h-16)
- `bg-surface-container` con backdrop-blur
- Borde inferior `border-outline-variant`

---

## Navegación principal (Bottom Nav)

### 4 tabs

| Tab        | Icono           | Label      | Ruta        |
| ---------- | --------------- | ---------- | ----------- |
| Ventas     | `point_of_sale` | Ventas     | `/`         |
| Inventario | `inventory_2`   | Inventario | `/products` |
| Carrito    | `shopping_cart` | Carrito    | `/cart`     |
| Ajustes    | `settings`      | Ajustes    | `/settings` |

### Comportamiento

- Fijo abajo (fixed bottom-0, z-50)
- `bg-surface-container-lowest/90` con backdrop-blur-xl
- Borde superior + sombra ascendente
- Tab activo: pill background `bg-primary-container text-on-primary-container`, icono FILL 1
- Tabs inactivos: `text-on-surface-variant`, icono FILL 0
- Feedback táctil: `active:scale-90` en cada tab

### En desktop (> 768px)

- Se mantiene como bottom nav o se convierte en side nav
- Los elementos se reorganizan aprovechando el espacio horizontal

---

## Vistas principales

### Vista Ventas (Venta Rápida)

La vista principal y más frecuente. Permite agregar un producto o servicio
personalizado a la venta actual.

**Contenido:**

- Título: "Venta Rápida" (headline-lg-mobile)
- Subtítulo explicativo (body-lg, on-surface-variant)
- Formulario en card elevada (form-card con soft-shadow):
  - Input "Nombre del Producto" (pill, full-width, placeholder: "e.g. Servicio Especial")
  - Input "Precio (MXN)" (pill, grande, signo $ como prefix, type number)
  - Chips de categoría (SERVICIO, PRODUCTO, OTRO) — selección exclusiva
  - Botón "Agregar al Carrito" (pill, full-width, bg-primary-container, icono shopping_cart filled)
- Nota informativa al pie (border-left-4 accent, body-md)

**Flujo:**

1. El comerciante escribe nombre y precio del producto/servicio
2. Opcionalmente selecciona categoría
3. Toca "Agregar al Carrito"
4. Feedback visual: botón muestra spinner → "¡LISTO!" con check_circle
5. El total en el TopAppBar se actualiza en tiempo real

### Vista Inventario (Catálogo)

Gestión del catálogo de productos registrados del negocio.

**Contenido:**

- Barra de búsqueda (pill input, full-width)
- Lista de productos con thumbnails (80x80px, rounded)
- Cada producto muestra: imagen, nombre, precio, categoría
- Glow suave en hover (soft-glow)
- FAB o botón para agregar nuevo producto

**Acciones por producto:**

- Tap → agregar al carrito
- Editar (precio, nombre, categoría, imagen)
- Desactivar/activar

### Vista Carrito

Muestra los items de la venta actual y permite finalizar.

**Contenido:**

- Header: "Carrito" (headline-lg-mobile) + badge con contador de items (label-md, uppercase)
- Lista de items con:
  - Thumbnail (80x80px, rounded, border-outline-variant)
  - Nombre del producto (label-md, bold, on-surface)
  - Precio unitario (body-lg, bold, surface-tint)
  - Controles de cantidad: botones circulares -/+ (w-8 h-8 rounded-full)
  - Botón eliminar (material icon delete, color error)
- Panel flotante liquid-glass (fixed, above bottom nav):
  - Subtotal (label-md uppercase + body-lg bold)
  - Impuestos 16% (label-md uppercase + body-lg bold)
  - Separador (h-[1px] bg-outline-variant)
  - Total (headline-md, color surface-tint)
  - Botón "Finalizar Venta" (pill, full-width, bg-surface-tint, icono payments)

**Interacciones:**

- Tap delete → animación scale(0.9) + translateX(100px) + opacity 0 → remove
- Tap +/- → ajustar cantidad, recalcular subtotales y total
- "Finalizar Venta" → registra venta, vacía carrito, feedback visual

### Vista Ajustes (Configuración)

Configuración general del negocio y la aplicación.

**Contenido:**

- Secciones separadas con headers (label-md, uppercase, tracking-widest)
- Toggle switches para opciones booleanas (oversized, tactile)
- Campos de texto para nombre del negocio
- Selector de moneda
- Configuración de impuestos (toggle + input porcentaje)
- Botón exportar datos
- Sección "Acerca de"

---

## Interacciones clave

| Acción                      | Método                             |
| --------------------------- | ---------------------------------- |
| Agregar producto al carrito | Formulario en Vista Ventas         |
| Cambiar cantidad en carrito | Botones -/+ en Vista Carrito       |
| Eliminar item del carrito   | Botón delete con animación         |
| Buscar producto             | Input búsqueda en Vista Inventario |
| Finalizar venta             | Botón "Finalizar Venta" en Carrito |
| Crear producto              | Formulario en Inventario           |
| Navegar entre vistas        | Bottom nav (4 tabs)                |

---

## Modales y flujos

### Modal "Cobrar" (finalizar venta)

- Muestra resumen de items y total
- Selector de método de pago (efectivo, tarjeta, transferencia)
- Campo de "recibido" (para calcular cambio en efectivo)
- Botón confirmar
- Confirmación visual de venta registrada (toast/feedback)

### Modal "Nuevo producto"

- Formulario con campos del producto
- Validación en tiempo real
- Botón guardar
- Feedback de éxito

### Modal "Detalle de venta" (desde historial)

- Fecha y hora completa
- Lista detallada de items con cantidades y precios
- Total y método de pago
- (Futuro: opción de devolver/cancelar venta)

---

## Interacciones clave

| Acción                      | Método                             |
| --------------------------- | ---------------------------------- |
| Agregar producto al carrito | Tap en producto / botón +          |
| Cambiar cantidad en carrito | Tap en cantidad → editar           |
| Eliminar item del carrito   | Swipe o botón eliminar             |
| Buscar producto             | Tap en barra de búsqueda, escribir |
| Cobrar venta                | Botón cobrar prominente            |
| Crear producto              | Botón + en vista Productos         |
| Ver detalle de venta        | Tap en venta del historial         |
| Cambiar tema                | Toggle en toolbar                  |

---

## Rutas (Vue Router)

```
/                       → Vista Ventas (venta rápida, agregar producto custom)
/products               → Vista Inventario (catálogo de productos)
/products/new           → Crear nuevo producto
/products/:id/edit      → Editar producto
/cart                   → Vista Carrito (items, total, finalizar venta)
/settings               → Vista Ajustes (configuración del negocio)
```

---

## Gestión de datos (POC)

### Almacenamiento

- IndexedDB vía Dexie.js o abstracción propia
- Datos estructurados (productos, ventas, configuración)
- Persistencia local completa — funciona sin internet
- Eventual: exportar como CSV/JSON para respaldo manual

### Stores (Pinia)

- `useProductsStore` — CRUD de productos, búsqueda, filtros
- `useCartStore` — carrito de venta actual, agregar/quitar items, totales
- `useSalesStore` — registro de ventas completadas, historial
- `useSettingsStore` — preferencias del usuario (tema, moneda, nombre negocio)

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

1. Layout base (TopAppBar + Bottom Nav + área principal)
2. Vista Ventas: formulario de venta rápida (nombre + precio + categoría + agregar)
3. Vista Carrito: lista de items, totales, botón finalizar venta
4. Vista Inventario: lista de productos, crear producto
5. Almacenamiento en IndexedDB (productos, carrito, ventas)
6. Total de venta actual visible en TopAppBar

### Fase 2 - Usabilidad

1. Búsqueda rápida de productos en Inventario
2. Categorías de productos (chips de selección)
3. Feedback visual en acciones (spinner → check en botones)
4. Animación de eliminación en carrito (scale + translateX)
5. Validaciones de formularios
6. Impuestos configurables

### Fase 3 - Funcionalidad extendida

1. Vista Ajustes (nombre negocio, moneda, impuestos)
2. Historial de ventas (dentro de Ajustes o como sub-vista de Ventas)
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
