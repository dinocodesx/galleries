---
name: Lumina Photo Manager
colors:
  surface: '#111317'
  surface-dim: '#111317'
  surface-bright: '#37393e'
  surface-container-lowest: '#0c0e12'
  surface-container-low: '#1a1c20'
  surface-container: '#1e2024'
  surface-container-high: '#282a2e'
  surface-container-highest: '#333539'
  on-surface: '#e2e2e8'
  on-surface-variant: '#c3c6d1'
  inverse-surface: '#e2e2e8'
  inverse-on-surface: '#2f3035'
  outline: '#8d919b'
  outline-variant: '#424750'
  surface-tint: '#a8c8ff'
  primary: '#b5cfff'
  on-primary: '#003061'
  primary-container: '#8ab4f8'
  on-primary-container: '#0d4582'
  inverse-primary: '#315f9d'
  secondary: '#a7cbe3'
  on-secondary: '#0a3447'
  secondary-container: '#294d61'
  on-secondary-container: '#99bdd4'
  tertiary: '#fbc65e'
  on-tertiary: '#412d00'
  tertiary-container: '#ddab46'
  on-tertiary-container: '#5b4000'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a8c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#114784'
  secondary-fixed: '#c3e7ff'
  secondary-fixed-dim: '#a7cbe3'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#264b5e'
  tertiary-fixed: '#ffdea6'
  tertiary-fixed-dim: '#f3be57'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5d4200'
  background: '#111317'
  on-background: '#e2e2e8'
  surface-variant: '#333539'
typography:
  display-lg:
    fontFamily: Roboto Flex
    fontSize: 57px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: Roboto Flex
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  headline-md:
    fontFamily: Roboto Flex
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
  title-lg:
    fontFamily: Roboto Flex
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
  title-md:
    fontFamily: Roboto Flex
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0.15px
  body-lg:
    fontFamily: Roboto Flex
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.5px
  body-md:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.25px
  label-lg:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.1px
  label-sm:
    fontFamily: Roboto Flex
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 12px
  margin-desktop: 24px
  max-content-width: 1600px
---

## Brand & Style

The design system is anchored in the concept of "Digital Preservation." It prioritizes an immersive, cinematic experience where the interface recedes to let the user's imagery take center stage. The brand personality is professional yet accessible, echoing the efficiency of a utility with the soul of a gallery.

The style is a refined implementation of **Minimalist Material Design 3**, optimized for high-density desktop workflows. It utilizes deep blacks and subtle grays to minimize eye strain and maximize the perceived vibrancy of photography. The user interface evokes a sense of calm organization through generous whitespace (negative space), intentional alignment, and fluid transitions that mimic the physical act of sorting through prints.

## Colors

The palette is strictly dark-mode, designed to create a "black box" environment that eliminates visual noise. 

- **Backgrounds:** Deep charcoal (#121212) serves as the base canvas, providing maximum contrast for photo thumbnails.
- **Surfaces:** Slate gray (#1F1F1F) defines interactive containers, sidebars, and top navigation bars, creating a clear hierarchy without relying on harsh lines.
- **Primary Action:** Google Blue (#8AB4F8) is reserved for high-priority calls to action, active states, and selection indicators. 
- **Typography:** Off-white (#E3E3E3) is used for readability, while secondary text uses a muted gray (#ADADAD) to maintain visual hierarchy.

## Typography

This design system uses **Roboto Flex** for its mechanical precision and extreme adaptability. As a variable font, it allows for subtle weight adjustments to ensure legibility against dark backgrounds. 

The type scale follows Material 3 logic, emphasizing a clear distinction between "Display" types (used for date headers in the photo grid) and "Label" types (used for metadata and navigation). Headings are kept clean with no serifs to maintain the minimalist aesthetic. All text should utilize `antialiased` rendering to ensure the thin weights of the variable font remain crisp on high-resolution displays.

## Layout & Spacing

The layout utilizes a **Fluid Grid** system designed for high-resolution desktop displays. 

- **The Photo Grid:** Uses a "Masonry-lite" approach or a strictly justified row layout. The spacing between images (gutter) is set to a tight 12px to maximize the immersive feel, while the outer page margins are a wider 24px to provide breathing room.
- **Navigation:** A fixed-width left navigation rail (80px collapsed, 256px expanded) provides consistent access to core views (Photos, Explore, Sharing, Library).
- **Responsive Behavior:** 
  - **Desktop (1200px+):** 12-column grid for settings/content; fluid layout for the photo gallery.
  - **Tablet (768px - 1199px):** Navigation rail collapses to icons only; margins reduce to 16px.
  - **Mobile:** Not the primary focus, but follows a 4-column structure with bottom navigation.

## Elevation & Depth

This design system eschews traditional heavy shadows in favor of **Tonal Layers** and **Subtle Elevations**. Depth is communicated through color luminance rather than drop shadows.

- **Level 0 (Base):** #121212 - The primary background for the photo grid.
- **Level 1 (Surface):** #1F1F1F - Navigation bars, sidebars, and cards.
- **Level 2 (Hover/Overlay):** A slight lightening of the surface via a 5% white overlay or a subtle 1px border (#333333).
- **Modals & Dialogs:** Use the highest elevation with a soft, 20% opacity black shadow (0px 8px 24px) and a backdrop blur (12px) to maintain context while focusing the user.

## Shapes

The shape language is modern and approachable, utilizing a **Rounded** (Level 2) logic. 

- **Small Components:** Checkboxes and small buttons use a 0.5rem (8px) radius.
- **Cards & Photos:** Photo thumbnails use a 1rem (16px) radius to soften the grid's appearance.
- **Large Elements:** Search bars and dialogs utilize a 1.5rem (24px) radius, leaning towards a pill-shape for high-frequency interaction points.
- **Selection State:** Selected photos are indicated by a thick 4px border in Primary Blue and a slight scale-down effect (95%) to create a physical "pressed" feel.

## Components

- **Buttons:** Primary buttons are filled with Google Blue (#8AB4F8) and use dark text for contrast. Secondary buttons are outlined or tonal (gray background).
- **Chips:** Used for filtering (e.g., "Favorites," "Videos," "Selfies"). They feature a 1px border in the inactive state and a light-blue tonal fill when active.
- **Search Bar:** A prominent, pill-shaped surface (#1F1F1F) at the top of the interface. It should feel integrated into the background, becoming more defined on focus.
- **Photo Thumbnails:** The hero of the app. Images must fill their containers (`object-fit: cover`). On hover, a subtle gradient overlay appears at the bottom to provide legibility for dates or locations.
- **Floating Action Button (FAB):** Following Material 3, a large, rounded-square FAB (#C2E7FF) is used for "Upload" or "Add to Album" actions, positioned in the bottom right.
- **Navigation Rail:** Vertical orientation on the left. Active states use a "pill" indicator behind the icon, consistent with Android 13/14 styling.