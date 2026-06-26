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
│            Vue 3 + Vite + Tailwind CSS 4           │
│                  SPA empaquetada en Tauri           │
├────────────────────────────────────────────────────┤
│                   Runtime nativo                   │
│              Tauri 2 (Rust backend)                │
│         Acceso a filesystem, notificaciones        │
├────────────────────────────────────────────────────┤
│                   Storage                          │
│           IndexedDB (datos estructurados)           │
│     Eventual: SQLite vía Tauri para persistencia   │
├────────────────────────────────────────────────────┤
│                   Plataformas                      │
│          Android • Windows • macOS                 │
└────────────────────────────────────────────────────┘
```

## Stack técnico

| Capa | Tecnología | Motivo |
|------|-----------|--------|
| Bundler | Vite 6+ | Velocidad de desarrollo, soporte nativo de Vue |
| Framework UI | Vue 3.5+ (Composition API) | Reactividad declarativa, ecosistema maduro |
| Router | Vue Router 4 | Navegación SPA estándar |
| Estado global | Pinia | Stores tipados, integración directa con Vue |
| Estilos | Tailwind CSS 4 | Utilidades CSS sin overhead, configuración en CSS puro |
| Lenguaje | TypeScript (strict) | Seguridad de tipos, mejor experiencia de desarrollo |
| Shell nativo | Tauri 2 | Binarios ligeros, acceso nativo, multiplataforma |
| Storage (POC) | IndexedDB | Persistencia local sin dependencias externas |
| Testing | Vitest | Rápido, integrado con Vite |

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
Vista (Vue components) → Stores (Pinia) → Servicios (storage) → IndexedDB
```

Los componentes Vue consumen stores de Pinia. Los stores delegan la persistencia
a una capa de servicios que abstrae el storage. Esto permite cambiar el motor
de almacenamiento sin tocar la lógica de negocio.

### Multiplataforma sin compromisos

Gracias a Tauri 2, el mismo código genera:
- APK para Android
- Instalador .exe para Windows
- .dmg para macOS

El frontend es idéntico en todas las plataformas. Las diferencias de plataforma
se manejan en la capa de Tauri (Rust).

## Modelo de datos

### Producto

Representa un artículo que el negocio vende.

```typescript
interface Product {
  id: string
  name: string
  price: number          // precio de venta unitario
  cost?: number          // costo de compra (opcional)
  category?: string      // categoría (opcional)
  unit: string           // pieza, kg, litro, paquete...
  isActive: boolean      // si está disponible para venta
  createdAt: string      // ISO 8601
  updatedAt: string      // ISO 8601
}
```

### Venta

Representa una transacción completada.

```typescript
interface Sale {
  id: string
  items: SaleItem[]
  total: number
  paymentMethod: 'cash' | 'card' | 'transfer'
  createdAt: string      // ISO 8601
}

interface SaleItem {
  productId: string
  productName: string    // snapshot al momento de la venta
  quantity: number
  unitPrice: number      // precio al momento de la venta
  subtotal: number
}
```

Los precios se guardan como snapshot en cada venta. Si un producto cambia
de precio, las ventas anteriores conservan el precio original.

## Estructura del repositorio

```
changarro-app/
├── documentacion/          ← Documentación del proyecto
├── src-tauri/              ← Shell nativo (Rust + Tauri 2)
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── capabilities/
│   └── gen/                ← Código generado por plataforma
└── src/                    ← Frontend (por crear)
    ├── assets/styles/
    ├── components/
    ├── composables/
    ├── router/
    ├── services/
    ├── stores/
    ├── types/
    ├── views/
    ├── App.vue
    └── main.ts
```

---

## Siguientes pasos

- [Entorno de desarrollo](./02-entorno-desarrollo.md)
- [Volver al índice](./README.md)
