import React from 'react'
import { CircularProgress, Stack, type StackProps, type SxProps, Typography } from '@mui/material'

type SpinnerProps = {
  /**
   * The label of the spinner.
   */
  label?: string | null
  /**
   * The direction of the spinner and label.
   * @default 'column'
   */
  direction?: StackProps['direction']
  /**
   * The sx props of the spinner. It is used to customize the style of the Stack component that wraps the spinner and the label.
   * */
  sx?: SxProps
}

export function Spinner({ label, direction = 'column', sx }: SpinnerProps) {
  return (
    <Stack sx={sx} direction={direction} alignItems="center" justifyContent="center" spacing={2}>
      <CircularProgress />
      {label && (
        <Typography component="p" variant="body2" fontWeight={700} color="primary" sx={{ mb: 0 }}>
          {label}
        </Typography>
      )}
    </Stack>
  )
}
