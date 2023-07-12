import { deepmerge } from '@mui/utils'
import { createTheme } from '@mui/material'
import { theme as muiItaliaTheme } from '@pagopa/mui-italia'

declare module '@mui/material/styles' {
  interface TypographyVariants {
    label: React.CSSProperties
  }

  interface TypographyVariantsOptions {
    label?: React.CSSProperties
  }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    label: true
  }
}

/**
 * It is based on the `@pagopa/mui-italia` theme.
 * It overrides some of the default values.
 */
export const theme = createTheme(
  deepmerge(
    {
      typography: {
        label: {
          fontSize: '16px',
          fontWeight: 600,
        },
      },
      components: {
        MuiTooltip: { defaultProps: { placement: 'top' } },
        MuiChip: { defaultProps: { size: 'small' } },
        MuiTextField: {
          styleOverrides: { root: { width: '100%' } },
          defaultProps: { variant: 'outlined' },
        },
        MuiTabPanel: {
          styleOverrides: { root: { paddingRight: 0, paddingLeft: 0 } },
        },
        MuiTypography: {
          styleOverrides: { root: { wordBreak: 'break-word' } },
        },
        MuiDialog: {
          styleOverrides: {
            paper: {
              paddingRight: 32,
              paddingLeft: 32,
              paddingTop: 24,
              paddingBottom: 24,
            },
          },
        },
        MuiDialogContent: {
          styleOverrides: {
            root: {
              paddingRight: 0,
              paddingLeft: 0,
            },
          },
        },
        MuiDialogTitle: {
          styleOverrides: {
            root: {
              paddingLeft: 0,
              paddingRight: 0,
            },
          },
        },
        MuiDialogActions: {
          styleOverrides: {
            root: {
              paddingLeft: 0,
              paddingRight: 0,
            },
          },
        },
      },
    },
    muiItaliaTheme
  )
)

export type InteropTheme = typeof theme
