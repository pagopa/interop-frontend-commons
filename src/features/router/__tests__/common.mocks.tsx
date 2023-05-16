import React from 'react'
import { generateRoutes } from '../generate-routes'
import {
  type RouteObject,
  RouterProvider as _RouterProvider,
  Router,
  Routes,
  Route,
} from 'react-router-dom'
import { render, renderHook } from '@testing-library/react'
import { createMemoryHistory, type History } from 'history'
import { type GenerateRoutesOptions } from '../router.types'

const EmptyElement = () => null

export const generateTestingRoutes = (options?: GenerateRoutesOptions) => {
  return generateRoutes(
    {
      HOME: {
        path: '/',
        public: true,
        authLevels: ['user', 'admin'],
        element: <EmptyElement />,
      },
      PAGE_1: {
        path: '/page-1',
        public: false,
        authLevels: ['user'],
        element: <EmptyElement />,
      },
      PAGE_2: {
        path: '/page-2',
        public: false,
        authLevels: ['user'],
        element: <EmptyElement />,
      },
      REDIRECT_1: {
        path: '/redirect-1',
        public: true,
        authLevels: ['user', 'admin'],
        redirect: 'PAGE_1',
      },
      REDIRECT_2: {
        path: '/redirect-2',
        public: true,
        authLevels: ['user', 'admin'],
        redirect: 'PAGE_2',
      },
      DYNAMIC_PAGE_1: {
        path: '/page-1/:id',
        public: true,
        authLevels: ['admin'],
        element: <EmptyElement />,
      },
      DYNAMIC_PAGE_2: {
        path: '/page-2/:id',
        public: true,
        authLevels: ['admin'],
        element: <EmptyElement />,
      },
    },
    options
  )
}

const createRouter = (routes: RouteObject[], history: History, element: React.ReactNode) => {
  return (
    <Router location={history.location} navigator={history}>
      <Routes>
        {routes.map((route) => {
          if ('children' in route) {
            return route?.children?.map((child) => {
              const path = route!.path!.slice(0, -1) + child.path
              return <Route key={child.path} path={path} element={element} />
            })
          }
          return <Route key={route.path} path={route.path} element={element} />
        })}
      </Routes>
    </Router>
  )
}

export const renderRoutes = (
  element: React.ReactNode,
  routes: RouteObject[],
  _history?: History
) => {
  const history = _history ?? createMemoryHistory()
  const screen = render(createRouter(routes, history, element))
  return { history, ...screen }
}

export const renderHookInRoutes = <Result, Props>(
  hook: (initialProps: Props) => Result,
  routes: RouteObject[],
  _history?: History
) => {
  const history = _history ?? createMemoryHistory()
  const result = renderHook<Result, Props>(hook, {
    wrapper: ({ children }) => createRouter(routes, history, children),
  })
  return { history, ...result }
}
