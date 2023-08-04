import { useCallback } from 'react'
import { generatePath as rrdGeneratePath } from 'react-router-dom'
import type {
  Routes,
  TypedUseGeneratePath,
  TypedGeneratePath,
  RoutesBuilderConfig,
} from '../router.types'
import { prefixPathnameWithLang } from '../router.utils'
import { useTranslation } from 'react-i18next'

export function generateTypedUseGeneratePath<TRoutes extends Routes>(
  routes: TRoutes,
  config?: RoutesBuilderConfig
): TypedUseGeneratePath<TRoutes> {
  const hasLanguages = !!config?.languages && config.languages.length > 0

  return function useGeneratePath() {
    const { i18n } = useTranslation()

    const currentLang = hasLanguages ? i18n.language : undefined

    const generatePath: TypedGeneratePath<TRoutes> = useCallback(
      (routeKey, ...params) => {
        const pathname = routes[routeKey].path

        if (params[0]) {
          return prefixPathnameWithLang(rrdGeneratePath(pathname, params[0]), currentLang)
        }

        return prefixPathnameWithLang(pathname, currentLang)
      },
      [currentLang]
    )

    return generatePath
  }
}
