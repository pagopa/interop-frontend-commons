import { useParams as useRRDParams } from 'react-router-dom'
import type { ExtractRouteParams, Routes, TypedUseParams } from '../router.types'

export function generateTypedUseParams<TRoutes extends Routes>(): TypedUseParams<TRoutes> {
  return function useParams<RouteKey extends keyof TRoutes = keyof TRoutes>() {
    const params = useRRDParams()

    return params as ExtractRouteParams<TRoutes[RouteKey]['path']>
  }
}
