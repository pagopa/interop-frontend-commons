import { useEffect } from 'react'
import {
  type NavigateOptions,
  generatePath as rrdGeneratePath,
  useNavigate,
} from 'react-router-dom'
import type { ExtractRouteParams, GenerateRoutesOptions, Routes } from '../router.types'
import { prefixPathnameWithLang } from '../router.utils'
import { useTranslation } from 'react-i18next'

export function generateTypedRedirect<TRoutes extends Routes>(
  routes: TRoutes,
  options?: GenerateRoutesOptions
) {
  const hasLanguages = !!options?.languages && options.languages.length > 0

  return function Redirect<RouteKey extends keyof TRoutes = keyof TRoutes>(
    props: {
      to: RouteKey
      options?: NavigateOptions
      urlParams?: Record<string, string>
    } & (ExtractRouteParams<TRoutes[RouteKey]['path']> extends undefined
      ? object
      : { params: ExtractRouteParams<TRoutes[RouteKey]['path']> })
  ) {
    const { i18n } = useTranslation()
    const currentLang = hasLanguages ? i18n.language : undefined

    const navigate = useNavigate()

    useEffect(() => {
      let url = routes[props.to].path
      if ('params' in props) {
        url = rrdGeneratePath(url, props.params)
      }
      if (props.urlParams) {
        url = `${url}?${new URLSearchParams(props.urlParams).toString()}`
      }

      navigate(prefixPathnameWithLang(url, currentLang), props.options)
    }, [navigate, props, currentLang])

    return null
  }
}
