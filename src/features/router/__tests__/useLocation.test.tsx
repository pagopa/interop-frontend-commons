import { createMemoryHistory } from 'history'
import { generateTestingRoutes, renderHookInRoutes } from './common.mocks'

const {
  reactRouterDOMRoutes,
  hooks: { useLocation },
} = generateTestingRoutes()

const {
  reactRouterDOMRoutes: reactRouterDOMLocalizedRoutes,
  hooks: { useLocation: useLocalizedLocation },
} = generateTestingRoutes({ languages: ['it', 'en'] })

const renderUseLocation = (initialRoute = '/') => {
  const history = createMemoryHistory({ initialEntries: [initialRoute] })
  return renderHookInRoutes(() => useLocation(), reactRouterDOMRoutes, history)
}

const renderLocalizedUseLocation = (initialRoute = '/it/') => {
  const history = createMemoryHistory({ initialEntries: [initialRoute] })
  return renderHookInRoutes(() => useLocalizedLocation(), reactRouterDOMLocalizedRoutes, history)
}

describe('useLocation', () => {
  it('should return the correct routeKey of the actual route', () => {
    const { result, history, rerender } = renderUseLocation()
    expect(result.current.routeKey).toBe('HOME')
    history.push('/page-1')
    rerender()
    expect(result.current.routeKey).toBe('PAGE_1')
  })

  it('should return the correct routeKey of the actual route when the route is dynamic', () => {
    const { result } = renderUseLocation('/page-1/test')
    expect(result.current.routeKey).toBe('DYNAMIC_PAGE_1')
  })

  it('should return the correct routeKey of the actual route when the route is localized', () => {
    const { result } = renderLocalizedUseLocation()
    expect(result.current.routeKey).toBe('HOME')
  })
})
