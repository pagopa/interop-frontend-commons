import React from 'react'
import type { GenerateRoutesOptions, Routes } from '../router.types'
import { Breadcrumbs as MUIBreadcrumbs, Link as MUILink } from '@mui/material'
import {
  getRouteKeyFromPath,
  prefixPathnameWithLang,
  removeLanguageSubpathFromPathname,
  splitPath,
} from '../router.utils'
import { useLocation, useParams, Link as RRDLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function generateBreadcrumbs<
  TRoutes extends Routes,
  RouteKey extends keyof TRoutes = keyof TRoutes
>(
  routes: TRoutes,
  getParentRoutes: (input: RouteKey) => RouteKey[],
  options?: GenerateRoutesOptions
) {
  type BreadcrumbProps = {
    routeLabels: Record<RouteKey, string>
  }
  const languages = options?.languages ?? []
  const hasLanguages = !!options?.languages && options.languages.length > 0

  return function Breadcrumbs({ routeLabels }: BreadcrumbProps) {
    const params = useParams()
    const location = useLocation()
    const { i18n } = useTranslation()
    const currentLang = hasLanguages ? i18n.language : undefined

    const currentRouteKey = React.useMemo(() => {
      return getRouteKeyFromPath(
        removeLanguageSubpathFromPathname(location.pathname, languages),
        routes
      ) as RouteKey
    }, [location.pathname])

    const toDynamicPath = (routeKey: RouteKey) => {
      const subpaths = splitPath(routes[routeKey].path)

      const dynamicSplit = subpaths.map((pathFragment) => {
        const isDynamicFragment = pathFragment.charAt(0) === ':'
        if (isDynamicFragment) {
          const dynamicKey = pathFragment.substring(1)
          return params[dynamicKey]
        }
        return pathFragment
      })

      return prefixPathnameWithLang(`/${dynamicSplit.join('/')}`, currentLang)
    }

    const parentRoutes = getParentRoutes(currentRouteKey)
    const links = ([...parentRoutes, currentRouteKey] as Array<RouteKey>).map((r: RouteKey) => ({
      label: routeLabels[r],
      // Remap dynamic parts of the path to their current value
      path: toDynamicPath(r),
    }))

    // Don't display breadcrumbs for first level descentants, they are useless
    if (links.length < 2) {
      return null
    }

    return (
      <MUIBreadcrumbs sx={{ mb: 1 }}>
        {links.map(({ label, path }, i) => {
          if (i === links.length - 1) {
            return <span key={i}>{label}</span>
          }
          return (
            <MUILink component={RRDLink} key={i} to={path} sx={{ fontWeight: 700 }} color="inherit">
              {label}
            </MUILink>
          )
        })}
      </MUIBreadcrumbs>
    )
  }
}
