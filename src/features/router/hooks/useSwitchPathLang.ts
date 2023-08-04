import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { RoutesBuilderConfig } from '../router.types'

export function generateUseSwitchPathLang<T extends string>(config?: RoutesBuilderConfig) {
  const languages = config?.languages

  return function useSwitchPathLang() {
    const location = useLocation()
    const navigate = useNavigate()

    const switchPathLang = React.useCallback(
      (toLang: T) => {
        const path = location.pathname
        const firstBit = path.split('/')[1]

        if (!languages) {
          throw new Error(
            'useSwitchPathLang requires languages to be defined in generateRoutes config'
          )
        }

        if (!languages.includes(firstBit)) {
          console.warn(`useSwitchPathLang: path "${path}" does not start with a language code.`)
          return
        }

        let newPath = path.replace(`/${firstBit}/`, `/${toLang}/`)

        if (location.search) {
          newPath += location.search
        }

        if (location.hash) {
          newPath += location.hash
        }

        navigate(newPath, { replace: true })
      },
      [location.hash, location.search, location.pathname, navigate]
    )

    return switchPathLang
  }
}
