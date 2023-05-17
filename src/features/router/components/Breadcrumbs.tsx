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
    routeLabels: { [R in RouteKey]: string | false }
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

    const getPathFromRouteKey = (routeKey: RouteKey) => {
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
    const breadcrumbSegments = ([...parentRoutes, currentRouteKey] as Array<RouteKey>)
      .filter((r) => routeLabels[r] !== false)
      .map((routeKey) => ({
        label: routeLabels[routeKey],
        path: getPathFromRouteKey(routeKey),
      }))

    // Don't display breadcrumbs for first level descentants, they are useless
    if (breadcrumbSegments.length < 2) {
      return null
    }

    return (
      <MUIBreadcrumbs sx={{ mb: 1 }}>
        {breadcrumbSegments.map(({ label, path }, i) => {
          if (i === breadcrumbSegments.length - 1) {
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
