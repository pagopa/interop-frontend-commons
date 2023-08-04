import type { Route, RoutesBuilderConfig } from './router.types'
import { generateTypedUseNavigate } from './hooks/useNavigate'
import { generateTypedUseParams } from './hooks/useParams'
import { generateRRDRouteObject, generateTypedGetParentRoutes } from './router.utils'
import { generateTypedLink } from './components/Link'
import { generateTypedRedirect } from './components/Redirect'
import { generateBreadcrumbs } from './components/Breadcrumbs'
import { generateTypedUseLocation } from './hooks/useLocation'
import { generateUseAuthGuard } from './hooks/useAuthGuard'
import { generateTypedUseGeneratePath } from './hooks/useGeneratePath'
import { generateUseSwitchPathLang } from './hooks/useSwitchPathLang'

export class InteropRouterBuilder<
  TLanguage extends string,
  AuthLevel extends string = string & {},
  const TConfigExtension extends Record<string, any> = {},
  const TRoutes extends Record<string, any> = {},
> {
  private routes = {} as TRoutes

  constructor(private config: RoutesBuilderConfig<TLanguage> = {}) {}

  addRoute<
    TKey extends string,
    TPath extends string,
    TPublic extends boolean,
    TAuthLevel extends AuthLevel,
  >(
    route: Route<TKey, TPath, TPublic, TAuthLevel, TConfigExtension, keyof TRoutes>
  ): InteropRouterBuilder<
    TLanguage,
    AuthLevel | TAuthLevel,
    TConfigExtension,
    TRoutes & Record<TKey, typeof route>
  > {
    this.routes[route.key] = route as any
    return this
  }

  build() {
    const useNavigate = generateTypedUseNavigate(this.routes, this.config)
    const useGeneratePath = generateTypedUseGeneratePath(this.routes, this.config)
    const useLocation = generateTypedUseLocation(this.routes, this.config)
    const useAuthGuard = generateUseAuthGuard(this.routes, useLocation)
    const useParams = generateTypedUseParams<TRoutes>()
    const useSwitchPathLang = generateUseSwitchPathLang<TLanguage>(this.config)
    const Link = generateTypedLink(this.routes, this.config)
    const Redirect = generateTypedRedirect(this.routes, this.config)
    const getParentRoutes = generateTypedGetParentRoutes(this.routes)
    const Breadcrumbs = generateBreadcrumbs(this.routes, getParentRoutes, this.config)

    const reactRouterDOMRoutes = generateRRDRouteObject(this.routes, Redirect, this.config)

    return {
      routes: this.routes,
      reactRouterDOMRoutes,
      hooks: {
        useNavigate,
        useGeneratePath,
        useLocation,
        useAuthGuard,
        useParams,
        useSwitchPathLang,
      },
      components: {
        Link,
        Redirect,
        Breadcrumbs,
      },
      utils: {
        getParentRoutes,
      },
    }
  }
}
