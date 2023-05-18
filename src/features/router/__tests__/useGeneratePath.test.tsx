import { createMemoryHistory } from 'history'
import { generateTestingRoutes, renderHookInRoutes } from './common.mocks'

const {
  reactRouterDOMRoutes,
  hooks: { useGeneratePath },
} = generateTestingRoutes()

const {
  reactRouterDOMRoutes: reactRouterDOMLocalizedRoutes,
  hooks: { useGeneratePath: useLocalizedGeneratePath },
} = generateTestingRoutes({ languages: ['it', 'en'] })

const renderUseGeneratePath = () => {
  return renderHookInRoutes(() => useGeneratePath(), reactRouterDOMRoutes)
}

const renderLocalizedUseAuthGuard = () => {
  const history = createMemoryHistory({ initialEntries: ['/it/'] })
  return renderHookInRoutes(
    () => useLocalizedGeneratePath(),
    reactRouterDOMLocalizedRoutes,
    history
  )
}

describe('useGeneratePath', () => {
  it('should generate path from routeKey', () => {
    const { result } = renderUseGeneratePath()
    const generatePath = result.current
    expect(generatePath('PAGE_1')).toBe('/page-1')
  })

  it('should generate a dynamic path from routeKey that has a dynamic route', () => {
    const { result } = renderUseGeneratePath()
    const generatePath = result.current
    expect(generatePath('DYNAMIC_PAGE_1', { id: 'test' })).toBe('/page-1/test')
  })

  it('should prefix the path with the language if the route is localized', () => {
    const { result } = renderLocalizedUseAuthGuard()
    const generatePath = result.current
    expect(generatePath('PAGE_1')).toBe('/it/page-1')
  })
})
