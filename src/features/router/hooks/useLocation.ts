import { useMemo } from 'react'
import { useLocation as useRRDLocation } from 'react-router-dom'
import type { GenerateRoutesOptions, Routes } from '../router.types'
import { getRouteKeyFromPath, removeLanguageSubpathFromPathname } from '../router.utils'

export function generateTypedUseLocation<TRoutes extends Routes>(
  routes: TRoutes,
  options?: GenerateRoutesOptions
) {
  const languages = options?.languages ?? []

  return function useLocation<RouteKey extends keyof TRoutes = keyof TRoutes>() {
    const location = useRRDLocation()

    const routeKey = useMemo(() => {
      const pathname = removeLanguageSubpathFromPathname(location.pathname, languages)
      return getRouteKeyFromPath(pathname, routes) as RouteKey
    }, [location.pathname])

    return { ...location, routeKey }
  }
}
