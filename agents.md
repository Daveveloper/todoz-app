# AGENTS.md — Reglas del proyecto

## Resumen del proyecto

- Aplicación **Todo App** con **React 19 + Vite 8 + Supabase + React Router v7 (SPA)**
- Sin TypeScript, sin tests
- **Autenticación**: Supabase Auth (email/password, login único sin registro)
- **Estado global**: Zustand (authStore + todoStore)
- **Estilos**: CSS plano con custom properties
- **Iconos**: lucide-react
- **Routing**: React Router v7 con `createBrowserRouter` + `RouterProvider`
- **Layout**: Dashboard con sidebar oscuro fijo + main content

## Stack

| Paquete | Versión | Uso |
|---------|---------|-----|
| react | ^19.2.6 | UI |
| react-dom | ^19.2.6 | DOM rendering |
| react-router | ^7.17.0 | Routing SPA |
| @supabase/supabase-js | ^2.108.0 | Backend + Auth |
| zustand | ^5.0.14 | Estado global |
| lucide-react | ^1.17.0 | Iconos |
| vite | ^8.0.12 | Bundler |

**Supabase project ID**: `tgymclrqpboywfnxelry`

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo Vite |
| `npm run build` | Build de producción |
| `npm run preview` | Previsualizar build |
| `npm run lint` | ESLint (única verización disponible) |

No hay test suite configurada. Cuando se agregue, usar Vitest + React Testing Library.

## Estructura del proyecto

```
src/
├── main.jsx                   # Entry point, monta <App />
├── App.jsx                    # Layout raíz: auth check → LoginForm o Dashboard
├── App.css                    # Dashboard layout, task-panel, botones, modal, todo list
├── index.css                  # Reset, custom properties, estilos base
├── components/
│   ├── LoginForm.jsx          # Formulario de login (email + password)
│   ├── LoginForm.css          # Estilos login (card centrada)
│   ├── Sidebar.jsx            # Sidebar (logo + New Task + Sign Out)
│   ├── Sidebar.css            # Estilos sidebar oscuro
│   ├── TodoForm.jsx           # Formulario de tarea (nuevo/editar, modo panel con onClose)
│   ├── TodoList.jsx           # Lista con filtros (All / Pending / In Progress / Completed)
│   ├── TodoItem.jsx           # Item individual con toggle status + edit + delete
│   ├── ConfirmModal.jsx       # Modal de confirmación para borrar
│   └── icons.jsx              # Barrel export de lucide-react
├── store/
│   ├── authStore.js           # useAuthStore: user, session, signIn, signOut, checkSession
│   └── todoStore.js           # useTodoStore: CRUD tareas, filtros, editingId, deleteTarget
└── lib/
    └── supabase.js            # Cliente Supabase (URL + anon key)
skills/
├── react/SKILL.md             # Desarrollo React general
└── react-router/SKILL.md      # Routing con React Router v7
```

## Routing

La app usa **React Router v7** en modo SPA. Ver el skill `react-router` para guía detallada.

### Configuración actual

Actualmente la app **no usa routing** porque es una sola pantalla (login → dashboard). Pero `react-router` está instalado para cuando se necesiten múltiples rutas. El patrón a seguir es:

```jsx
import { createBrowserRouter, RouterProvider } from 'react-router'
import { RouterProvider as DomRouterProvider } from 'react-router/dom'

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: RootErrorBoundary,
    children: [
      { index: true, Component: HomePage },
      { path: 'projects', Component: ProjectsPage, lazy: () => import('./pages/Projects') },
    ],
  },
])

export default function App() {
  return <DomRouterProvider router={router} fallbackElement={<p>Loading...</p>} />
}
```

### Layout routes

```jsx
import { Outlet, NavLink } from 'react-router'

export default function RootLayout() {
  return (
    <div className="dashboard">
      <nav><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></nav>
      <main><Outlet /></main>
    </div>
  )
}
```

### Guards de autenticación

```jsx
import { Navigate, Outlet } from 'react-router'
import useAuthStore from '../store/authStore'

export default function ProtectedRoute() {
  const user = useAuthStore(state => state.user)
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}
```

## Autenticación

Usa **Supabase Auth** con email/password. No hay registro — el usuario se crea manualmente en Supabase Dashboard.

### authStore

```js
import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useAuthStore = create((set) => ({
  user: null, session: null, loading: true, error: null,
  checkSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    set({ user: session?.user ?? null, session, loading: false })
  },
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return set({ error: error.message, loading: false })
    set({ user: data.user, session: data.session, loading: false })
  },
  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null, loading: false })
  },
  clearError: () => set({ error: null }),
}))
```

### Flujo en App.jsx

1. `useEffect` → `checkSession()` al montar
2. Si `authLoading` → pantalla de carga
3. Si `!user` → `<LoginForm />`
4. Si `user` → dashboard con Sidebar + main content

```jsx
const [showForm, setShowForm] = useState(false)
const formVisible = showForm || !!editingId

// Sidebar llama a onNewTask → setShowForm(true)
// TodoForm usa key={editingId ?? 'new'} para remount limpio
```

