import { useCallback } from 'react'
import { generatePath as rrdGeneratePath } from 'react-router-dom'
import type {
  Routes,
  TypedUseGeneratePath,
  GenerateRoutesOptions,
  TypedGeneratePath,
} from '../router.types'
import { prefixPathnameWithLang } from '../router.utils'
import { useTranslation } from 'react-i18next'

export function generateTypeduseGeneratePath<TRoutes extends Routes>(
  routes: TRoutes,
  options?: GenerateRoutesOptions
): TypedUseGeneratePath<TRoutes> {
  const hasLanguages = !!options?.languages && options.languages.length > 0

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
