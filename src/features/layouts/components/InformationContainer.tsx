import React from 'react'
import { Box, Typography, Stack, Divider, Skeleton } from '@mui/material'
import type { StackProps } from '@mui/material'
import { CopyToClipboardButton } from '@pagopa/mui-italia'
import type { CopyToClipboardProps } from '@pagopa/mui-italia'

export interface InformationContainerProps extends Omit<StackProps, 'children'> {
  label: string
  labelDescription?: string
  content: JSX.Element | string
  copyToClipboard?: CopyToClipboardProps
}

export function InformationContainer({
  label,
  labelDescription,
  copyToClipboard,
  direction = 'row',
  content,
  ...props
}: InformationContainerProps) {
  return (
    <Stack spacing={direction === 'column' ? 0 : 4} direction={direction} {...props}>
      <Box sx={{ flexShrink: 0, maxWidth: direction === 'column' ? 'none' : '200px', flex: 1 }}>
        <Typography variant="body2">{label}</Typography>
        {labelDescription && (
          <>
            <Divider sx={{ my: 0.5 }} />
            <Typography color="text.secondary" sx={{ display: 'inline-block' }} variant="caption">
              {labelDescription}
            </Typography>
          </>
        )}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          component={typeof content === 'string' ? 'p' : 'div'}
          variant="body2"
          fontWeight={600}
        >
          {content}
          {copyToClipboard && <CopyToClipboardButton {...copyToClipboard} />}
        </Typography>
      </Box>
    </Stack>
  )
}

export const InformationContainerSkeleton: React.FC = () => {
  return (
    <Stack spacing={4} direction="row">
      <Box sx={{ flexShrink: 0, maxWidth: '200px', flex: 1 }}>
        <Skeleton />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Skeleton />
        <Skeleton />
      </Box>
    </Stack>
  )
}
