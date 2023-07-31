import { useEffect } from 'react'
import {
  type NavigateOptions,
  generatePath as rrdGeneratePath,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import type { ExtractRouteParams, Routes, RoutesBuilderConfig } from '../router.types'
import { prefixPathnameWithLang } from '../router.utils'
import { useTranslation } from 'react-i18next'

export function generateTypedRedirect<TRoutes extends Routes>(
  routes: TRoutes,
  config?: RoutesBuilderConfig
) {
  const hasLanguages = !!config?.languages && config.languages.length > 0

  return function Redirect<RouteKey extends keyof TRoutes = keyof TRoutes>(
    props: {
      to: RouteKey
      options?: NavigateOptions
    } & (ExtractRouteParams<TRoutes[RouteKey]['path']> extends undefined
      ? object
      : { params: ExtractRouteParams<TRoutes[RouteKey]['path']> })
  ) {
    const { i18n } = useTranslation()
    const currentLang = hasLanguages ? i18n.language : undefined
    const location = useLocation()

    const navigate = useNavigate()

    useEffect(() => {
      let url = routes[props.to].path

      if ('params' in props) {
        url = rrdGeneratePath(url, props.params)
      }

      url = `${url}${location.search}${location.hash}`

      navigate(prefixPathnameWithLang(url, currentLang), props.options)
    }, [navigate, props, currentLang, location])

    return null
  }
}
