import React from 'react'
import { type RouteObject, generatePath as rrdGeneratePath, matchPath } from 'react-router-dom'
import type { Routes, TypedGeneratePath } from './router.types'
import { generateTypedRedirect } from './components/Redirect'

export function generateRRDRouteObject(routes: Routes): RouteObject[] {
  const Redirect = generateTypedRedirect(routes)
  return Object.values(routes).map((route) => {
    const path = prefixPathnameWithSlash(route.path)
    if ('redirect' in route) {
      return {
        path,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        element: <Redirect to={route.redirect} />,
      }
    }

    return {
      path,
      element: route.element,
    }
  })
}

export function generateTypedGeneratePath<TRoutes extends Routes>(
  routes: TRoutes
): TypedGeneratePath<TRoutes> {
  return function generatePath(routeKey, ...params) {
    const pathname = routes[routeKey].path

    if (params[0]) {
      return prefixPathnameWithSlash(rrdGeneratePath(pathname, params[0]))
    }

    return prefixPathnameWithSlash(pathname)
  }
}

export function generateTypedGetParentRoutes<
  TRoutes extends Routes,
  TRouteKey extends keyof TRoutes = keyof TRoutes
>(routes: TRoutes) {
  const getParentRoutes = memoize((routeKey: TRouteKey) => {
    function isParentRoute(
      possibleParentRouteSubpaths: Array<string>,
      currentSubpaths: Array<string>
    ) {
      if (possibleParentRouteSubpaths.length >= currentSubpaths.length) {
        return false
      }

      const allSameFragments = possibleParentRouteSubpaths.every(
        (pathFragment, i) => pathFragment === currentSubpaths[i]
      )

      return allSameFragments
    }

    const route = routes[routeKey]
    const currentSubpaths = splitPath(route.path)

    const parents = Object.entries(routes).filter(([_, possibleParentRoute]) =>
      isParentRoute(splitPath(possibleParentRoute.path), currentSubpaths)
    )

    const sortedParents = parents.sort((a, b) => a.length - b.length)

    return sortedParents.map(([routeKey]) => routeKey) as Array<TRouteKey>
  })
  return getParentRoutes
}

export function omit<TObj extends Record<string, unknown>, TKeys extends keyof TObj = keyof TObj>(
  obj: TObj,
  ...props: TKeys[]
) {
  const result = { ...obj }
  props.forEach((prop) => {
    delete result[prop]
  })
  return result
}

export function splitPath(path: string) {
  return path.split('/').filter(Boolean)
}

export function memoize<Input, Result>(fn: (input: Input) => Result) {
  const memoMap = new Map<Input, Result>()
  return function (input: Input): Result {
    if (memoMap.has(input)) return memoMap.get(input)!

    const result = fn(input)
    memoMap.set(input, result)
    return result
  }
}

export function prefixPathnameWithSlash(pathname: string) {
  return pathname.charAt(0) === '/' ? pathname : `/${pathname}`
}

export function getRouteKeyFromPath<TRoutes extends Routes>(pathname: string, routes: TRoutes) {
  const currentRouteKey = Object.entries(routes).find(([_, { path }]) =>
    matchPath(path, pathname)
  )?.[0]

  if (!currentRouteKey) throw new Error(`Pathname ${pathname} has no associated routeKey.`)

  return currentRouteKey as keyof TRoutes
}
