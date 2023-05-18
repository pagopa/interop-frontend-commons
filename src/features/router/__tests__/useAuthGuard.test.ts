import { createMemoryHistory } from 'history'
import { renderHookInRoutes, generateTestingRoutes } from './common.mocks'

const {
  reactRouterDOMRoutes,
  hooks: { useAuthGuard },
} = generateTestingRoutes()

const renderUseAuthGuard = (route = '/') => {
  const history = createMemoryHistory({ initialEntries: [route] })
  return renderHookInRoutes(() => useAuthGuard(), reactRouterDOMRoutes, history)
}

describe('useAuthGuard', () => {
  it('should return isPublic, authLevels and isUserAuthorized', () => {
    const { result } = renderUseAuthGuard('/')

    expect(result.current).toEqual({
      isPublic: true,
      authLevels: ['user', 'admin'],
      isUserAuthorized: expect.any(Function),
    })
  })

  describe('isUserAuthorized', () => {
    it('should return true if the route is public', () => {
      const { result } = renderUseAuthGuard('/page-1/test')

      expect(result.current.isUserAuthorized('user')).toEqual(true)
    })

    it('should return true if the user has the required auth level', () => {
      const { result } = renderUseAuthGuard('/page-2')

      expect(result.current.isUserAuthorized('user')).toEqual(true)
    })

    it('should return false if the user does not have the required auth level', () => {
      const { result } = renderUseAuthGuard('/page-2')

      expect(result.current.isUserAuthorized(['admin'])).toEqual(false)
    })
  })
})
