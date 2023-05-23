import React from 'react'
import { vi } from 'vitest'
import { generateTestingRoutes, renderRoutes } from './common.mocks'
import { createMemoryHistory } from 'history'

const changeLanguageFn = vi.fn()

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'it',
      changeLanguage: changeLanguageFn,
    },
  }),
}))

afterEach(() => {
  changeLanguageFn.mockReset()
})

const { reactRouterDOMRoutes: reactRouterDOMLocalizedRoutes } = generateTestingRoutes({
  languages: ['it', 'en'],
})

describe('SyncLangWithRoute', () => {
  it('should change language if the first bit of the path is a language', () => {
    const history = createMemoryHistory({ initialEntries: ['/en/page-1/'] })
    renderRoutes(<>hello</>, reactRouterDOMLocalizedRoutes, history)

    expect(changeLanguageFn).toHaveBeenCalledWith('en')
  })

  it("should not call changeLanguage if the first bit of the path isn't a given language", () => {
    const history = createMemoryHistory({ initialEntries: ['/page-1/'] })
    renderRoutes(<>hello</>, reactRouterDOMLocalizedRoutes, history)

    expect(changeLanguageFn).not.toHaveBeenCalled()
  })
})