## Estado global (Zustand)

### authStore (`src/store/authStore.js`)

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| user | object \| null | Usuario autenticado |
| session | object \| null | Sesión de Supabase |
| loading | boolean | Cargando estado auth |
| error | string \| null | Error de auth |
| checkSession() | async | Obtiene sesión actual |
| signIn(email, pass) | async | Login email/password |
| signOut() | async | Logout |
| clearError() | fn | Limpia error |

### todoStore (`src/store/todoStore.js`)

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| todos | array | Lista de tareas |
| filter | string | Filtro activo (all/pending/in-progress/completed) |
| editingId | uuid \| null | Tarea en edición |
| deleteTarget | object \| null | Tarea a borrar (activa modal) |
| loading | boolean | Cargando datos |
| error | string \| null | Error de BD |
| loadTodos() | async | SELECT * FROM todos |
| addTodo(text, desc) | async | INSERT |
| updateTodo(id, text, desc) | async | UPDATE + editingId = null |
| deleteTodo() | async | DELETE (usa deleteTarget) |
| toggleStatus(id) | async | pending → in-progress → completed → pending |

## Estilos

### CSS plano con custom properties (`src/index.css`)

```css
:root {
  --black: #000000;  --white: #ffffff;
  --gray-100: #f5f5f5;  --gray-200: #e5e5e5;
  --gray-300: #d4d4d4;  --gray-400: #a3a3a3;  --gray-500: #737373;
  --red: #dc2626;  --red-bg: #fef2f2;
}
```

### Layout dashboard

```css
.dashboard { display: flex; min-height: 100svh; width: 100%; }
.sidebar { width: 240px; background: var(--black); padding: 32px 16px; }
.main { flex: 1; padding: 48px; max-width: 720px; }
```

### Componentes con estilo propio

- `App.css` — layout dashboard, task-panel (borde redondeado), botones (.btn, .btn-add, .btn-cancel), TodoList, TodoItem, modal
- `Sidebar.css` — sidebar oscuro con hover effects
- `LoginForm.css` — login centrado con card, background #fafafa
- `index.css` — reset, custom properties, estilos base (body, button, input)

### Convenciones CSS

- Clases en kebab-case
- Mobile-first con flexbox
- Sin frameworks CSS

## Buenas prácticas de código

- **ES Modules** con `import` / `export`
- **Orden de imports**: React/libs → proyecto → CSS
- **Componentes**: export default, PascalCase, destructuring props en firma
- **Variables/funciones**: camelCase, handlers con prefijo `handle`
- **Archivos**: PascalCase para componentes (`TodoForm.jsx`), camelCase para utilidades (`supabase.js`)
- **JSX**: `className`, eventos inline, condicionales con `&&` y ternarios
- **Formato**: single quotes, semicolons
- **Sin TypeScript** — todo en JSX plano

## Configuración de herramientas

### ESLint (`eslint.config.js`)

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [js.configs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: { globals: globals.browser, parserOptions: { ecmaFeatures: { jsx: true } } },
  },
])
```

### Vite (`vite.config.js`)

```js
export default defineConfig({ plugins: [react()] })
```

### opencode.json

```json
{
  "mcp": {
    "supabase": { "type": "remote", "url": "https://mcp.supabase.com/mcp", "oauth": {} },
    "context7": { "type": "remote", "url": "https://mcp.context7.com/mcp" }
  }
}
```

## Skills

Cargar los skills según la tarea:

```
@skills react             → Desarrollo React general (componentes, hooks, estado, performance, testing)
@skills react-router      → Routing con React Router v7 (rutas, guards, lazy loading, error boundaries, testing)
@skills skill-creator   → Crear, modificar o evaluar un skill
@skills customize-opencode → Configurar opencode (opencode.json, .opencode/, permisos, MCPs)
```

### Cuándo invocar cada skill

- **react**: siempre que se trabaje en componentes React, hooks, manejo de estado, optimización de renders, formularios, o testing con Vitest + RTL
- **react-router**: al agregar nuevas rutas, implementar guards de auth, lazy loading de páginas, manejo de search params, o error boundaries por ruta
- **skill-creator**: al crear un nuevo skill desde cero, modificar uno existente, o ejecutar evaluaciones/benchmarks
- **customize-opencode**: solo al configurar el comportamiento de opencode (no para código de la app)

## Context7

Usar **Context7 MCP** cuando se necesite documentación actualizada de librerías, APIs o paquetes. En particular, siempre que se agregue una nueva dependencia o librería al proyecto, invocar `context7` para obtener la documentación y guía de uso más reciente.

## Consideraciones de seguridad

- Cliente Supabase con **anon key** — pública por diseño, la seguridad depende de RLS
- RLS deshabilitado en `public.todos` — cualquiera con la anon key puede leer/escribir
- Sin autenticación por usuario (todos comparten la misma BD)
- Sin server-side code (todo en el navegador)
- Sin CSP configurado
- Sin `dangerouslySetInnerHTML` (sin riesgo XSS actual)
- Input sanitization con `.trim()`, queries parametrizadas vía Supabase
