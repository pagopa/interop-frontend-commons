import React from 'react'
import { type RouteObject, matchPath } from 'react-router-dom'
import type { GenerateRoutesOptions, Routes } from './router.types'

export function generateRRDRouteObject(
  routes: Routes,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Redirect: React.FC<any>,
  options?: GenerateRoutesOptions
): RouteObject[] {
  const languages = options?.languages

  const result = Object.values(routes).map((route) => {
    if ('redirect' in route) {
      return {
        path: route.path,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        element: <Redirect to={route.redirect} />,
      }
    }

    return {
      path: route.path,
      element: route.element,
    }
  })

  if (languages) {
    return languages.map((lang) => ({
      path: `/${lang}/`,
      children: result,
    }))
  }

  return result
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

    const sortedParents = parents.sort(
      ([_, parentA], [__, parentB]) =>
        splitPath(parentA.path).length - splitPath(parentB.path).length
    )

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

export function prefixPathnameWithLang(pathname: string, lang?: string) {
  let result = pathname.charAt(0) === '/' ? pathname : `/${pathname}`
  if (lang) {
    result = `/${lang}${result}`
  }
  return result
}

export function getRouteKeyFromPath<TRoutes extends Routes>(pathname: string, routes: TRoutes) {
  const currentRouteKey = Object.entries(routes).find(([_, { path }]) =>
    matchPath(path, pathname)
  )?.[0]

  if (!currentRouteKey) throw new Error(`Pathname ${pathname} has no associated routeKey.`)

  return currentRouteKey as keyof TRoutes
}

export function removeLanguageSubpathFromPathname(
  pathname: string,
  languages?: Readonly<Array<string>>
) {
  if (!languages || languages.length === 0) return pathname
  let result = pathname

  const firstBit = pathname.split('/')[1]
  if (languages.includes(firstBit)) {
    result = result.replace(new RegExp(`^\/${firstBit}\/`), '/')
  }

  return result
}
