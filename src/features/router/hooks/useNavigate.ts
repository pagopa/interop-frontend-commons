import { useCallback } from 'react'
import { generatePath, useNavigate as useRRDNavigate } from 'react-router-dom'
import type {
  TypedNavigate,
  Routes,
  TypedUseNavigate,
  GenerateRoutesOptions,
} from '../router.types'
import { prefixPathnameWithLang } from '../router.utils'
import { useTranslation } from 'react-i18next'

export function generateTypedUseNavigate<TRoutes extends Routes>(
  routes: TRoutes,
  options?: GenerateRoutesOptions
): TypedUseNavigate<TRoutes> {
  const hasLanguages = !!options?.languages && options.languages.length > 0

  return function useNavigate() {
    const rrdNavigate = useRRDNavigate()
    const { i18n } = useTranslation()

    const currentLang = hasLanguages ? i18n.language : undefined

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

        generatedPath = prefixPathnameWithLang(generatedPath, currentLang)

        rrdNavigate(generatedPath, config[0])
      },
      [rrdNavigate, currentLang]
    )

    return navigate
  }
}
