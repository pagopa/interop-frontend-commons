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

export const generateTestingRoutes = <T extends string>(options?: GenerateRoutesOptions<T>) => {
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
  function generateChildrenRoutes(route: RouteObject, childPath = ''): React.ReactNode {
    const path = childPath && route.path ? childPath.slice(0, -1) + route.path : route.path

    if (!('children' in route)) {
      return <Route key={path} path={path} element={element} />
    }

    if ('element' in route && !route.path && 'children' in route) {
      return (
        <Route element={route.element}>
          {route.children?.map((child) => generateChildrenRoutes(child, path))}
        </Route>
      )
    }

    return route.children?.map((child) => generateChildrenRoutes(child, path))
  }

  return (
    <Router location={history.location} navigator={history}>
      <Routes>{routes.map((route) => generateChildrenRoutes(route))}</Routes>
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
