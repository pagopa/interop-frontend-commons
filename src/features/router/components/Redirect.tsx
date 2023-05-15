import { useEffect } from 'react'
import {
  type NavigateOptions,
  generatePath as rrdGeneratePath,
  useNavigate,
} from 'react-router-dom'
import type { ExtractRouteParams, Routes } from '../router.types'
import { prefixPathnameWithSlash } from '../routes.utils'

export function generateTypedRedirect<TRoutes extends Routes>(routes: TRoutes) {
  return function Redirect<RouteKey extends keyof TRoutes = keyof TRoutes>(
    props: {
      to: RouteKey
      options?: NavigateOptions
      urlParams?: Record<string, string>
    } & (ExtractRouteParams<TRoutes[RouteKey]['path']> extends undefined
      ? object
      : { params: ExtractRouteParams<TRoutes[RouteKey]['path']> })
  ) {
    const navigate = useNavigate()

    useEffect(() => {
      let url = routes[props.to].path
      if ('params' in props) {
        url = rrdGeneratePath(url, props.params)
      }
      if (props.urlParams) {
        url = `${url}?${new URLSearchParams(props.urlParams).toString()}`
      }

      navigate(prefixPathnameWithSlash(url), props.options)
    }, [navigate, props])

    return null
  }
}
