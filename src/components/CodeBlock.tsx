import React from 'react'
import { Box, Paper, type BoxProps } from '@mui/material'
import { CopyToClipboardButton } from '@pagopa/mui-italia'

interface CodeBlockProps extends BoxProps {
  /**
   * The code to display
   * If the code is an object, it will be stringified with 2 spaces indentation
   */
  code: unknown
  /**
   * If true, the copy button will be hidden
   * @default false
   * */
  hideCopyButton?: boolean
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, hideCopyButton, ...boxProps }) => {
  const stringifiedCode = typeof code === 'object' ? JSON.stringify(code, null, 2) : String(code)
  return (
    <Box {...boxProps}>
      <Paper
        sx={{
          p: 2,
          position: 'relative',
          backgroundColor: 'background.default',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxHeight: 520,
          overflowY: 'auto',
          overflowX: 'hidden',
          fontSize: 'small',
        }}
      >
        {!hideCopyButton && (
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <CopyToClipboardButton value={stringifiedCode} />
          </Box>
        )}
        <code>{stringifiedCode}</code>
      </Paper>
    </Box>
  )
}
