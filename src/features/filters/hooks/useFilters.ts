import React from 'react'
import type {
  FilterFields,
  FilterOption,
  FiltersHandler,
  FiltersHandlers,
  FiltersParams,
} from '../filters.types'
import { mapSearchParamsToActiveFiltersAndFilterParams } from '../filters.utils'
import { useNavigate, useSearch } from '@tanstack/react-router'

/**
 * @description
 * This hook is used to manage the filters state keeping it in sync with the url params.
 * @param fields - The filters fields
 * @returns The filters params and the handlers to pass to the `Filter` component.
 * @example
 * const { filterParams, ...handlers } = useFilters([
 *  {
 *     name: 'name',
 *     type: 'freetext',
 *     label: 'Name',
 *  },
 *  {
 *     name: 'category',
 *     type: 'autocomplete-multiple',
 *     label: 'Category',
 *     options: [
 *       { label: 'Category 1', value: 'category-1' },
 *       { label: 'Category 2', value: 'category-2' },
 *       { label: 'Category 3', value: 'category-3' },
 *     ],
 *  },
 *  {
 *     name: 'date',
 *     type: 'datepicker',
 *     label: 'Date',
 *  },
 *  {
 *     name: 'price',
 *     type: 'numeric',
 *     label: 'Price',
 *  },
 *  {
 *     name: 'status',
 *     type: 'autocomplete-single',
 *     label: 'Status',
 *     options: [
 *       { label: 'Status 1', value: 'status-1' },
 *       { label: 'Status 2', value: 'status-2' },
 *       { label: 'Status 3', value: 'status-3' },
 *     ],
 *  },
 * ])
 *
 * return (
 *    <Filter {...handlers} />
 * )
 */
export function useFilters<TFiltersParams extends FiltersParams>(
  fields: FilterFields<Extract<keyof TFiltersParams, string>>
): FiltersHandlers & { filtersParams: TFiltersParams } {
  const navigate = useNavigate()
  const searchParams = useSearch({ strict: false })

  const onChangeActiveFilter = React.useCallback<FiltersHandler>(
    (type, filterKey, value) => {
      navigate({
        search: (searchParams: Record<string, any>) => {
          let shouldBeRemoved = false
          if (type === 'datepicker' && value === null) {
            shouldBeRemoved = true
          }
          if (
            ['freetext', 'autocomplete-multiple', 'numeric'].includes(type) &&
            (value as string | Array<FilterOption>).length === 0
          ) {
            shouldBeRemoved = true
          }
          if (shouldBeRemoved) {
            return { ...searchParams, [filterKey]: undefined }
          }

          return { ...searchParams, [filterKey]: value, offset: undefined }
        },
        replace: true,
      })
    },
    [navigate]
  )

  const onRemoveActiveFilter = React.useCallback<FiltersHandler>(
    (type, filterKey, value) => {
      navigate({
        search: (searchParams: Record<string, any>) => {
          switch (type) {
            case 'freetext':
            case 'numeric':
            case 'datepicker':
            case 'autocomplete-single':
              return { ...searchParams, [filterKey]: undefined, offset: undefined }
            case 'autocomplete-multiple':
              const urlParamsValue = searchParams[filterKey]
              if (urlParamsValue) {
                const filteredValues = urlParamsValue.filter(
                  (option: FilterOption) => option.value !== value
                )
                return {
                  ...searchParams,
                  [filterKey]: filteredValues.length === 0 ? undefined : filteredValues,
                  offset: undefined,
                }
              }
          }
          return searchParams
        },
        replace: true,
      })
    },
    [navigate]
  )

  const onResetActiveFilters = React.useCallback(() => {
    navigate({
      search: (searchParams: Record<string, any>) => {
        const paramKeys = Object.keys(searchParams)
        paramKeys.forEach((paramKey) => {
          // Only delete the params that are related to filters
          const isFilterKey = fields.some((field) => field.name === paramKey)
          if (isFilterKey) {
            delete searchParams[paramKey]
          }
        })
        return searchParams
      },
      replace: true,
    })
  }, [navigate, fields])

  const { activeFilters, filtersParams } = mapSearchParamsToActiveFiltersAndFilterParams(
    searchParams,
    fields
  )

  return {
    fields,
    filtersParams: filtersParams as TFiltersParams,
    activeFilters,
    onResetActiveFilters,
    onChangeActiveFilter,
    onRemoveActiveFilter,
  }
}
