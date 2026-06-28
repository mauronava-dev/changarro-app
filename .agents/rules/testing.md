---
trigger: always_on
glob: "src/**/*.test.ts"
description: Convenciones y mejores prácticas para escribir pruebas unitarias con Vitest.
---

# Testing - Convenciones y Prácticas

Este steering define cómo escribir y mantener pruebas unitarias en Changarro.
Stack: Vitest + happy-dom + fake-indexeddb + @vue/test-utils.

---

## Setup

### Configuración

- Vitest configurado en `vite.config.ts` con `test` block
- Entorno: `happy-dom` (simula DOM sin browser real)
- Setup file: `src/tests/setup.ts` (carga `fake-indexeddb/auto` para simular IndexedDB)
- Globals habilitados (`describe`, `it`, `expect` sin importar)

### Ejecución

```bash
npm run test        # Corre una vez y sale
npm run test:watch  # Modo watch (re-ejecuta en cambios)
```

---

## Ubicación de archivos de test

Los tests viven junto al código que prueban:

```
src/
├── services/
│   ├── storage.ts
│   └── storage.test.ts     ← Test del servicio
├── stores/
│   ├── products.ts
│   ├── products.test.ts    ← Test del store
│   ├── sales.ts
│   └── sales.test.ts      ← Test del store
├── composables/
│   ├── useSearch.ts
│   └── useSearch.test.ts   ← Test del composable
```

Nombrado: `[archivo].test.ts` al lado del archivo que prueba.

---

## Qué probar

### Obligatorio probar (unit tests):

1. **Services** (storage, API calls): Todas las funciones CRUD
2. **Stores** (Pinia): Acciones, getters computados, efectos secundarios
3. **Composables**: Lógica reutilizable, transformaciones de datos
4. **Utilidades**: Funciones puras (formatters, parsers, validators)

### No probar (o probar con E2E):

- Templates/renderizado de componentes (salvo lógica compleja)
- Estilos CSS
- Configuración de Vue Router
- Integraciones con librerías externas (Dexie internals)

---

## Patrones

### Patrón base de un test

```typescript
import { describe, it, expect, beforeEach } from 'vitest'

describe('NombreDelModulo', () => {
  beforeEach(async () => {
    // Limpiar estado entre tests
  })

  it('describe el comportamiento esperado', () => {
    // Arrange
    // Act
    // Assert
  })
})
```

### Tests de servicios (IndexedDB)

```typescript
import { db } from './db'
import { saveProduct, getProductById } from './storage'

describe('Storage Service', () => {
  beforeEach(async () => {
    await db.products.clear()
    await db.sales.clear()
  })

  it('saves and retrieves a product', async () => {
    const product = makeProduct({ name: 'Coca Cola 600ml' })
    await saveProduct(product)

    const result = await getProductById(product.id)
    expect(result).toBeDefined()
    expect(result!.name).toBe('Coca Cola 600ml')
  })
})
```

### Tests de stores (Pinia)

```typescript
import { setActivePinia, createPinia } from 'pinia'
import { useProductsStore } from './products'
import { db } from '@/services/db'

describe('Products Store', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())  // Pinia fresco por test
    await db.products.clear()      // DB limpia por test
  })

  it('createProduct persists and updates store', async () => {
    const store = useProductsStore()
    const product = await store.createProduct({ name: 'Pan Bimbo', price: 45 })

    expect(store.products).toHaveLength(1)
    const fromDb = await db.products.get(product.id)
    expect(fromDb).toBeDefined()
  })
})
```

### Factory helpers

Crear funciones helper para generar datos de test:

```typescript
function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: crypto.randomUUID(),
    name: 'Producto Test',
    price: 10.00,
    unit: 'pieza',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}
```

---

## Reglas

### 1. Cada test es independiente

- No depender del orden de ejecución
- Limpiar DB y stores en `beforeEach`
- No compartir estado mutable entre tests

### 2. Probar comportamiento, no implementación

```typescript
// ✅ Prueba el resultado
it('deactivateProduct changes isActive to false', async () => {
  const store = useProductsStore()
  const product = await store.createProduct({ name: 'Test', price: 10 })
  await store.deactivateProduct(product.id)
  expect(store.products[0]!.isActive).toBe(false)
})

// ❌ Prueba cómo lo hace internamente
it('deactivateProduct calls saveProduct with updated object', async () => {
  // Demasiado acoplado a la implementación
})
```

### 3. Cubrir edge cases

- ¿Qué pasa si el ID no existe?
- ¿Qué pasa con contenido vacío?
- ¿Qué pasa con caracteres especiales?
- ¿Qué pasa si se llama dos veces rápido?

### 4. Un assert por concepto (no por línea)

```typescript
// ✅ Múltiples expects sobre el mismo concepto
it('creates a product with correct defaults', async () => {
  const product = await store.createProduct({ name: 'Café', price: 25 })
  expect(product.name).toBe('Café')
  expect(product.price).toBe(25)
  expect(product.isActive).toBe(true)
  expect(product.unit).toBe('pieza')
})
```

### 5. Naming descriptivo

Formato: `it('[acción] [resultado esperado]')` o `it('[condición] [comportamiento]')`

```typescript
it('returns undefined for non-existent product')
it('creates product with the specified category')
it('does not re-seed if data already exists')
it('clears cart when a sale is completed')
```

---

## Pitfalls comunes en este proyecto

### Vue Reactive Proxies + IndexedDB

IndexedDB no puede clonar objetos reactivos de Vue. Siempre usar `toRaw()` + `structuredClone()` antes de escribir a la DB:

```typescript
import { toRaw } from 'vue'

const plain = structuredClone(toRaw(reactiveObject))
await storage.saveNote(plain)
```

### Timestamps en tests

Si dos operaciones ocurren en el mismo milisegundo, los timestamps serán iguales.
Para tests que verifican "updatedAt cambió", agregar un `await new Promise(r => setTimeout(r, 5))` entre operaciones.

### fake-indexeddb es síncrono internamente

Las operaciones de `fake-indexeddb` no simulan latencia real. Los tests corren
más rápido pero no detectarán race conditions. Para eso usar E2E.

---

## Cuándo agregar tests

1. **Al crear un nuevo service o store**: Tests desde el primer commit
2. **Al reportar un bug**: Escribir test que reproduzca el bug ANTES de fixearlo
3. **Al modificar lógica de negocio**: Verificar que los tests existentes pasan, agregar nuevos si el comportamiento cambió
4. **No es necesario**: Para componentes puramente visuales o configuración
