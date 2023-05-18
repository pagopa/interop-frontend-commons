import React from 'react'
import { generateTestingRoutes, renderRoutes } from './common.mocks'
import { createMemoryHistory } from 'history'

const {
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

  it('should set url params on redirect', () => {
    const { history } = renderRoutes(
      <Redirect to="DYNAMIC_PAGE_1" params={{ id: 'test-id' }} urlParams={{ test: '1' }} />,
      reactRouterDOMRoutes
    )

    expect(history.location.pathname).toEqual('/page-1/test-id')
    expect(history.location.search).toContain('test=1')
  })
})
