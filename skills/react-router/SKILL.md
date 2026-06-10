---
name: react-router
description: Implementación de routing en React con React Router v7 (SPA). Crea rutas anidadas, lazy loading, guards de autenticación, manejo de errores y testing. Usar cada vez que el proyecto necesite navegación entre pantallas, proteccion de rutas, carga diferida por ruta o manejo de parámetros URL.
license: MIT
compatibility: opencode
metadata:
  framework: react
  library: react-router
---

## ¿Qué hace este skill?

Guía la implementación de routing en React usando React Router v7 en modo SPA (sin SSR). Cubre configuración, navegación, lazy loading, guards, búsqueda/filtros por URL, error boundaries y testing.

## Instalación

```bash
npm install react-router
```

React Router v7 incluye todo lo necesario — no hay un paquete separado para el DOM.

## Configuración inicial (SPA)

Usá `createBrowserRouter` con `RouterProvider`. Es el API recomendada para React Router v7, funciona igual en SPA y en modo framework.

```jsx
import { createBrowserRouter, RouterProvider } from 'react-router'
import { RouterProvider as RouterDomProvider } from 'react-router/dom'

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: RootErrorBoundary,
    children: [
      { index: true, Component: HomePage },
      { path: 'projects', Component: ProjectsPage },
      { path: 'projects/:id', Component: ProjectDetail },
    ],
  },
])

export default function App() {
  return <RouterDomProvider router={router} />
}
```

### Layout routes

Usá `<Outlet />` para renderizar rutas hijas dentro de un layout compartido (header, sidebar, footer).

```jsx
import { Outlet, NavLink } from 'react-router'

export default function RootLayout() {
  return (
    <div className="dashboard">
      <nav className="sidebar">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/projects">Projects</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
```

`end` en `<NavLink to="/" end>` evita que matchee todas las rutas.

## Lazy loading

Usá `lazy` en el objeto de ruta para cargar componentes y loaders bajo demanda. La función `lazy` se ejecuta solo cuando el usuario navega a esa ruta.

```jsx
createBrowserRouter([
  {
    path: '/dashboard',
    lazy: () => import('./pages/Dashboard'),
  },
  {
    path: '/settings',
    lazy: () => import('./pages/Settings'),
  },
])
```

Cada módulo debe exportar el componente como `Component` (default no funciona):

```jsx
// pages/Dashboard.jsx
export function Component() {
  return <div>Dashboard</div>
}
```

Combiná con `React.Suspense` para mostrar un fallback:

```jsx
<RouterDomProvider router={router} fallbackElement={<p>Loading...</p>} />
```

## Navegación

### Link y NavLink

```jsx
import { Link, NavLink } from 'react-router'

<Link to="/projects/new">New Project</Link>

<NavLink
  to="/projects"
  className={({ isActive }) => isActive ? 'nav-active' : ''}
>
  Projects
</NavLink>
```

### Navegación programática

```jsx
import { useNavigate } from 'react-router'

function LoginButton() {
  const navigate = useNavigate()

  async function handleLogin() {
    await login()
    navigate('/dashboard', { replace: true })
  }

  return <button onClick={handleLogin}>Sign In</button>
}
```

`replace: true` evita que el login quede en el historial.

## Parámetros de ruta y URL

### useParams — segmentos dinámicos

```jsx
import { useParams } from 'react-router'

export default function ProjectDetail() {
  const { id } = useParams()
  // /projects/42 → id = "42"
}
```

### useSearchParams — query strings (filtros, paginación)

```jsx
import { useSearchParams } from 'react-router'

export default function ProjectList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const status = searchParams.get('status') ?? 'all'
  const page = Number(searchParams.get('page') ?? '1')

  function setPage(next) {
    setSearchParams({ status, page: String(next) })
  }

  function toggleStatus(next) {
    setSearchParams({ status: next, page: '1' })
  }
}
```

`setSearchParams` hace merge con los params existentes y navega sin recargar.

## Manejo de errores

Cada ruta puede tener su propio `ErrorBoundary`. El error se propaga hacia arriba si no se define.

