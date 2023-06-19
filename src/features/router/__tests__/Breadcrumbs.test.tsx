import React from 'react'
import { generateTestingRoutes, renderRoutes } from './common.mocks'
import { createMemoryHistory } from 'history'
import userEvent from '@testing-library/user-event'
import { expectTypeOf } from 'vitest'

const {
  routes,
  reactRouterDOMRoutes,
  components: { Breadcrumbs },
} = generateTestingRoutes()

const {
  reactRouterDOMRoutes: reactRouterDOMLocalizedRoutes,
  components: { Breadcrumbs: LocalizedBreadcrumbs },
} = generateTestingRoutes({ languages: ['it', 'en'] })

const routeLabels = {
  HOME: 'home',
  PAGE_1: 'page-1',
  PAGE_2: 'page-2',
  DYNAMIC_PAGE_1: 'dynamic-page-1',
  DYNAMIC_PAGE_2: 'dynamic-page-2',
  REDIRECT_1: 'redirect-1',
  REDIRECT_2: 'redirect-2',
} as const

const renderBreadcrumb = (startingRoute = '/page-1/test-id') => {
  const history = createMemoryHistory()
  history.push(startingRoute)
  const screen = renderRoutes(
    <Breadcrumbs routeLabels={routeLabels} />,
    reactRouterDOMRoutes,
    history
  )
  return { ...screen, history }
}

const renderLocalizedBreadcrumb = (startingRoute = '/it/page-1/test-id') => {
  const history = createMemoryHistory()
  history.push(startingRoute)
  const screen = renderRoutes(
    <LocalizedBreadcrumbs routeLabels={routeLabels} />,
    reactRouterDOMLocalizedRoutes,
    history
  )
  return { ...screen, history }
}

describe('Breadcrumbs', () => {
  it('should match the snapshot', () => {
    const { baseElement } = renderBreadcrumb()
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (localized)', () => {
    const history = createMemoryHistory()
    history.push('/page-1/test-id')
    const { baseElement } = renderLocalizedBreadcrumb()
    expect(baseElement).toMatchSnapshot()
  })

  it('should not render if the route have less than 2 parents', () => {
    const { container } = renderBreadcrumb('/')
    expect(container).toBeEmptyDOMElement()
  })

  it('should navigate to the correct route when clicking on a breadcrumb link', async () => {
    const { getByRole, history } = renderBreadcrumb()
    const page1Link = getByRole('link', { name: 'page-1' })
    const user = userEvent.setup()
    await user.click(page1Link)
    expect(history.location.pathname).toEqual('/page-1')
    const homeLink = getByRole('link', { name: 'home' })
    await user.click(homeLink)
    expect(history.location.pathname).toEqual('/')
  })

  it('should navigate to the correct route when clicking on a breadcrumb link (localized)', async () => {
    const { getByRole, history } = renderLocalizedBreadcrumb()
    const page1Link = getByRole('link', { name: 'page-1' })
    const user = userEvent.setup()
    await user.click(page1Link)
    expect(history.location.pathname).toEqual('/it/page-1')
    const homeLink = getByRole('link', { name: 'home' })
    await user.click(homeLink)
    expect(history.location.pathname).toEqual('/it/')
  })

  it('should have the correct routeLabels type', () => {
    type RouteLabels = Parameters<typeof Breadcrumbs>['0']['routeLabels']

    expectTypeOf<RouteLabels>().toMatchTypeOf<{ [K in keyof typeof routes]: string | false }>()
  })
})
