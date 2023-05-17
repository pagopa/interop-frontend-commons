import { vi } from 'vitest'
import {
  generateRRDRouteObject,
  getRouteKeyFromPath,
  memoize,
  omit,
  prefixPathnameWithLang,
  removeLanguageSubpathFromPathname,
  splitPath,
} from '../router.utils'
import { generateTestingRoutes } from './common.mocks'

const {
  routes,
  components: { Redirect },
  utils: { getParentRoutes },
} = generateTestingRoutes()

describe('router.utils', () => {
  describe('generateRRDRouteObject', () => {
    it('should match the snapshot', () => {
      expect(generateRRDRouteObject(routes, Redirect)).toMatchSnapshot()
    })

    it('should match the snapshot on localized routes', () => {
      expect(
        generateRRDRouteObject(routes, Redirect, { languages: ['it', 'en'] })
      ).toMatchSnapshot()
    })
  })

  describe('getParentRoutes', () => {
    it('should return the parent routes', () => {
      const result = getParentRoutes('DYNAMIC_PAGE_2')
      expect(result).toEqual(['HOME', 'PAGE_2'])

      const result2 = getParentRoutes('HOME')
      expect(result2).toEqual([])
    })
  })

  describe('omit', () => {
    it('should omit the specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 }
      const result = omit(obj, 'a', 'c')
      expect(result).toEqual({ b: 2 })
    })
  })

  describe('splitPath', () => {
    it('should split the path', () => {
      const path = '/a/b/c/'
      const result = splitPath(path)
      expect(result).toEqual(['a', 'b', 'c'])
    })
  })

  describe('memoize', () => {
    it('should memoize the function', () => {
      const fn = vi.fn()
      const memoizedFn = memoize(fn)
      memoizedFn('test')
      memoizedFn('test')
      memoizedFn('test')
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('prefixPathnameWithLang', () => {
    it('should prefix the pathname with the lang', () => {
      const pathname = '/test'
      const lang = 'en'
      const result = prefixPathnameWithLang(pathname, lang)
      expect(result).toEqual('/en/test')
    })

    it('should prefix the pathname with the lang and the initial forward slash if it is missing', () => {
      const pathname = 'test'
      const lang = 'en'
      const result = prefixPathnameWithLang(pathname, lang)
      expect(result).toEqual('/en/test')
    })
  })

  describe('getRouteKeyFromPath', () => {
    it('should return the route key from the path', () => {
      const result = getRouteKeyFromPath('/page-1', routes)
      expect(result).toEqual('PAGE_1')
    })

    it('should return the route key from a dynamic path', () => {
      const result = getRouteKeyFromPath('/page-1/test', routes)
      expect(result).toEqual('DYNAMIC_PAGE_1')
    })

    it('should throw an error if the route key is not found', () => {
      expect(() => getRouteKeyFromPath('/unknown', routes)).toThrowError()
    })
  })

  describe('removeLanguageSubpathFromPathname', () => {
    it('should remove the language subpath from the pathname', () => {
      const pathname = '/en/page-1'
      const result = removeLanguageSubpathFromPathname(pathname, ['en', 'it'])
      expect(result).toEqual('/page-1')
    })

    it('should return the pathname if the language subpath is not found', () => {
      const pathname = '/page-1'
      const result = removeLanguageSubpathFromPathname(pathname, ['en', 'it'])
      expect(result).toEqual(pathname)
    })

    it('should return the pathname if the languages array is falsy or empty', () => {
      const pathname = '/en/page-1'
      const resultFalsy = removeLanguageSubpathFromPathname(pathname)
      const resultEmpty = removeLanguageSubpathFromPathname(pathname, [])
      expect(resultFalsy).toEqual(pathname)
      expect(resultEmpty).toEqual(pathname)
    })
  })
})
