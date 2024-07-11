import React from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'

/**
 * @description
 * This hook is used to manage the pagination state keeping it in sync with the url params.
 * @param options - An object with a `limit` property used to calculate the current page number.
 * @returns The pagination params, pagination props to be passed to the `Pagination` component and a function to get the total page count.
 * @example
 * const {
 *   paginationParams,
 *   paginationProps,
 *   getTotalPageCount
 * } = usePagination({ limit: 10 })
 *
 * const totalPages = getTotalPageCount(response.totalCount)
 *
 * return (
 *   <Pagination {...paginationProps} totalPages={totalPages} />
 * )
 *
 */
export function usePagination(options: { limit: number }) {
  const { offset: paramOffset } = useSearch({ strict: false })
  const navigate = useNavigate()

  const offset = paramOffset ?? 0
  const limit = options.limit

  const pageNum = Math.ceil(offset / limit) + 1

  const handlePageChange = React.useCallback(
    (newPage: number) => {
      if (newPage < 1) {
        throw new Error(`Number of page ${newPage} is not valid`)
      }
      const newOffset = (newPage - 1) * limit
      navigate({
        search: (prev: any) => ({ ...prev, offset: newOffset <= 0 ? undefined : newOffset }),
        resetScroll: true,
        replace: true,
      })
    },
    [limit, navigate]
  )

  const getTotalPageCount = React.useCallback(
    (totalCount: number | undefined) => {
      return Math.ceil((totalCount ?? 0) / limit)
    },
    [limit]
  )

  const paginationProps = {
    pageNum,
    onPageChange: handlePageChange,
  }

  const paginationParams = { limit, offset }

  return {
    paginationParams,
    paginationProps,
    getTotalPageCount,
  }
}
