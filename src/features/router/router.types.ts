import type { NavigateOptions } from 'react-router-dom'

export type ExtractRouteParams<T> = string extends T
  ? Record<string, string>
  : T extends `${infer _Start}:${infer Param}/${infer Rest}`
  ? { [k in Param | keyof ExtractRouteParams<Rest>]: string }
  : T extends `${infer _Start}:${infer Param}`
  ? { [k in Param]: string }
  : undefined

export type RouteKey<TRoutes extends Routes> = Extract<keyof TRoutes, string>
export type RouteParams<TRoutes extends Routes> = ExtractRouteParams<
  TRoutes[Extract<keyof TRoutes, string>]['path']
>

export type Routes<AuthLevel extends string = string> = Readonly<
  Record<
    string,
    {
      path: string
      Component: React.FC
      public: boolean
      authLevels: readonly AuthLevel[]
    }
  >
>

export type ExtendedNavigateOptions = NavigateOptions & { urlParams?: Record<string, string> }
export type TypedGeneratePath<TRoutes extends Routes> = <
  RouteKey extends keyof TRoutes = keyof TRoutes,
  Path extends TRoutes[RouteKey]['path'] = TRoutes[RouteKey]['path'],
  RouteParams extends ExtractRouteParams<Path> = ExtractRouteParams<Path>
>(
  routeKey: RouteKey,
  ...params: RouteParams extends undefined ? [] : [RouteParams]
) => string

export type TypedNavigate<TRoutes extends Routes> = <
  RouteKey extends keyof TRoutes = keyof TRoutes,
  Path extends TRoutes[RouteKey]['path'] = TRoutes[RouteKey]['path'],
  RouteParams extends ExtractRouteParams<Path> = ExtractRouteParams<Path>
>(
  routeKey: RouteKey,
  ...config: RouteParams extends undefined
    ? [ExtendedNavigateOptions] | []
    : [{ params: RouteParams } & ExtendedNavigateOptions]
) => void

export type TypedUseNavigate<TRoutes extends Routes> = () => TypedNavigate<TRoutes>

export type TypedUseParams<TRoutes extends Routes> = <
  RouteKey extends keyof TRoutes = keyof TRoutes
>() => ExtractRouteParams<TRoutes[RouteKey]['path']>
