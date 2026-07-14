# Arquitectura

Este documento describe la estructura general de Changarro y las decisiones
técnicas detrás de su diseño.

---

## Vista general

Changarro es una aplicación multiplataforma (Android, Windows, macOS) construida
con tecnologías web empaquetadas en un shell nativo.

```
┌────────────────────────────────────────────────────┐
│                   Frontend                          │
│         Vue 3.5 + Vite 8 + Tailwind CSS 4          │
│             SPA empaquetada en Tauri 2              │
├────────────────────────────────────────────────────┤
│                   Runtime nativo                   │
│              Tauri 2 (Rust backend)                │
│         Acceso a filesystem, notificaciones        │
├────────────────────────────────────────────────────┤
│                   Persistencia                     │
│          IndexedDB vía Dexie.js (local)            │
│       Datos: productos, ventas, carrito, ajustes   │
├────────────────────────────────────────────────────┤
│                   Plataformas                      │
│          Android • Windows • macOS                 │
└────────────────────────────────────────────────────┘
```

## Stack técnico

| Capa          | Tecnología                                         | Motivo                                                 |
| ------------- | -------------------------------------------------- | ------------------------------------------------------ |
| Bundler       | Vite 8                                             | Velocidad de desarrollo, soporte nativo de Vue         |
| Framework UI  | Vue 3.5+ (Composition API, `<script setup>`)       | Reactividad declarativa, ecosistema maduro             |
| Router        | Vue Router 4                                       | Navegación SPA estándar                                |
| Estado global | Pinia (setup stores)                               | Stores tipados, integración directa con Vue            |
| Estilos       | Tailwind CSS 4 (CSS-first con `@tailwindcss/vite`) | Utilidades CSS sin overhead, configuración en CSS puro |
| Lenguaje      | TypeScript (strict mode)                           | Seguridad de tipos, mejor experiencia de desarrollo    |
| Shell nativo  | Tauri 2                                            | Binarios ligeros, acceso nativo, multiplataforma       |
| Persistencia  | IndexedDB vía Dexie.js                             | Persistencia local sin dependencias externas           |
| Testing       | Vitest + happy-dom + fake-indexeddb                | Pruebas rápidas, integradas con Vite                   |

## Principios arquitectónicos

### Local-first

La aplicación funciona completamente sin internet. Todos los datos se almacenan
en el dispositivo del usuario. No existe servidor central ni dependencia de
servicios en la nube.

### Offline por defecto

No hay estados de "sin conexión" ni degradación de funcionalidad. La app
siempre tiene acceso completo a todos los datos porque viven localmente.

### Separación de capas

```
Vista (Vue components) → Stores (Pinia) → Servicios (db.ts / Dexie) → IndexedDB
```

Los componentes Vue consumen stores de Pinia. Los stores delegan la persistencia
a la capa de servicios (Dexie.js). Esto permite cambiar el motor de almacenamiento
sin tocar la lógica de negocio ni las vistas.

### Multiplataforma sin compromisos

Gracias a Tauri 2, el mismo código genera:

- APK para Android
- Instalador .exe para Windows
- .dmg para macOS

El frontend es idéntico en todas las plataformas. Las diferencias de plataforma
se manejan en la capa de Tauri (Rust).

---

## Modelo de datos

Todos los datos se almacenan en IndexedDB a través de Dexie.js. La base de datos
se llama `changarro` y tiene las siguientes tablas:

### Product

Representa un artículo que el negocio vende.

```typescript
interface Product {
  id: string
  name: string
  price: number // precio de venta unitario
  category: string // SERVICIO, PRODUCTO u OTRO
  unit: string // pieza, kg, litro, paquete...
  isActive: boolean // si está disponible para venta
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
}
```

### Sale

Representa una transacción completada.

```typescript
interface Sale {
  id: string
  items: SaleItem[] // productos vendidos
  subtotal: number // suma antes de impuestos
  taxIncluded: boolean // si el IVA estaba activo al momento de la venta
  taxRate: number // porcentaje de impuesto aplicado
  taxAmount: number // monto del impuesto
  total: number // monto final cobrado
  receivedAmount?: number // monto en efectivo recibido del cliente
  changeAmount?: number // cambio entregado al cliente
  createdAt: string // ISO 8601
}
```

