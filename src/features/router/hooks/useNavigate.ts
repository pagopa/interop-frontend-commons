import { useCallback } from 'react'
import { generatePath, useNavigate as useRRDNavigate } from 'react-router-dom'
import type { TypedNavigate, Routes, TypedUseNavigate } from '../router.types'
import { prefixPathnameWithSlash } from '../routes.utils'

export function generateTypedUseNavigate<TRoutes extends Routes>(
  routes: TRoutes
): TypedUseNavigate<TRoutes> {
  return function useNavigate() {
    const rrdNavigate = useRRDNavigate()

    const navigate = useCallback<TypedNavigate<TRoutes>>(
      (routeKey, ...config) => {
        const pathname = routes[routeKey].path
        let generatedPath = '#'

        if (config[0] && 'params' in config[0]) {
          generatedPath = generatePath(pathname, config[0].params)
        } else {
          generatedPath = generatePath(pathname)
        }

        if (config[0]?.urlParams) {
          generatedPath = `${generatedPath}?${new URLSearchParams(config[0].urlParams).toString()}`
        }

        generatedPath = prefixPathnameWithSlash(generatedPath)

        rrdNavigate(generatedPath, config[0])
      },
      [rrdNavigate]
    )

    return navigate
  }
}
