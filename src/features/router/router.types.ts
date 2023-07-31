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

export type Route<
  TKey extends string = string,
  TPath extends string = string,
  TPublic extends boolean = boolean,
  TAuthLevel extends string = string,
  TConfigExtension extends Record<string, any> = {},
  TRedirectKey extends string | number | symbol = string,
> = Readonly<
  {
    /**
     * Unique key of the route
     */
    key: TKey
    /**
     * The route path, e.g. `/users/:userId`
     */
    path: TPath
    /**
     * Whether the route is public or not, i.e. whether it requires authentication
     */
    public: TPublic
    /**
     * The auth levels required to access the route
     * @example ['user', 'admin']
     */
    authLevels: readonly TAuthLevel[]
  } & (
    | {
        /**
         * The component to render when the route is matched
         */
        element: React.ReactNode
      }
    | {
        /**
         * The route to redirect to when the route is matched.
         * Must be a route key.
         * @example 'HOME'
         */
        redirect: TRedirectKey
      }
  ) &
    TConfigExtension
>

export type RoutesBuilderConfig<TLanguage extends string = string> = Readonly<{
  languages?: readonly [TLanguage, ...TLanguage[]]
}>

export type Routes = Record<string, Route>

export type ExtendedNavigateOptions = NavigateOptions & { urlParams?: Record<string, string> }
export type TypedGeneratePath<TRoutes extends Routes> = <
  RouteKey extends keyof TRoutes = keyof TRoutes,
  Path extends TRoutes[RouteKey]['path'] = TRoutes[RouteKey]['path'],
  RouteParams extends ExtractRouteParams<Path> = ExtractRouteParams<Path>,
>(
  routeKey: RouteKey,
  ...params: RouteParams extends undefined ? [] : [RouteParams]
) => string

export type TypedNavigate<TRoutes extends Routes> = <
  RouteKey extends keyof TRoutes = keyof TRoutes,
  Path extends TRoutes[RouteKey]['path'] = TRoutes[RouteKey]['path'],
  RouteParams extends ExtractRouteParams<Path> = ExtractRouteParams<Path>,
>(
  routeKey: RouteKey,
  ...config: RouteParams extends undefined
    ? [ExtendedNavigateOptions] | []
    : [{ params: RouteParams } & ExtendedNavigateOptions]
) => void

export type TypedUseNavigate<TRoutes extends Routes> = () => TypedNavigate<TRoutes>

export type TypedUseParams<TRoutes extends Routes> = <
  RouteKey extends keyof TRoutes = keyof TRoutes,
>() => ExtractRouteParams<TRoutes[RouteKey]['path']>

export type TypedUseGeneratePath<TRoutes extends Routes> = () => TypedGeneratePath<TRoutes>

export type GenerateRoutesOptions<Language extends string = string> = Readonly<{
  languages: readonly [Language, ...Language[]]
}>

export type InferRouteKey<TRoutes extends Routes> = Extract<keyof TRoutes, string>
