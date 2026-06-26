# UI/UX - Serene Hearth Design System (Bendito Código)

Este steering define los lineamientos visuales para Changarro siguiendo el
design system "Serene Hearth": una fusión de Soft Minimalism con Tactile Glassmorphism.
La filosofía es "Cozy Tech" — interfaces que se sienten cálidas, calmadas y táctiles.

---

## Principio fundamental

Crear interfaces que se sientan acogedoras y confiables, diseñadas para alta
legibilidad y facilidad de uso. Formas orgánicas pill-shaped, tonos cálidos
profundos, y una calidad material (textura de grano sutil) que reduce la fatiga
visual y hace la UI más tangible.

---

## Paleta de colores (Material Design 3 - Dark)

El diseño base es dark mode. La paleta usa un "Deep Hearth" theme con
gris cálido oscuro como base y lavender como acento primario.

### Tokens principales

| Token                       | Valor   | Uso                              |
| --------------------------- | ------- | -------------------------------- |
| `surface`                   | #131313 | Fondo base de la app             |
| `surface-container-lowest`  | #0e0e0e | Bottom nav                       |
| `surface-container-low`     | #1c1b1b | Inputs                           |
| `surface-container`         | #20201f | Cards, paneles                   |
| `surface-container-high`    | #2a2a2a | Elementos elevados               |
| `surface-container-highest` | #353535 | Controles (botones +/-)          |
| `on-surface`                | #e5e2e1 | Texto principal                  |
| `on-surface-variant`        | #c7c5cc | Texto secundario, labels         |
| `primary`                   | #ffffff | Texto de marca                   |
| `primary-container`         | #e1e1f5 | Botones primarios, chips activos |
| `on-primary-container`      | #626374 | Texto en botones primarios       |
| `primary-fixed-dim`         | #c5c5d8 | Precios, acentos, nombre marca   |
| `surface-tint`              | #c5c5d8 | Botón "Finalizar Venta", hovers  |
| `outline-variant`           | #46464c | Bordes de cards, separadores     |
| `error`                     | #ffb4ab | Botón eliminar, estados de error |

### Regla de color

- El fondo NUNCA es negro puro más allá del surface base #131313
- Los acentos son lavender pastel (no vibran contra el fondo oscuro)
- Profundidad se comunica con variaciones tonales del gris, no con sombras duras

---

## Tipografía

Prioridad absoluta: **legibilidad extrema**. Tamaños 15-20% más grandes que
estándar web. Line heights generosos para evitar "crowding" de texto.

### Pairing

- **Headlines**: Plus Jakarta Sans (friendly, rounded, impactante)
- **Body/Labels**: Atkinson Hyperlegible Next (legibilidad perfecta, caracteres distintos)
- **Iconos**: Material Symbols Outlined (wght 400, FILL 0, opsz 24)
- Importar desde Google Fonts

### Escala tipográfica

| Token              | Font                       | Size | Weight | Line Height | Letter Spacing |
| ------------------ | -------------------------- | ---- | ------ | ----------- | -------------- |
| headline-lg        | Plus Jakarta Sans          | 40px | 700    | 52px        | -0.02em        |
| headline-lg-mobile | Plus Jakarta Sans          | 32px | 700    | 40px        | -0.02em        |
| headline-md        | Plus Jakarta Sans          | 28px | 600    | 36px        | —              |
| body-lg            | Atkinson Hyperlegible Next | 20px | 400    | 32px        | —              |
| body-md            | Atkinson Hyperlegible Next | 18px | 400    | 28px        | —              |
| label-md           | Plus Jakarta Sans          | 16px | 600    | 20px        | 0.05em         |

### Labels

- Labels siempre UPPERCASE con tracking extendido (letter-spacing: 0.05em)
- Semi-bold (600) para legibilidad en tamaños pequeños

---

## Formas (Shapes)

El lenguaje de forma se define por **redondez extrema**. No hay esquinas
afiladas en este sistema.

| Elemento           | Radius        | Clase Tailwind      |
| ------------------ | ------------- | ------------------- |
| Botones primarios  | pill (9999px) | `rounded-full`      |
| Chips/tags         | pill          | `rounded-full`      |
| Inputs             | pill          | `rounded-full`      |
| Cards/contenedores | 16px (1rem)   | `rounded` (DEFAULT) |
| Cards elevadas     | 32px (2rem)   | `rounded-lg`        |
| Modales            | 48px (3rem)   | `rounded-xl`        |
| Thumbnails         | 16px          | `rounded`           |

---

## Spacing

Escala rítmica de 8px con sesgo generoso — siempre preferir el valor mayor
para garantizar touch targets amplios.

| Token              | Valor | Uso                                  |
| ------------------ | ----- | ------------------------------------ |
| `unit`             | 8px   | Base mínima                          |
| `stack-sm`         | 12px  | Separación entre elementos pequeños  |
| `stack-md`         | 24px  | Separación entre secciones           |
| `stack-lg`         | 48px  | Separación entre bloques principales |
| `gutter`           | 24px  | Espacio entre columnas               |
| `container-margin` | 32px  | Margen lateral (desktop)             |
| `margin-mobile`    | 20px  | Margen lateral (móvil)               |