### SaleItem

Detalle de cada producto dentro de una venta.

```typescript
interface SaleItem {
  productId: string
  productName: string // snapshot del nombre al momento de la venta
  quantity: number
  unitPrice: number // precio al momento de la venta
  subtotal: number // unitPrice × quantity
}
```

Los precios se guardan como snapshot en cada venta. Si un producto cambia
de precio, las ventas anteriores conservan el precio original.

### AppSettings

Configuración general del negocio.

```typescript
interface AppSettings {
  id: string
  taxEnabled: boolean // si el IVA está activo
  taxRate: number // porcentaje (ej: 16)
  businessName: string // nombre del negocio
  currency: string // moneda (ej: MXN)
}
```

### CartItemRecord

Elemento del carrito persistido en IndexedDB. El carrito sobrevive si el
usuario cierra la aplicación sin finalizar la venta.

```typescript
interface CartItemRecord {
  id: string
  productId: string
  productName: string
  unitPrice: number
  quantity: number
}
```

---

## Estrategia de persistencia

- **IndexedDB** es el motor de almacenamiento principal a través de Dexie.js
- **El carrito se persiste** en la tabla `cartItems` para que no se pierda al cerrar la app
- **Los ajustes se persisten** en la tabla `settings` con un registro único
- No se usa localStorage ni sessionStorage
- Eventual: migración a SQLite vía Tauri para mejor rendimiento con datasets grandes

---

## Sistema de diseño

La interfaz visual sigue el design system **Serene Hearth**: una fusión de
Soft Minimalism con Tactile Glassmorphism. La filosofía es "Cozy Tech" —
interfaces cálidas, calmadas y táctiles.

Características principales:

- Dark mode como diseño base (sin light mode en esta fase)
- Paleta lavender/neutral warm
- Formas pill-shaped (botones, inputs, chips)
- Tipografía: Plus Jakarta Sans (headlines) + Atkinson Hyperlegible Next (cuerpo)
- Iconografía: Material Symbols Outlined

Los tokens de diseño se definen en `src/assets/main.css` usando directivas
`@theme` y `@utility` de Tailwind CSS 4.

---

## Estructura del repositorio

```
changarro-app/
├── documentacion/             ← Documentación del proyecto
├── src-tauri/                 ← Shell nativo (Rust + Tauri 2)
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── capabilities/
│   └── src/
└── src/                       ← Frontend (Vue)
    ├── assets/
    │   └── main.css           ← Tailwind + design tokens + @utility
    ├── components/
    │   └── layout/            ← Componentes de layout (TopAppBar, TabBar)
    ├── router/
    │   └── index.ts           ← Definición de rutas
    ├── services/
    │   └── db.ts              ← Dexie.js (IndexedDB)
    ├── stores/
    │   ├── products.ts        ← Store de productos
    │   ├── cart.ts            ← Store del carrito
    │   ├── sales.ts           ← Store de ventas
    │   └── settings.ts        ← Store de ajustes
    ├── views/
    │   ├── HomeView.vue       ← Catálogo (/)
    │   ├── CartView.vue       ← Carrito (/cart)
    │   ├── SalesView.vue      ← Historial (/sales)
    │   ├── SaleDetailView.vue ← Detalle de venta (/sales/:id)
    │   ├── QuickSaleView.vue  ← Venta rápida (/quick-sale)
    │   ├── SettingsView.vue   ← Ajustes (/settings)
    │   ├── InventoryView.vue  ← Inventario (/settings/inventory)
    │   └── InventoryFormView.vue ← Crear/Editar producto
    ├── App.vue
    └── main.ts
```

---

## Siguientes pasos

- [Entorno de desarrollo](./02-entorno-desarrollo.md)
- [Estructura del código](./03-estructura-codigo.md)
- [Volver al índice](./README.md)
