import React from 'react'
import type { FiltersParams, FilterFields } from '@/features/filters/filters.types'
import { createMemoryHistory } from 'history'
import { useFilters } from '../hooks/useFilters'
import { renderHook } from '@testing-library/react'
import { TestingRouterWrapper } from '@/utils/testing.utils'
import { formatDateTime } from '../filters.utils'

const fieldMocks: FilterFields = [
  { name: 'freetext-field', type: 'freetext', label: 'Single Filter Field' },
  {
    name: 'autocomplete-multiple-field',
    type: 'autocomplete-multiple',
    options: [],
    label: 'Multiple Filter Field',
  },
  {
    name: 'autocomplete-single-field',
    type: 'autocomplete-single',
    options: [],
    label: 'Single Filter Field',
  },
  {
    name: 'date-field',
    type: 'datepicker',
    label: 'Date Filter Field',
  },
  {
    name: 'numeric-field',
    type: 'numeric',
    label: 'Numeric Filter Field',
  },
]

const searchParamsTest = {
  'autocomplete-multiple-field': JSON.stringify([
    ['Option 1', 'option-1'],
    ['Option 2', 'option-2'],
  ]),
  'autocomplete-single-field': JSON.stringify(['Option 1', 'option-1']),
  'freetext-field': 'test-value',
  'date-field': new Date().toISOString(),
  'numeric-field': '123',
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
      'freetext-field': searchParamsTest['freetext-field'],
      'autocomplete-multiple-field': searchParamsTest['autocomplete-multiple-field'],
      'autocomplete-single-field': searchParamsTest['autocomplete-single-field'],
      'date-field': searchParamsTest['date-field'],
      'numeric-field': searchParamsTest['numeric-field'],
    })

    expect(result.current.activeFilters).toEqual([
      {
        filterKey: 'freetext-field',
        label: 'test-value',
        type: 'freetext',
        value: 'test-value',
      },
      {
        filterKey: 'autocomplete-multiple-field',
        label: 'Option 1',
        type: 'autocomplete-multiple',
        value: 'option-1',
      },
      {
        filterKey: 'autocomplete-multiple-field',
        label: 'Option 2',
        type: 'autocomplete-multiple',
        value: 'option-2',
      },
      {
        filterKey: 'autocomplete-single-field',
        label: 'Option 1',
        type: 'autocomplete-single',
        value: 'option-1',
      },
      {
        filterKey: 'date-field',
        label: formatDateTime(new Date(searchParamsTest['date-field'])),
        type: 'datepicker',
        value: searchParamsTest['date-field'],
      },
      {
        filterKey: 'numeric-field',
        label: '123',
        type: 'numeric',
        value: '123',
      },
    ])

    expect(result.current.filtersParams).toEqual({
      'autocomplete-multiple-field': ['option-1', 'option-2'],
      'autocomplete-single-field': 'option-1',
      'date-field': searchParamsTest['date-field'],
      'freetext-field': 'test-value',
      'numeric-field': '123',
    })

    const dateMock = new Date()

    const newSearchParams = new URLSearchParams({
      'freetext-field': 'new-test-value',
      'autocomplete-multiple-field': JSON.stringify([['Option 1', 'option-1']]),
      'autocomplete-single-field': JSON.stringify(['Option 2', 'option-2']),
      'date-field': dateMock.toISOString(),
      'numeric-field': '456',
    }).toString()
    history.push(`/?${newSearchParams}`)

    rerender()

    expect(result.current.activeFilters).toEqual([
      {
        filterKey: 'freetext-field',
        label: 'new-test-value',
        type: 'freetext',
        value: 'new-test-value',
      },
      {
        filterKey: 'autocomplete-multiple-field',
        label: 'Option 1',
        type: 'autocomplete-multiple',
        value: 'option-1',
      },
      {
        filterKey: 'autocomplete-single-field',
        label: 'Option 2',
        type: 'autocomplete-single',
        value: 'option-2',
      },
      {
        filterKey: 'date-field',
        label: formatDateTime(dateMock),
        type: 'datepicker',
        value: dateMock.toISOString(),
      },
      {
        filterKey: 'numeric-field',
        label: '456',
        type: 'numeric',
        value: '456',
      },
    ])
    expect(result.current.filtersParams).toEqual({
      'autocomplete-multiple-field': ['option-1'],
      'autocomplete-single-field': 'option-2',
      'freetext-field': 'new-test-value',
      'date-field': dateMock.toISOString(),
      'numeric-field': '456',
    })
  })

  it('should correctly change the active filters with the returned onChangeActiveFilter function', () => {
    const { result, history } = renderUseFiltersHook(fieldMocks, {
      'freetext-field': searchParamsTest['freetext-field'],
      'autocomplete-multiple-field': searchParamsTest['autocomplete-multiple-field'],
      'autocomplete-single-field': searchParamsTest['autocomplete-single-field'],
      'date-field': searchParamsTest['date-field'],
      'numeric-field': searchParamsTest['numeric-field'],
    })

    result.current.onChangeActiveFilter('freetext', 'freetext-field', 'changed value')
    expect(history.location.search).toContain('changed+value')

    result.current.onChangeActiveFilter('autocomplete-multiple', 'autocomplete-multiple-field', [
      { label: 'Option 2', value: 'option-2' },
    ])
    expect(history.location.search).toContain(
      'autocomplete-multiple-field=%5B%5B%22Option+2%22%2C%22option-2%22%5D%5D'
    )

    result.current.onChangeActiveFilter('autocomplete-single', 'autocomplete-single-field', {
      label: 'Option 2',
      value: 'option-2',
    })
    expect(history.location.search).toContain(
      'autocomplete-single-field=%5B%22Option+2%22%2C%22option-2%22%5D'
    )

    result.current.onChangeActiveFilter('numeric', 'numeric-field', '345')
    expect(history.location.search).toContain('numeric-field=345')

    const newDate = new Date()
    result.current.onChangeActiveFilter('datepicker', 'datepicker-field', newDate)
    expect(history.location.search).toContain(
      'datepicker-field=' + encodeURIComponent(newDate.toISOString())
    )

    result.current.onChangeActiveFilter('autocomplete-multiple', 'autocomplete-multiple-field', [])
    expect(history.location.search).not.toContain('autocomplete-multiple-field=')
    result.current.onChangeActiveFilter('freetext', 'freetext-field', '')
    expect(history.location.search).not.toContain('freetext-field=')
    result.current.onChangeActiveFilter('numeric', 'numeric-field', '')
    expect(history.location.search).not.toContain('numeric-field=')
    result.current.onChangeActiveFilter('datepicker', 'datepicker-field', null)
    expect(history.location.search).not.toContain('datepicker-field=')
  })

  it('should correctly remove the active filters with the returned onRemoveActiveFilter function', () => {
    const { result, history, rerender } = renderUseFiltersHook(fieldMocks, {
      'autocomplete-multiple-field': searchParamsTest['autocomplete-multiple-field'],
      'freetext-field': searchParamsTest['freetext-field'],
    })

    result.current.onRemoveActiveFilter('freetext', 'freetext-field', 'changed value')
    expect(history.location.search).not.toContain('changed+value')
    result.current.onRemoveActiveFilter(
      'autocomplete-multiple',
      'autocomplete-multiple-field',
      'option-2'
    )
    rerender()
    expect(history.location.search).not.toContain('%5D%2C%5B%22Option+2%22%2C%22option-2%22%5D%5D')
    result.current.onRemoveActiveFilter(
      'autocomplete-multiple',
      'autocomplete-multiple-field',
      'option-1'
    )
    rerender()
    expect(history.location.search).not.toContain('autocomplete-multiple-field=')
    result.current.onRemoveActiveFilter('freetext', 'freetext-field', '')
    rerender()
    expect(history.location.search).toBe('')
  })

  it('should correctly reset the active filters with the returned onResetActiveFilters function', () => {
    const { result, history, rerender } = renderUseFiltersHook(fieldMocks, {
      'autocomplete-multiple-field': searchParamsTest['autocomplete-multiple-field'],
      'freetext-field': searchParamsTest['freetext-field'],
    })

    result.current.onResetActiveFilters()
    rerender()
    expect(history.location.search).toBe('')
  })
})
