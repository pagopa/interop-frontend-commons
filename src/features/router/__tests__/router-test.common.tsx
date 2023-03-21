import React from 'react'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { generateTypedReactRoutedDOM } from '..'

const EmptyComponent = () => null

export const routesMock = {
  HOMEPAGE: {
    path: '/',
    authLevels: [],
    public: true,
    Component: EmptyComponent,
  },
  HOMEPAGE_TEST_1: {
    path: '/homepage-test-1',
    authLevels: ['admin'],
    public: true,
    Component: EmptyComponent,
  },
  HOMEPAGE_TEST_2: {
    path: '/homepage-test-2',
    authLevels: ['operator'],
    public: true,
    Component: EmptyComponent,
  },
  HOMEPAGE_TEST_3: {
    path: '/homepage-test-3',
    authLevels: ['user', 'operator'],
    public: false,
    Component: EmptyComponent,
  },
} as const

const { reactRouterDOMRoutes } = generateTypedReactRoutedDOM(routesMock)

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Outlet />
      {children}
    </>
  )
}

export const RouterTestingWrapper = ({ children }: { children: React.ReactNode }) => {
  const [router, _] = React.useState(() => {
    return createBrowserRouter([
      { element: <Wrapper>{children}</Wrapper>, children: reactRouterDOMRoutes },
    ])
  })
  return <RouterProvider router={router} />
}
