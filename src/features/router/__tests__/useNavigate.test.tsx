import { createMemoryHistory } from 'history'
import { generateTestingRoutes, renderHookInRoutes } from './common.mocks'
import { expectTypeOf } from 'vitest'

const {
  routes,
  reactRouterDOMRoutes,
  hooks: { useNavigate },
} = generateTestingRoutes()

const {
  reactRouterDOMRoutes: reactRouterDOMLocalizedRoutes,
  hooks: { useNavigate: useLocalizedNavigate },
} = generateTestingRoutes({ languages: ['it', 'en'] })

const renderUseLocation = () => {
  return renderHookInRoutes(() => useNavigate(), reactRouterDOMRoutes)
}

const renderLocalizedUseLocation = () => {
  const history = createMemoryHistory({ initialEntries: ['/it/'] })
  return renderHookInRoutes(() => useLocalizedNavigate(), reactRouterDOMLocalizedRoutes, history)
}

describe('useNavigate', () => {
  it('should correctly navigate to the correct path', () => {
    const { result, history } = renderUseLocation()
    const navigate = result.current
    navigate('PAGE_1')
    expect(history.location.pathname).toBe('/page-1')
  })

  it('should correctly navigate to a dynamic path', () => {
    const { result, history } = renderUseLocation()
    const navigate = result.current
    navigate('DYNAMIC_PAGE_1', { params: { id: 'test' } })
    expect(history.location.pathname).toBe('/page-1/test')
  })

  it('should correctly navigate to the correct path (localized)', () => {
    const { result, history } = renderLocalizedUseLocation()
    const navigate = result.current
    navigate('PAGE_1')
    expect(history.location.pathname).toBe('/it/page-1')
  })

  it('should correctly navigate to a dynamic path (localized)', () => {
    const { result, history } = renderLocalizedUseLocation()
    const navigate = result.current
    navigate('DYNAMIC_PAGE_1', { params: { id: 'test' } })
    expect(history.location.pathname).toBe('/it/page-1/test')
  })

  it('should have the "to" prop typed correctly', () => {
    const { result } = renderLocalizedUseLocation()
    const navigate = result.current

    type ToProp = typeof navigate extends (to: infer T) => void ? T : never
    expectTypeOf<ToProp>().toMatchTypeOf<keyof typeof routes>()
  })
})
