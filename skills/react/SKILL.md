---
name: react
description: Desarrollo de React con buenas prácticas, manejo de estado, performance y UI moderno
license: MIT
compatibility: opencode
metadata:
  framework: react
  audience: developers
---

## ¿Qué hace este skill?

Guía el desarrollo React con estándares modernos: componentes funcionales, hooks, estado predecible, optimización de rendimiento e interfaces de usuario accesibles y responsivas.

## Buenas prácticas generales

- Usa componentes funcionales con hooks — no clases.
- Mantén los componentes pequeños y con una sola responsabilidad.
- Sigue el principio DRY extrayendo lógica reusable en custom hooks.
- Nombra componentes en PascalCase, hooks con prefijo `use`, handlers con prefijo `handle`.
- Prefiere composición sobre herencia.

## Estructura de proyecto

- Agrupa por features o dominios, no por tipo técnico.
- Cada feature puede contener: componentes, hooks, servicios, estilos, tests.
- Coloca la lógica de negocio en servicios/hooks separados de los componentes de UI.

## Manejo de estado

- Usa estado local (`useState`) para UI state simple.
- Usa `useReducer` para lógica de estado compleja dentro de un componente.
- Para estado global, prefiere Zustand, Jotai o Context API según la escala.
- Evita prop drilling excesivo — usa composición o contexto.
- Mantén el estado lo más cerca posible de donde se necesita.

## Performance

- Usa `React.memo` solo cuando haya rerenders innecesarios medibles.
- Usa `useMemo` y `useCallback` con moderación — solo para cálculos costosos o referencias estables.
- Lazy load componentes pesados con `React.lazy` + `Suspense`.
- Virtualiza listas largas con `react-window` o `@tanstack/virtual`.
- Evita renders innecesarios: keys estables, evitar objetos/funciones inline en props.
- Usa `useId` para IDs accesibles en lugar de claves locales.

## Estilos y UI moderna

- Usa Tailwind CSS, CSS Modules o Styled Components — consistencia ante todo.
- Diseño responsive con mobile-first.
- Sistema de diseño consistente: tokens, colores, tipografía, espaciado.
- Accesibilidad (a11y): roles ARIA, navegación por teclado, contraste suficiente.
- Prefiere componentes de bibliotecas headless (Radix UI, Headless UI, Ark UI) sobre soluciones caseras.

## Data fetching

- Usa TanStack Query (React Query) o SWR para fetching y caché.
- Separa las capas de datos de los componentes de presentación.
- Maneja estados: loading, error, empty, success.
- Implementa optimistic updates para mejorar la UX.

## Testing

- Escribe tests con Vitest + React Testing Library.
- Prueba comportamiento del usuario, no implementación interna.
- Usa `data-testid` como último recurso — prefiere queries por rol/texto.
- Incluye tests unitarios, de integración y visuales (Storybook + Chromatic).

## Formularios

- Usa React Hook Form + Zod para validación.
- Maneja estados: submitting, disabled, errores por campo, errores globales.

## Bundling y herramienta

- Mantén Vite como bundler.
- ESLint + Prettier con configuración compartida.
- TypeScript estricto — evita `any`.
- Path alias (`@/`) para imports limpios.
