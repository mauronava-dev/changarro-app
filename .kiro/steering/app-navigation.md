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
│  Toolbar superior                                       │
│  [☰ Menú] [Changarro] [🌙/☀️ Tema] [⚙ Ajustes]         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   Área principal                         │
│                                                         │
│   VISTA VENTAS (punto de venta)                         │
│   ó                                                     │
│   VISTA PRODUCTOS (catálogo)                            │
│   ó                                                     │
│   VISTA HISTORIAL (resumen de ventas)                   │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Navegación inferior (tabs)                             │
│  [🛒 Vender] [📦 Productos] [📊 Historial]              │
└─────────────────────────────────────────────────────────┘
```

---

## Navegación principal

### Tab Bar inferior (mobile-first)
- 3 tabs principales: Vender, Productos, Historial
- Siempre visible en todas las vistas principales
- Tab activo con indicador visual (color primario + ícono filled)
- Iconos de Material Symbols Outlined

### En desktop (> 768px)
- La tab bar se convierte en sidebar lateral izquierdo o se mantiene como bottom nav
- Los elementos se reorganizan aprovechando el espacio horizontal

---

## Vistas principales

### Vista Vender (Punto de venta)

La vista principal y más frecuente. Permite registrar una venta rápidamente.

**Contenido:**
- Barra de búsqueda rápida de productos (por nombre)
- Grid/lista de productos frecuentes o todos los productos activos
- Carrito de venta actual (items seleccionados)
- Botón de cobrar / finalizar venta

**Flujo de venta:**
1. El comerciante busca o selecciona productos del catálogo
2. Ajusta cantidades si es necesario
3. Ve el total en tiempo real
4. Selecciona método de pago
5. Confirma la venta → se guarda en historial

**Cada producto en el grid muestra:**
- Nombre del producto
- Precio unitario
- Botón rápido para agregar al carrito (+)

**Carrito (panel lateral o inferior):**
- Lista de items agregados
- Cantidad editable por item
- Subtotal por item
- Total general
- Botón eliminar item
- Botón vaciar carrito
- Botón cobrar (prominente)

### Vista Productos (Catálogo)

Gestión del catálogo de productos del negocio.

**Contenido:**
- Lista/grid de todos los productos
- Barra de búsqueda por nombre
- Filtro por categoría (opcional)
- Botón agregar nuevo producto (+)

**Cada producto muestra:**
- Nombre
- Precio de venta
- Categoría (si tiene)
- Unidad de medida
- Estado (activo/inactivo)

**Acciones por producto:**
- Editar (precio, nombre, categoría)
- Desactivar/activar (no eliminar, para mantener historial)
- Eliminar (solo si nunca se ha vendido)

**Formulario de producto:**
- Nombre (obligatorio)
- Precio de venta (obligatorio)
- Costo de compra (opcional, para calcular ganancia)
- Categoría (opcional, selector o texto libre)
- Unidad de medida (selector: pieza, kg, litro, paquete, etc.)

### Vista Historial (Resumen de ventas)

Consulta de ventas pasadas y resúmenes.

**Contenido:**
- Resumen del día actual (total vendido, número de ventas)
- Lista de ventas del día (más recientes primero)
- Filtro por rango de fechas
- Resumen semanal/mensual (cards con totales)

**Cada venta en la lista muestra:**
- Hora de la venta
- Número de productos
- Total cobrado
- Método de pago
- Expandible para ver detalle de items

**Resumen muestra:**
- Total vendido (día/semana/mes)
- Número de transacciones
- Ticket promedio
- Producto más vendido (si hay datos suficientes)

---

## Toolbar superior

### Contenido
- Botón menú (hamburguesa) — opciones adicionales
- Título/logo "Changarro"
- Toggle tema (sol/luna)
- Botón ajustes (engrane)

### Menú desplegable (hamburguesa)
- Exportar datos
- Acerca de
- (Futuro: Sincronizar, Backup)

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

| Acción | Método |
|--------|--------|
| Agregar producto al carrito | Tap en producto / botón + |
| Cambiar cantidad en carrito | Tap en cantidad → editar |
| Eliminar item del carrito | Swipe o botón eliminar |
| Buscar producto | Tap en barra de búsqueda, escribir |
| Cobrar venta | Botón cobrar prominente |
| Crear producto | Botón + en vista Productos |
| Ver detalle de venta | Tap en venta del historial |
| Cambiar tema | Toggle en toolbar |

---

## Rutas (Vue Router)

```
/                       → Vista Vender (punto de venta)
/products               → Vista Productos (catálogo)
/products/new           → Crear nuevo producto
/products/:id/edit      → Editar producto
/history                → Vista Historial
/history/:id            → Detalle de venta
/settings               → Ajustes
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
- `useSalesStore` — registro de ventas, consulta de historial, resúmenes
- `useSettingsStore` — preferencias del usuario (tema, moneda, nombre negocio)

---

## Temas (Light / Dark)

### Toggle en toolbar
- Icono sol/luna
- Persiste preferencia en localStorage
- Clase `dark` en `<html>` para activar variante Tailwind

### Comportamiento visual según tema
- Light: superficies glass con cristal esmerilado, texto gris oscuro
- Dark: superficies glass ahumado, bordes especulares, texto blanco
- Transición suave al cambiar de tema (200ms en background/color)

---

## Prioridad de implementación (fases)

### Fase 1 - POC funcional
1. Layout base (toolbar + tabs de navegación + área principal)
2. Vista productos: listar, crear, editar producto
3. Vista vender: seleccionar productos, carrito, cobrar
4. Almacenamiento en IndexedDB (productos y ventas)
5. Vista historial: lista de ventas del día
6. Toggle dark/light mode

### Fase 2 - Usabilidad
1. Búsqueda rápida de productos en punto de venta
2. Categorías de productos
3. Resúmenes de historial (día, semana, mes)
4. Cálculo de cambio en venta en efectivo
5. Confirmaciones y feedback visual (toasts)
6. Validaciones de formularios

### Fase 3 - Funcionalidad extendida
1. Exportar datos (CSV/JSON)
2. Producto más vendido y estadísticas básicas
3. Ajustes del negocio (nombre, moneda, unidades)
4. Desactivar/reactivar productos
5. Filtros avanzados en historial (por fecha, método de pago)

### Fase 4 - Polish y distribución
1. Animaciones y transiciones glass
2. Responsive completo (Android como prioridad)
3. Performance en dispositivos de gama baja
4. Build y distribución Android (APK)
5. Build Windows y macOS
