import React from 'react'
import { Pagination as MUIPagination, Stack, type StackProps, type SxProps } from '@mui/material'
import type { InteropTheme } from '@/theme'

export interface PaginationProps extends StackProps {
  totalPages: number
  pageNum: number
  sx?: SxProps<InteropTheme>

  onPageChange: (numPage: number) => void
}

/**
 * Renders a pagination component, here should be passed the `paginationProps` property returned from the `usePagination` hook.
 */
export const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  onPageChange,
  pageNum,
  sx,
  ...stackProps
}) => {
  const totalPagesRef = React.useRef(totalPages)

  if (totalPages !== 0 && totalPagesRef.current !== totalPages) {
    totalPagesRef.current = totalPages
  }

  const presistedTotalPages = totalPages || totalPagesRef.current

  if (presistedTotalPages <= 1) return null
  return (
    <Stack
      sx={{ mt: 2, ...sx }}
      direction="row"
      justifyContent="end"
      alignItems="center"
      {...stackProps}
    >
      <MUIPagination
        color="primary"
        page={pageNum}
        count={presistedTotalPages}
        onChange={(_, page) => onPageChange(page)}
      />
    </Stack>
  )
}
