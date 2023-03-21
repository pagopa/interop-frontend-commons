import React from 'react'
import { Pagination as MUIPagination, Stack, type StackProps, type SxProps } from '@mui/material'
import type { InteropTheme } from '@/theme'

export interface PaginationProps extends StackProps {
  totalPages: number
  pageNum: number
  sx?: SxProps<InteropTheme>

  onPageChange: (numPage: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  onPageChange,
  pageNum,
  sx,
  ...stackProps
}) => {
  if (totalPages <= 1) return null
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
        count={totalPages}
        onChange={(_, page) => onPageChange(page)}
      />
    </Stack>
  )
}
