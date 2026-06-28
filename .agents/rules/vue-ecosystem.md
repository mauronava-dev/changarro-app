---
trigger: always_on
glob: "src/**/*.{ts,vue}"
description: Estándares y mejores prácticas para Vue 3.5+, Pinia, Vue Router y TypeScript.
---

# Vue Ecosystem - Estándares y Mejores Prácticas

Este steering define las convenciones de desarrollo para el proyecto Changarro.
Stack: Vue 3.5+, Vite 6+, Pinia, Vue Router 4, Tailwind CSS 4, TypeScript.

---

## Vue 3.5+ (Composition API)

### Sintaxis obligatoria

- Usar siempre `<script setup lang="ts">` en todos los SFC
- No usar Options API bajo ninguna circunstancia
- Orden en SFC: `<script setup>` → `<template>` → `<style>`

### APIs modernas (Vue 3.4/3.5)

- Usar `defineModel()` para v-model bidireccional en componentes (reemplaza prop + emit manual)
- Usar `useTemplateRef('name')` para referencias a elementos DOM (reemplaza `ref(null)` con nombre de variable)
- Usar `onWatcherCleanup()` dentro de watchers para cancelar side effects (peticiones fetch, timers)
- Reactive props destructuring es estable: `const { title, count = 0 } = defineProps<Props>()`
- Usar `defineOptions({ name: 'ComponentName' })` solo cuando se necesite nombre explícito (recursión, devtools)

### Composables

- Prefijo `use` obligatorio: `useProducts`, `useCart`, `useSales`
- Un composable = una responsabilidad
- Retornar siempre un objeto con propiedades nombradas (no tuplas)
- Los composables manejan lógica reutilizable; el estado global va en Pinia
- Ubicación: `src/composables/`

```typescript
// ✅ Correcto
export function useProducts() {
  const products = ref<Product[]>([])
  const isLoading = ref(false)

  async function fetchProducts() { /* ... */ }

  return { products, isLoading, fetchProducts }
}

// ❌ Incorrecto - retornar tupla
export function useProducts() {
  return [products, isLoading, fetchProducts]
}
```

### Reactividad

- Usar `ref()` para primitivos y valores que se reasignan
- Usar `reactive()` solo para objetos complejos que no se reasignan
- Usar `computed()` para valores derivados (no crear refs que se actualizan manualmente en watchers)
- Usar `shallowRef()` para objetos grandes que se reemplazan completos (como listas de productos cargados)
- Usar `toRefs()` / `storeToRefs()` al desestructurar stores o reactive objects

### Watchers

- Preferir `watchEffect()` cuando el watcher depende de todo lo que lee
- Usar `watch()` explícito cuando solo interesa un subset de dependencias
- Usar `{ immediate: true }` en vez de llamar la función manualmente después del watch
- Limpiar side effects con `onWatcherCleanup()`:

```typescript
watch(searchQuery, (query) => {
  const controller = new AbortController()
  onWatcherCleanup(() => controller.abort())

  fetch(`/api/search?q=${query}`, { signal: controller.signal })
    .then(/* ... */)
})
```

---

## Pinia (Estado global)

### Convenciones

- Usar Setup Stores (función) en vez de Option Stores (objeto):

```typescript
// ✅ Setup Store
export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const searchQuery = ref('')

  const filteredProducts = computed(() =>
    products.value.filter(p =>
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  )

  function addProduct(product: Product) {
    products.value.push(product)
  }

  return { products, searchQuery, filteredProducts, addProduct }
})
```

- Un store por dominio/feature (no un store monolítico)
- Stores pequeños y cohesivos: `useProductsStore`, `useCartStore`, `useSalesStore`, `useSettingsStore`
- Ubicación: `src/stores/`
- Naming: `use[Feature]Store` en el archivo `src/stores/[feature].ts`

### Acceso desde componentes

- Usar `storeToRefs()` para desestructurar estado reactivo del store
- Las acciones (funciones) se desestructuran directo sin `storeToRefs`

```typescript
const store = useProductsStore()
const { products, filteredProducts } = storeToRefs(store)
const { addProduct, removeProduct } = store
```

---

## Vue Router 4

### Estructura

