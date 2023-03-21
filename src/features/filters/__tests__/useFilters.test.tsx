import React from 'react'
import type { FiltersParams, FilterFields } from '@/features/filters/filters.types'
import { createMemoryHistory } from 'history'
import { useFilters } from '../hooks/useFilters'
import { renderHook } from '@testing-library/react'
import { TestingRouterWrapper } from '@/utils/testing.utils'

const fieldMocks: FilterFields = [
  { name: 'single-field', type: 'freetext', label: 'Single Filter Field' },
  {
    name: 'multiple-field',
    type: 'autocomplete-multiple',
    options: [],
    label: 'Multiple Filter Field',
  },
]

const searchParamsTest = {
  'multiple-field': JSON.stringify([
    ['Option 1', 'option-1'],
    ['Option 2', 'option-2'],
  ]),
  'single-field': 'test-value',
}

function renderUseFiltersHook(fields: FilterFields, filtersParams: FiltersParams = {}) {
  const history = createMemoryHistory()

  const additionalSearchParams = new URLSearchParams(
    filtersParams as Record<string, string>
  ).toString()

  history.push(`/?${additionalSearchParams}`)

  return {
    ...renderHook(() => useFilters(fields), {
      wrapper: ({ children }) => (
        <TestingRouterWrapper history={history}>{children}</TestingRouterWrapper>
      ),
    }),
    history,
  }
}

describe('useFilters testing', () => {
  it('should sync the search params with the activeFilters and filtersParams property values', () => {
    const { result, history, rerender } = renderUseFiltersHook(fieldMocks, {
      'multiple-field': searchParamsTest['multiple-field'],
      'single-field': searchParamsTest['single-field'],
    })

    expect(result.current.activeFilters).toEqual([
      {
        filterKey: 'single-field',
        label: 'test-value',
        type: 'freetext',
        value: 'test-value',
      },
      {
        filterKey: 'multiple-field',
        label: 'Option 1',
        type: 'autocomplete-multiple',
        value: 'option-1',
      },
      {
        filterKey: 'multiple-field',
        label: 'Option 2',
        type: 'autocomplete-multiple',
        value: 'option-2',
      },
    ])

    expect(result.current.filtersParams).toEqual({
      'multiple-field': ['option-1', 'option-2'],
      'single-field': 'test-value',
    })

    const newSearchParams = new URLSearchParams({
      'single-field': 'new-test-value',
      'multiple-field': JSON.stringify([['Option 1', 'option-1']]),
    }).toString()
    history.push(`/?${newSearchParams}`)

    rerender()

    expect(result.current.activeFilters).toEqual([
      {
        filterKey: 'single-field',
        label: 'new-test-value',
        type: 'freetext',
        value: 'new-test-value',
      },
      {
        filterKey: 'multiple-field',
        label: 'Option 1',
        type: 'autocomplete-multiple',
        value: 'option-1',
      },
    ])
    expect(result.current.filtersParams).toEqual({
      'multiple-field': ['option-1'],
      'single-field': 'new-test-value',
    })
  })

  it('should correctly change the active filters with the returned onChangeActiveFilter function', () => {
    const { result, history } = renderUseFiltersHook(fieldMocks, {
      'multiple-field': searchParamsTest['multiple-field'],
      'single-field': searchParamsTest['single-field'],
    })

    result.current.onChangeActiveFilter('freetext', 'single-field', 'changed value')
    expect(history.location.search).toContain('changed+value')

    result.current.onChangeActiveFilter('autocomplete-multiple', 'multiple-field', [
      { label: 'Option 2', value: 'option-2' },
    ])
    expect(history.location.search).toContain(
      'multiple-field=%5B%5B%22Option+2%22%2C%22option-2%22%5D%5D'
    )

    result.current.onChangeActiveFilter('autocomplete-multiple', 'multiple-field', [])
    expect(history.location.search).not.toContain('multiple-field=')
    result.current.onChangeActiveFilter('autocomplete-multiple', 'single-field', '')
    expect(history.location.search).not.toContain('single-field=')
  })

  it('should correctly remove the active filters with the returned onRemoveActiveFilter function', () => {
    const { result, history, rerender } = renderUseFiltersHook(fieldMocks, {
      'multiple-field': searchParamsTest['multiple-field'],
      'single-field': searchParamsTest['single-field'],
    })

    result.current.onRemoveActiveFilter('freetext', 'single-field', 'changed value')
    expect(history.location.search).not.toContain('changed+value')
    result.current.onRemoveActiveFilter('autocomplete-multiple', 'multiple-field', 'option-2')
    rerender()
    expect(history.location.search).not.toContain('%5D%2C%5B%22Option+2%22%2C%22option-2%22%5D%5D')
    result.current.onRemoveActiveFilter('autocomplete-multiple', 'multiple-field', 'option-1')
    rerender()
    expect(history.location.search).not.toContain('multiple-field=')
    result.current.onRemoveActiveFilter('freetext', 'single-field', '')
    rerender()
    expect(history.location.search).toBe('')
  })

  it('should correctly reset the active filters with the returned onResetActiveFilters function', () => {
    const { result, history, rerender } = renderUseFiltersHook(fieldMocks, {
      'multiple-field': searchParamsTest['multiple-field'],
      'single-field': searchParamsTest['single-field'],
    })

    result.current.onResetActiveFilters()
    rerender()
    expect(history.location.search).toBe('')
  })
})
