import React from 'react'
import {
  generatePath as rrdGeneratePath,
  Link as RRDLink,
  type NavigateOptions,
} from 'react-router-dom'
import {
  Button,
  type ButtonProps as MUIButtonProps,
  Link as MUILink,
  type LinkProps as MUILinkProps,
} from '@mui/material'
import type { ExtractRouteParams, Routes } from '../router.types'
import { omit } from '../routes.utils'

export interface RouterLinkOptions extends NavigateOptions {
  urlParams: Record<string, string>
}

export function generateTypedLink<TRoutes extends Routes>(routes: TRoutes) {
  function Link<RouteKey extends keyof TRoutes = keyof TRoutes>(
    props: {
      to: RouteKey
      options?: RouterLinkOptions
    } & (ExtractRouteParams<TRoutes[RouteKey]['path']> extends undefined
      ? object
      : { params: ExtractRouteParams<TRoutes[RouteKey]['path']> }) &
      (
        | ({ as?: 'link' } & Omit<MUILinkProps<typeof RRDLink>, 'component' | 'to' | 'href'>)
        | ({ as: 'button' } & Omit<
            MUIButtonProps,
            'onClick' | 'href' | 'to' | 'LinkComponent' | 'component'
          >)
      ),
    ref: React.Ref<HTMLButtonElement> | React.Ref<HTMLAnchorElement>
  ) {
    let url = routes[props.to].path

    if ('params' in props) {
      url = rrdGeneratePath(url, props.params)
    }

    if (props.options?.urlParams) {
      url = `${url}?${new URLSearchParams(props.options.urlParams).toString()}`
    }

    if (props.as === 'button') {
      const buttonProps = {
        ...omit(props, 'as', 'options', 'params'),
        ref,
        LinkComponent: RRDLink,
        to: url,
      } as MUIButtonProps

      return <Button {...buttonProps} />
    }

    const linkProps = {
      ...omit(props, 'as', 'options', 'params'),
      ref,
      component: RRDLink,
      to: url,
    } as MUILinkProps

    return <MUILink {...linkProps} />
  }

  return React.forwardRef(Link) as unknown as typeof Link
}