- Definir rutas en `src/router/index.ts`
- Usar lazy loading para todas las vistas: `() => import('@/views/SellView.vue')`
- Las rutas se definen con objetos tipados, no strings sueltos

### Convenciones

- Vistas (páginas) en `src/views/`
- Componentes reutilizables en `src/components/`
- Usar `meta` fields para títulos y metadata de ruta
- Navegación programática con `router.push({ name: 'routeName' })` (por nombre, no por path)

---

## Tailwind CSS 4

### Configuración CSS-first

Tailwind v4 elimina `tailwind.config.js`. Toda la configuración va en CSS:

```css
/* src/assets/styles/main.css */
@import "tailwindcss";

@theme {
  --color-primary: #your-color;
  --color-surface: #your-surface;
  --font-sans: 'Inter', sans-serif;
  --radius-md: 0.5rem;
}
```

### Convenciones

- No crear archivo `tailwind.config.js` — usar directiva `@theme` en CSS
- Customización de tema en `src/assets/styles/main.css`
- Usar clases de utilidad en el template directamente
- Para estilos complejos o repetitivos, extraer con `@apply` en el CSS solo como último recurso
- Usar variantes de Tailwind (`dark:`, `hover:`, `focus:`) antes de escribir CSS custom
- SCSS es válido para componentes que requieran scoped styles complejos

---

## TypeScript

### Configuración

- Strict mode habilitado
- Interfaces para definir shapes de datos (preferir `interface` sobre `type` para objetos)
- Types para uniones, intersecciones, y utilidades

### Convenciones

- Todas las props tipadas con `defineProps<Props>()`
- Todos los emits tipados con `defineEmits<Emits>()`
- No usar `any` — usar `unknown` si el tipo es desconocido
- Tipos compartidos en `src/types/`
- Tipos específicos de un feature colocados junto al feature

```typescript
// src/types/product.ts
export interface Product {
  id: string
  name: string
  price: number
  cost?: number
  category?: string
  unit: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// src/types/sale.ts
export interface Sale {
  id: string
  items: SaleItem[]
  total: number
  paymentMethod: 'cash' | 'card' | 'transfer'
  createdAt: string
}

export interface SaleItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}
```

---

## Estructura de proyecto

```
src/
├── assets/
│   └── styles/
│       └── main.css          # Tailwind + @theme + @utility
├── components/
│   ├── ui/                   # Componentes base genéricos (UiButton, UiInput, UiCard...)
│   ├── sell/                 # Componentes del punto de venta (carrito, grid productos)
│   ├── products/             # Componentes del catálogo de productos
│   ├── history/              # Componentes del historial de ventas
│   └── layout/               # Componentes del layout (Toolbar, TabBar)
├── composables/              # Composables reutilizables
├── router/
│   └── index.ts
├── stores/                   # Pinia stores
├── types/                    # TypeScript interfaces/types
├── views/                    # Páginas/vistas (una por ruta)
├── services/                 # Capa de abstracción de storage/API
├── App.vue
└── main.ts
```

---

## Nombrado de archivos

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Componentes Vue | PascalCase | `ProductCard.vue`, `CartPanel.vue` |
| Composables | camelCase con prefijo use | `useProducts.ts`, `useCart.ts` |
| Stores | camelCase | `products.ts`, `sales.ts` |
| Types | camelCase | `product.ts`, `sale.ts` |
| Servicios | camelCase | `storageService.ts` |
| Vistas | PascalCase | `SellView.vue`, `ProductsView.vue` |
| Utilidades | camelCase | `markdown.ts`, `formatDate.ts` |

---

## Componentes

### Organización interna de `<script setup>`

Orden recomendado dentro del bloque script:

1. Imports
2. Props y emits
3. Stores / composables
4. Refs y reactive state
5. Computed properties
6. Watchers
7. Funciones/métodos
8. Lifecycle hooks

### Reglas generales

- Componentes pequeños y con una sola responsabilidad
- Props hacia abajo, eventos hacia arriba (no mutar props)
- Usar `v-model` con `defineModel()` para inputs controlados
- Slots para composición flexible
- Componentes base (ui/) son genéricos y sin lógica de negocio

### Componentes reutilizables y configurables (`src/components/ui/`)

Los componentes UI son **genéricos, configurables vía props, y desacoplados de lógica de negocio**.
Siguen un patrón consistente:

