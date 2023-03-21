import { type RouteObject, generatePath as rrdGeneratePath, matchPath } from 'react-router-dom'
import type { Routes, TypedGeneratePath } from './router.types'

export function generateRRDRouteObject(routes: Routes): RouteObject[] {
  return Object.values(routes).map(({ path, Component }) => ({ path, Component }))
}

export function generateTypedGeneratePath<TRoutes extends Routes>(
  routes: TRoutes
): TypedGeneratePath<TRoutes> {
  return function generatePath(routeKey, ...params) {
    const pathname = routes[routeKey].path

    if (params[0]) {
      return rrdGeneratePath(pathname, params[0])
    }

    return pathname
  }
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
  return path.split('/').filter((subpath) => !!subpath)
}

export const getParentRoutes = <
  TRoutes extends Routes,
  RouteKey extends keyof TRoutes = keyof TRoutes
>(
  routes: TRoutes,
  routeKey: RouteKey
): Array<RouteKey> => {
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

  return sortedParents.map(([routeKey]) => routeKey) as Array<RouteKey>
}

export function memoize(fn: (arg: string) => unknown) {
  const cache = new Map()
  return (arg: string) => {
    if (cache.has(arg)) return cache.get(arg)!
    const result = fn(arg)
    cache.set(arg, result)
    return result
  }
}

export function getRouteKeyFromPath<TRoutes extends Routes>(pathname: string, routes: TRoutes) {
  const currentRouteKey = Object.entries(routes).find(([_, { path }]) =>
    matchPath(location.pathname, path)
  )?.[0]

  if (!currentRouteKey) throw new Error(`Pathname ${location.pathname} has no associated routeKey.`)

  return currentRouteKey as keyof TRoutes
}
