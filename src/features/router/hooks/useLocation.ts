import { useMemo } from 'react'
import { useLocation as useRRDLocation } from 'react-router-dom'
import type { Routes } from '../router.types'
import { getRouteKeyFromPath } from '../routes.utils'

export function generateTypedUseLocation<TRoutes extends Routes>(routes: TRoutes) {
  return function useLocation<RouteKey extends keyof TRoutes = keyof TRoutes>() {
    const location = useRRDLocation()

    const routeKey = useMemo(() => {
      return getRouteKeyFromPath(location.pathname, routes) as RouteKey
    }, [location.pathname])

    return { ...location, routeKey }
  }
}