#### Principios

1. **Configurables vía props**: tamaño, variante, estado, ícono, etc.
2. **Extensibles vía slots**: contenido flexible sin forzar estructura interna
3. **Estilizables vía prop `class`**: permiten override de clases Tailwind desde el padre
4. **Sin estado interno innecesario**: el estado vive en el padre o en el store
5. **Accesibles**: roles ARIA, labels, keyboard navigation cuando aplique

#### Patrón de props (variantes y tamaños)

```typescript
interface Props {
  variant?: 'solid' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const { variant = 'solid', size = 'md', disabled = false } = defineProps<Props>()
```

#### Patrón de clases computadas

Usar una computed que resuelve las clases según las props:

```typescript
const classes = computed(() => [
  // Base
  'inline-flex items-center justify-center font-medium transition-all duration-200',
  // Tamaño
  sizeClasses[size],
  // Variante
  variantClasses[variant],
  // Estado
  disabled && 'opacity-50 pointer-events-none',
])
```

#### Mapas de variantes (objeto constante)

Definir mapas de clases como constantes fuera del componente:

```typescript
const sizeClasses = {
  sm: 'h-8 px-3 text-sm rounded-lg',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-12 px-6 text-base rounded-xl',
} as const

const variantClasses = {
  solid: 'bg-primary text-white shadow-hard hover:bg-primary-hover active:scale-[0.98]',
  ghost: 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5',
  outline: 'border border-current bg-transparent hover:bg-black/5',
} as const
```

#### Slot default + slots nombrados

```vue
<template>
  <button :class="classes" :disabled="disabled">
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </button>
</template>
```

#### Catálogo de componentes UI base a construir

| Componente | Props clave | Notas |
|-----------|-------------|-------|
| `UiButton` | variant, size, disabled, loading | Sólido por defecto (Nivel 3) |
| `UiInput` | size, placeholder, disabled, error | Glass-input estilizado |
| `UiIconButton` | variant, size, icon, ariaLabel | Solo ícono, cuadrado |
| `UiCard` | padding, hoverable | Glass-panel con border-radius 24px |
| `UiModal` | open, title | Nivel 2, overlay + glass-panel-md |
| `UiBreadcrumb` | segments | Clickeable, separador `/` |
| `UiDropdown` | items, position | Menú contextual |
| `UiTooltip` | text, position | Nivel 2, glass-panel-md |
| `UiToggle` | modelValue | Switch on/off |
| `UiBadge` | variant, size | Tags, estados |

#### Prefijo `Ui` para componentes base

Todos los componentes genéricos del sistema de diseño usan prefijo `Ui`:
`UiButton.vue`, `UiInput.vue`, `UiCard.vue`, etc.

Esto los distingue de componentes de feature (`ProductCard.vue`, `CartItem.vue`)
que son específicos del dominio y consumen los `Ui*` internamente.

### Componentes de feature (`src/components/`)

Componentes específicos del dominio de la app. Consumen componentes `Ui*` y
contienen lógica de negocio ligera. Ejemplo:

```
components/
├── ui/             ← Genéricos, sin lógica de negocio
│   ├── UiButton.vue
│   ├── UiInput.vue
│   └── UiCard.vue
├── sell/           ← Relacionados al punto de venta
│   ├── ProductGrid.vue
│   ├── CartPanel.vue
│   └── CartItem.vue
├── products/       ← Relacionados al catálogo
│   ├── ProductCard.vue
│   ├── ProductForm.vue
│   └── ProductList.vue
├── history/        ← Relacionados al historial de ventas
│   ├── SaleCard.vue
│   ├── SaleSummary.vue
│   └── SaleDetail.vue
└── layout/         ← Relacionados al layout general
    ├── AppToolbar.vue
    └── AppTabBar.vue
```

---

## Vite

### Configuración base

- Alias `@` → `src/` configurado en `vite.config.ts` y `tsconfig.json`
- Variables de entorno en archivos `.env` con prefijo `VITE_`
- Plugins mínimos: `@vitejs/plugin-vue`

---

## Testing (cuando se solicite)

- Unit tests con Vitest
- Component tests con @vue/test-utils + Vitest
- E2E con Playwright
- Archivos de test junto al código: `useNotes.test.ts` al lado de `useNotes.ts`