### Touch targets

- Ningún elemento interactivo (botón, link, input) menor a **48px** de altura
- Inputs: mínimo 56px de altura
- Botones primarios: mínimo 56-64px de altura (py-5 o py-6)

---

## Elevación y profundidad

Profundidad via **Soft Tonal Layering** — NO sombras duras tipo brutalist.

### Sombras

```css
/* Sombra ambiental principal - difusa con tinte lavender */
.soft-shadow {
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}

/* Glow suave para estados activos/hover */
.soft-glow {
  box-shadow: 0 10px 40px -10px rgba(197, 197, 216, 0.15);
}

.soft-glow-active {
  box-shadow: 0 15px 45px -5px rgba(197, 197, 216, 0.3);
}
```

### Liquid Glass (uso limitado)

Solo para paneles flotantes tipo el total del carrito:

```css
.liquid-glass {
  backdrop-filter: blur(12px) saturate(120%);
  background: rgba(197, 197, 216, 0.08);
  border-top: 1px solid rgba(145, 144, 150, 0.2);
}
```

NO usar backdrop-filter en cards o contenedores regulares.

### Textura de grano (grain)

Una textura de ruido al 3% de opacidad sobre superficies principales para
calidad material. Rompe el color plano digital y da sensación de papel/tela.

---

## Componentes

### TopAppBar (Header fijo)

- Fijo arriba (`fixed top-0`)
- Altura: 64px (h-16)
- Fondo: `surface-container` con `backdrop-blur-lg`
- Borde inferior: `border-outline-variant`
- Contenido: Logo + nombre "Changarro" | Total actual + Avatar
- El total de venta actual se muestra como badge pill

### Bottom Navigation (Tab Bar)

- Fijo abajo (`fixed bottom-0`)
- Fondo: `surface-container-lowest/90` con `backdrop-blur-xl`
- Borde superior + sombra ascendente
- 4 tabs: Ventas, Inventario/Nueva, Carrito, Ajustes
- Tab activo: pill con `bg-primary-container text-on-primary-container`
- Tabs inactivos: `text-on-surface-variant`
- Icono filled para tab activo, outline para inactivos

### Botones

- Pill-shaped (`rounded-full`)
- Grandes (py-5 mínimo, full-width en móvil)
- Primario: `bg-primary-container text-on-primary-container`
- Hover: sutil `shadow-lg` + `scale-[1.02]`
- Active: `scale-95` (feedback táctil)
- Sombras suaves y amplias (0 8px 24px)

### Cards

- `bg-surface-container` con `border border-outline-variant`
- Border radius: 16px (`rounded` DEFAULT)
- Hover: `border-surface-tint`
- NO glass effect en cards regulares

### Inputs

- Altura mínima 56px
- `bg-surface-container-low border border-outline-variant rounded-full`
- Padding generoso: `px-6 py-4`
- Focus: `ring-2 ring-primary-fixed-dim border-transparent`
- Placeholder: `text-on-surface-variant/40`

### Chips de categoría

- Pill-shaped (`rounded-full`)
- Activo: `bg-primary-container text-on-primary-container border-primary-container`
- Inactivo: `border border-outline-variant text-on-surface-variant`
- Hover inactivo: `bg-surface-variant border-on-surface-variant`
- Padding: `px-6 py-2.5`

### Listas (items del carrito)

- `bg-surface-container border border-outline-variant rounded-lg`
- Padding generoso: `p-stack-md` (24px)
- Thumbnail: 80x80px (`w-20 h-20`)
- Controles cantidad: botones circulares 32px (`w-8 h-8 rounded-full`)
- Hover: `border-surface-tint` (highlight sutil)

---

## Navegación (4 tabs)

| Tab        | Icono                     | Label              | Ruta        |
| ---------- | ------------------------- | ------------------ | ----------- |
| Ventas     | `point_of_sale`           | Ventas             | `/`         |
| Inventario | `inventory_2` o `add_box` | Inventario / Nueva | `/products` |
| Carrito    | `shopping_cart`           | Carrito            | `/cart`     |
| Ajustes    | `settings`                | Ajustes            | `/settings` |

---

## Reglas de implementación para este proyecto

1. Dark mode es el diseño BASE — no hay light mode en el POC
2. Todos los colores se consumen vía tokens del design system, nunca hardcodeados
3. Tipografía: Plus Jakarta Sans para headlines/labels, Atkinson Hyperlegible Next para body
4. Touch targets mínimo 48px siempre
5. Inputs mínimo 56px de altura
6. Botones primarios pill-shaped y full-width en móvil
7. Cards con bordes sutiles (`outline-variant`), NO glassmorphism
8. Liquid glass SOLO en paneles flotantes (total del carrito)
9. TopAppBar fijo con logo + total de venta actual
10. Bottom nav con 4 tabs, pill activo
11. Iconografía: Material Symbols Outlined (wght 400, FILL 0, opsz 24; FILL 1 en tab activo)
12. Labels UPPERCASE con tracking extendido
13. Feedback táctil: `active:scale-95` en todos los botones y tabs
14. Sombras lavender-tinted, suaves y difusas
15. No usar sage green — la paleta es lavender/neutral warm
