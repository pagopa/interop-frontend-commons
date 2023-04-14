import type { Routes } from './router.types'
import { generateTypedUseNavigate } from './hooks/useNavigate'
import { generateTypedUseParams } from './hooks/useParams'
import { generateRRDRouteObject, generateTypedGeneratePath } from './routes.utils'
import { generateTypedLink } from './components/Link'
import { generateTypedRedirect } from './components/Redirect'
import { generateBreadcrumbs } from './components/Breadcrumbs'
import { generateTypedUseLocation } from './hooks/useLocation'
import { generateUseAuthGuard } from './hooks/useAuthGuard'

export function generateTypedReactRoutedDOM<
  AuthLevel extends string,
  // const TRoutes extends Routes<AuthLevel> = Routes<AuthLevel>
  TRoutes extends Routes<AuthLevel> = Routes<AuthLevel>
>(routes: TRoutes) {
  return {
    reactRouterDOMRoutes: generateRRDRouteObject(routes),
    hooks: {
      useNavigate: generateTypedUseNavigate(routes),
      useParams: generateTypedUseParams<TRoutes>(),
      useLocation: generateTypedUseLocation(routes),
      useAuthGuard: generateUseAuthGuard(routes),
    },
    components: {
      Link: generateTypedLink(routes),
      Redirect: generateTypedRedirect(routes),
      Breadcrumbs: generateBreadcrumbs(routes),
    },
    utils: {
      generatePath: generateTypedGeneratePath(routes),
    },
  }
}
