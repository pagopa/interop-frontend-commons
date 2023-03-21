import { useCallback } from 'react'
import type { Routes } from '../router.types'
import { generateTypedUseLocation } from './useLocation'

export function generateUseAuthGuard<TRoutes extends Routes>(routes: TRoutes) {
  const useLocation = generateTypedUseLocation(routes)

  type AuthLevel = TRoutes[keyof TRoutes]['authLevels'][number]

  return function useAuthGuard<RouteKey extends keyof TRoutes = keyof TRoutes>() {
    const { routeKey } = useLocation<RouteKey>()

    const route = routes[routeKey]

    const isPublic = route.public as TRoutes[RouteKey]['public']
    const authLevels = route.authLevels as TRoutes[RouteKey]['authLevels']

    const isUserAuthorized = useCallback<(userAuth: AuthLevel | AuthLevel[]) => boolean>(
      (userAuth: AuthLevel | AuthLevel[]) => {
        const authLevels = routes[routeKey].authLevels

        let hasAuthorization = false

        if (Array.isArray(userAuth)) {
          hasAuthorization = authLevels.some((requiredAuthLevel) =>
            userAuth.includes(requiredAuthLevel)
          )
        } else {
          hasAuthorization = authLevels.includes(userAuth)
        }

        return isPublic || hasAuthorization
      },
      [routeKey, isPublic]
    )

    return { isPublic, authLevels, isUserAuthorized }
  }
}
