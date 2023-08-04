import { useMemo } from 'react'
import { useLocation as useRRDLocation } from 'react-router-dom'
import type { Routes, RoutesBuilderConfig } from '../router.types'
import { getRouteKeyFromPath, removeLanguageSubpathFromPathname } from '../router.utils'

export function generateTypedUseLocation<TRoutes extends Routes>(
  routes: TRoutes,
  config?: RoutesBuilderConfig
) {
  const languages = config?.languages ?? []

  return function useLocation<RouteKey extends keyof TRoutes = keyof TRoutes>() {
    const location = useRRDLocation()

    const routeKey = useMemo(() => {
      const pathname = removeLanguageSubpathFromPathname(location.pathname, languages)
      return getRouteKeyFromPath(pathname, routes) as RouteKey
    }, [location.pathname])

    return { ...location, routeKey }
  }
}
