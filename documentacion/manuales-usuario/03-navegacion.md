# Navegación

Este documento explica cómo moverte dentro de Changarro y acceder a cada sección
de la aplicación.

---

## La barra inferior (navegación principal)

En la parte inferior de la pantalla siempre verás tres pestañas. Son la forma
principal de moverte entre las secciones de Changarro:

| Pestaña     | Qué hace                                                   |
| ----------- | ---------------------------------------------------------- |
| **Inicio**  | Muestra tu catálogo de productos para agregar al carrito   |
| **Carrito** | Muestra los productos que vas a cobrar en la venta actual  |
| **Ventas**  | Muestra el historial de todas las ventas que has realizado |

La pestaña activa se resalta para que siempre sepas en qué sección estás.

---

## La barra superior

En la parte superior de la pantalla verás:

- El nombre **Changarro** (o el nombre de tu negocio)
- El total de la venta actual
- Un ícono de perfil que te lleva a los **Ajustes**

---

## Secciones de la aplicación

### Inicio (catálogo)

Es la pantalla principal. Aquí ves todos los productos que has registrado.

- **Buscar**: usa la barra de búsqueda para encontrar un producto por nombre (funciona aunque no escribas los acentos)
- **Cambiar vista**: puedes alternar entre vista de lista y vista de cuadrícula
- **Agregar al carrito**: toca un producto y se agrega automáticamente
- **Venta rápida**: toca el botón **+** (abajo a la derecha) para agregar un producto personalizado sin registrarlo en el catálogo

### Carrito

Aquí ves todo lo que llevas en la venta actual.

- **Ajustar cantidades**: usa los botones **+** y **-** junto a cada producto
- **Eliminar un producto**: toca el botón de eliminar y confirma en la ventana que aparece
- **Ver totales**: el subtotal, IVA (si está activo) y total se calculan automáticamente
- **Cobrar**: toca el botón **Cobrar** para ir a la pantalla de Cobro (Checkout) e ingresar el pago.

### Cobro (Checkout)

Se accede desde el botón **Cobrar** en la pantalla del Carrito. Es una interfaz ágil para recibir el dinero y calcular el cambio rápidamente.

- **Monto recibido**: campo para ingresar el dinero que te entrega el cliente.
- **Botones de ajuste rápido (`-1` y `+1`)**: suma o resta un peso de forma rápida y cómoda sin tener que abrir el teclado.
- **Sugerencias de pago**: botones para seleccionar cantidades predefinidas (como $50, $100, $200, $500, o el pago exacto) basadas en tu total.
- **Cálculo de cambio**: se muestra en tiempo real el cambio a devolver (en verde) o la cantidad restante en caso de ser insuficiente (en rojo).
- **Cobro seguro**: el botón de cobrar cuenta con un contador regresivo de 3 segundos antes de habilitarse para evitar confirmaciones accidentales. Al finalizar la venta, se muestra una animación festiva de fuegos artificiales verdes y el sistema te regresa inmediatamente a la pantalla de **Inicio** para atender al siguiente cliente.

### Ventas (historial)

Aquí aparecen todas las ventas que has realizado, ordenadas de la más reciente
a la más antigua.

- **Ver detalle**: toca cualquier venta para ver exactamente qué productos vendiste, en qué cantidad, y el total con su desglose

### Ajustes

Se accede desde el ícono de perfil en la barra superior (no desde la barra
inferior).

Aquí puedes:

- Cambiar el nombre de tu negocio
- Configurar la moneda
- Activar o desactivar el cálculo de IVA
- Acceder al **Inventario** para gestionar tus productos
- **Respaldar datos (Exportar)**: descarga una copia de seguridad en un archivo `.json` que contiene tu catálogo de productos (incluyendo imágenes), tus ventas completadas y la configuración del negocio.
- **Restaurar respaldo (Importar)**: selecciona un archivo de respaldo `.json` para combinarlo con tus datos actuales. Los registros del archivo se agregarán o actualizarán de forma segura sin borrar tu inventario o historial actual.

### Inventario

Se accede desde Ajustes. Aquí gestionas tu catálogo completo de productos.

- **Buscar productos**: usa la barra de búsqueda
- **Agregar producto**: toca el botón **+** para crear uno nuevo
- **Editar producto**: toca un producto existente para modificar sus datos
- **Eliminar producto**: usa el botón de eliminar y confirma

### Venta rápida

Se accede desde el botón **+** en la pantalla de Inicio. Te permite agregar un
producto o servicio personalizado al carrito sin necesidad de registrarlo
permanentemente en tu inventario.

Llena el nombre, precio y categoría, y al tocar **Agregar al Carrito** se
agregará y la aplicación te llevará directamente al carrito.

---

## Resumen de navegación

```
Barra inferior:
  Inicio ─── Carrito ─── Ventas

Barra superior:
  Ajustes (ícono de perfil)
    └── Inventario
          ├── Nuevo Producto
          └── Editar Producto

Inicio:
  └── Venta Rápida (botón +)

Carrito:
  └── Cobro / Checkout (botón Cobrar)

Ventas:
  └── Detalle de Venta (al tocar una venta)
```

---

## Siguientes pasos

- [Volver a primeros pasos](./02-primeros-pasos.md)
- [Volver al índice](./README.md)