```jsx
createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: RootErrorBoundary,
    children: [
      { path: 'projects/:id', Component: ProjectDetail, ErrorBoundary: DetailErrorBoundary },
    ],
  },
])

function RootErrorBoundary({ error }) {
  const is404 = /* check if route error */ true
  return <h1>{is404 ? '404 — Not Found' : 'Something went wrong'}</h1>
}
```

React Router distingue errores de ruta no encontrada (404) de errores de renderizado. Usá `isRouteErrorResponse` para diferenciarlos:

```jsx
import { isRouteErrorResponse, useRouteError } from 'react-router'

export default function ErrorBoundary() {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    return <h1>{error.status} — {error.statusText}</h1>
  }
  return <h1>Unexpected error: {error.message}</h1>
}
```

## Guards de autenticación (rutas protegidas)

Creá un layout wrapper que verifique autenticación antes de renderizar `<Outlet />`. Esto evita el patrón de High-Order Components y es más declarativo.

```jsx
import { Navigate, Outlet } from 'react-router'
import useAuthStore from '../store/authStore'

export default function ProtectedRoute() {
  const user = useAuthStore(state => state.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
```

```jsx
createBrowserRouter([
  { path: '/login', Component: LoginPage },
  {
    path: '/app',
    Component: ProtectedRoute,  // chequea auth
    children: [
      { index: true, Component: Dashboard },
      { path: 'settings', Component: Settings },
    ],
  },
])
```

## Indicadores de navegación

Usá `useNavigation` para mostrar spinners globales mientras se carga una ruta con lazy loading o loaders:

```jsx
import { useNavigation } from 'react-router'

export default function RootLayout() {
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'

  return (
    <div>
      {isLoading && <div className="global-loader" />}
      <Outlet />
    </div>
  )
}
```

## Testing

Usá `createMemoryRouter` en los tests para evitar dependencia del navegador.

```jsx
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import userEvent from '@testing-library/user-event'

const routes = [
  {
    path: '/',
    Component: () => <div>Home</div>,
  },
  {
    path: '/about',
    Component: () => <div>About</div>,
  },
]

function renderRouter(initialEntries = ['/']) {
  const router = createMemoryRouter(routes, { initialEntries })
  return render(<RouterProvider router={router} />)
}

it('navega de home a about', async () => {
  renderRouter()
  await userEvent.click(screen.getByText(/about/i))
  expect(screen.getByText('About')).toBeInTheDocument()
})
```

```bash
npm install -D @testing-library/react @testing-library/user-event
```

## Estructura de archivos recomendada

Para proyectos SPA con varias pantallas, organizá las páginas por feature:

```
src/
├── routes.jsx             # configuración del router
├── layout/
│   ├── RootLayout.jsx     # layout principal con Outlet
│   └── ProtectedRoute.jsx # guard de autenticación
├── pages/
│   ├── Home/
│   │   ├── HomePage.jsx
│   │   └── HomePage.test.jsx
│   ├── Projects/
│   │   ├── ProjectList.jsx
│   │   ├── ProjectDetail.jsx
│   │   └── index.js       # barrel export
│   └── Login/
│       └── LoginPage.jsx
└── App.jsx                # monta RouterProvider
```

## Checklist de buenas prácticas

- [ ] Usar `createBrowserRouter` + `RouterProvider` (no `<BrowserRouter>`)
- [ ] Layout routes con `<Outlet />` para header/sidebar compartidos
- [ ] Lazy loading con `lazy` en el objeto de ruta
- [ ] `ErrorBoundary` por ruta, al menos uno global
- [ ] `isRouteErrorResponse` para manejar 404s correctamente
- [ ] `ProtectedRoute` con `<Navigate to="/login" replace />`
- [ ] `useSearchParams` para filtros/paginación (no estado local)
- [ ] `useNavigation` para indicadores de carga
- [ ] `createMemoryRouter` en tests
- [ ] `NavLink` con `className` callback para estilos activos
- [ ] `replace: true` en navegaciones post-login/post-logout
