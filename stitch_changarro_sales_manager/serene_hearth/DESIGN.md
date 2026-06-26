---
name: Serene Hearth
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#20201f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c7c5cc'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#919096'
  outline-variant: '#46464c'
  surface-tint: '#c5c5d8'
  primary: '#ffffff'
  on-primary: '#2e2f3e'
  primary-container: '#e1e1f5'
  on-primary-container: '#626374'
  inverse-primary: '#5c5d6e'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#ffffff'
  on-tertiary: '#2d2f41'
  tertiary-container: '#e1e0f9'
  on-tertiary-container: '#626377'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e1f5'
  primary-fixed-dim: '#c5c5d8'
  on-primary-fixed: '#191b29'
  on-primary-fixed-variant: '#444655'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e1e0f9'
  tertiary-fixed-dim: '#c4c5dc'
  on-tertiary-fixed: '#181a2c'
  on-tertiary-fixed-variant: '#444559'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353535'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  body-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-margin: 32px
  gutter: 24px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system moves away from aggressive aesthetics toward a "Cozy Tech" philosophy. It is designed to feel welcoming, calm, and tactile, specifically optimized for high legibility and ease of use for senior users. The brand personality is dependable and gentle, evoking the feeling of a well-lit, quiet study.

The style is a hybrid of **Soft Minimalism** and **Tactile Glassmorphism**. It replaces harsh digital edges with organic, pill-shaped forms and replaces high-contrast black with deep, warm tones. A subtle film grain texture is applied across all major surfaces to provide a physical, paper-like quality that reduces digital eye strain and makes the UI feel more grounded.

## Colors

The palette is centered on a "Deep Hearth" theme. The primary background uses a warm, dark grey (#1A1A1A) to provide a softer foundation than pure black, reducing glare for aging eyes. 

- **Primary (Lavender):** Used for primary actions, active states, and focus indicators. Its pastel nature ensures it doesn't vibrate against the dark background.
- **Secondary (Bone White):** Reserved for primary text and high-importance icons, providing a soft but clear contrast.
- **Surface Tints:** Use slight variations of the neutral grey with increased lightness for cards and containers to create a sense of layering.

## Typography

This design system prioritizes extreme legibility. **Atkinson Hyperlegible Next** is used for all body text to ensure characters are distinct and readable for users with visual impairments. **Plus Jakarta Sans** provides a friendly, rounded counterpoint for headlines.

Font sizes are intentionally scaled 15-20% larger than standard web defaults. Line heights are generous to prevent "crowding" of text, which is essential for senior readability. All labels use increased letter spacing and semi-bold weights to remain legible at smaller scales.

## Layout & Spacing

The layout follows a **Fluid Grid** with exaggerated safe areas. Spacing is governed by an 8px rhythmic scale, but with a "generous" bias—padding within components should always lean toward the larger end of the scale to provide a high "tap target" area for accessibility.

- **Desktop:** 12-column grid, 32px margins, 24px gutters.
- **Mobile:** 4-column grid, 24px margins, 16px gutters.
- **Touch Targets:** No interactive element (button, link, input) should be smaller than 48px in height.

## Elevation & Depth

In this design system, depth is communicated through **Soft Tonal Layering** and **Ambient Shadows**. Instead of hard brutalist shadows, we use highly diffused, low-opacity shadows with a slight lavender tint (#E6E6FA at 5-10% opacity) to make elements appear to float gently above the surface.

To enhance the "cozy" feel, a subtle 3% opacity noise/grain texture is overlaid on all container surfaces. This breaks up the flat digital color and provides a tactile, material quality. Interactive elements use a subtle inner glow on hover to simulate a physical button being illuminated.

## Shapes

The shape language is defined by extreme roundness. There are no sharp corners in this design system. All containers, buttons, and input fields use large radii to evoke a sense of safety and approachability. 

- **Primary Elements:** Pill-shaped (rounded-full) for buttons and tags.
- **Secondary Elements:** 24px minimum radius for cards and modal sheets.
- **Icons:** Use a "rounded" or "soft" icon set to match the typeface and corner radii.

## Components

### Buttons
Buttons are large, pill-shaped, and use the Primary Lavender color for the background. Text is the Neutral Dark Grey for maximum contrast within the button. Shadows are soft and spread wide (0px 8px 24px rgba(0,0,0, 0.2)).

### Cards
Cards use a slightly lighter version of the background grey with a 1px soft border in Lavender at 10% opacity. They feature a subtle grain texture and 24px corner radii.

### Input Fields
Inputs are large (56px height minimum) with thick 2px borders when focused. The focus state uses a soft lavender glow rather than a sharp line. Placeholder text is rendered in Bone White at 60% opacity to ensure it's still readable.

### Lists & Navigation
List items feature generous vertical padding (20px+) to prevent accidental taps. Active navigation states are indicated by a pill-shaped "blob" behind the icon or text, rather than a simple underline.

### Toggles & Controls
Switches and checkboxes are oversized. The "thumb" of a toggle should feel "squishy" and tactile, using soft gradients to imply a physical 3D form.