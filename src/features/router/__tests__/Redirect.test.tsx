import React from 'react'
import { generateTestingRoutes, renderRoutes } from './common.mocks'
import { createMemoryHistory } from 'history'
import { expectTypeOf } from 'vitest'
import type { ExtractRouteParams } from '../router.types'

const {
  routes,
  reactRouterDOMRoutes,
  components: { Redirect },
} = generateTestingRoutes()

const {
  reactRouterDOMRoutes: reactRouterDOMLocalizedRoutes,
  components: { Redirect: LocalizedRedirect },
} = generateTestingRoutes({ languages: ['it', 'en'] })

describe('Redirect', () => {
  it('should redirect to the correct route', () => {
    const { history } = renderRoutes(<Redirect to="PAGE_2" />, reactRouterDOMRoutes)
    expect(history.location.pathname).toEqual('/page-2')
  })

  it('should redirect to the correct localized route', () => {
    const history = createMemoryHistory()
    history.push('/it/page-1')

    renderRoutes(<LocalizedRedirect to="PAGE_2" />, reactRouterDOMLocalizedRoutes, history)
    expect(history.location.pathname).toEqual('/it/page-2')
  })

  it('should correctly redirect to dynamic routes', () => {
    const { history } = renderRoutes(
      <Redirect to="DYNAMIC_PAGE_1" params={{ id: 'test-id' }} />,
      reactRouterDOMRoutes
    )
    expect(history.location.pathname).toEqual('/page-1/test-id')
  })

  it('should keep the hash and query params', () => {
    const history = createMemoryHistory()
    history.push('/page-1?test=1#test')

    renderRoutes(<Redirect to="PAGE_2" />, reactRouterDOMRoutes, history)
    expect(history.location.pathname).toEqual('/page-2')
    expect(history.location.search).toEqual('?test=1')
    expect(history.location.hash).toEqual('#test')
  })

  it('should have the "to" prop typed correctly', () => {
    type ToProp = Parameters<typeof Redirect>['0']['to']
    expectTypeOf<ToProp>().toMatchTypeOf<keyof typeof routes>()
  })

  it('should have the "params" prop typed correctly', () => {
    type DynamicPageOnePathParameters = Parameters<typeof Redirect<'DYNAMIC_PAGE_1'>>['0']['params']
    expectTypeOf<DynamicPageOnePathParameters>().toMatchTypeOf<
      ExtractRouteParams<(typeof routes)['DYNAMIC_PAGE_1']['path']>
    >()

    type HomePagePathParameters = Parameters<typeof Redirect<'HOME'>>['0']
    expectTypeOf<HomePagePathParameters>().not.toMatchTypeOf<{ params: unknown }>()
  })
})
