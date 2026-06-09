# agents.md — Reglas del proyecto

## Resumen del proyecto

- Aplicación **Todo App** con **React 19 + Vite 8 + Supabase**
- Sin TypeScript, sin tests, sin autenticación
- Estilos **CSS plano** con custom properties
- Iconos con **lucide-react**
- Single Page Application (sin router)

## Comandos de compilación y prueba

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo Vite |
| `npm run build` | Build de producción |
| `npm run preview` | Previsualizar build |
| `npm run lint` | ESLint (único comando de verificación disponible) |

No hay test suite configurada. Cuando se agregue, usar Vitest + React Testing Library.

## Directrices de estilo de código

- **ES Modules** con `import` / `export`
- **Orden de imports**: React/libs → proyecto → CSS
- **Componentes**: export default, PascalCase, destructuring props en firma
- **Variables/funciones**: camelCase, handlers con prefijo `handle`
- **Archivos**: PascalCase para componentes (`TodoForm.jsx`), camelCase para utilidades (`supabase.js`)
- **Clases CSS**: kebab-case
- **JSX**: `className`, eventos inline, condicionales con `&&` y ternarios
- **Formato**: single quotes, semicolons
- **CSS**: custom properties en `:root`, mobile-first con flexbox

## Instrucciones de prueba

- No hay tests aún. Verificar con `npm run lint`
- Cuando se implementen:
  - Usar **Vitest + React Testing Library** (ver skill `react`)
  - Pruebas orientadas a comportamiento de usuario
  - Preferir queries por rol/texto sobre `data-testid`

## Consideraciones de seguridad

- Cliente Supabase con **anon key** — público por diseño, la seguridad depende de RLS
- Sin autenticación implementada (operaciones sin filtro por usuario)
- Sin server-side code (todo en el navegador)
- Sin CSP configurado
- Sin `dangerouslySetInnerHTML` (sin riesgo XSS actual)
- Input sanitization con `.trim()`, queries parametrizadas vía Supabase

## Skills

Cargar el skill **react** para guía de desarrollo:

```
@skills react
```

El skill (`skills/react/SKILL.md`) cubre: componentes funcionales, hooks, manejo de estado, performance, testing con Vitest + RTL, formularios, y buenas prácticas generales.

## Context7

Usar **Context7 MCP** cuando se necesite documentación actualizada de librerías, APIs o paquetes. En particular, siempre que se agregue una nueva dependencia o librería al proyecto, invocar `context7` para obtener la documentación y guía de uso más reciente.
