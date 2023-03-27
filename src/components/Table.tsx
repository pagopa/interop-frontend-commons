import React from 'react'
import {
  TableContainer,
  Table as MUITable,
  TableBody,
  TableHead,
  TableRow as MUITableRow,
  TableCell,
  Alert,
} from '@mui/material'
import { getLocalizedValue } from '@/utils/common.utils'

export interface TableProps {
  children: React.ReactNode
  /**
   * The labels for the table's header, the length of this array will be the number of columns.
   * */
  headLabels: Array<string>
  /**
   * If true, the table will display a message saying that the current search returned no results.
   * The message will be localized.
   */
  isEmpty?: boolean
  /**
   * The message to display when the current search returned no results.
   * @default 'La ricerca corrente non ha prodotto risultati' (it)
   * @default 'Your current search returned no results' (en)
   * */
  noDataLabel?: string
}

export const Table: React.FC<TableProps> = ({ children, noDataLabel, headLabels, isEmpty }) => {
  const defaultNoDataLabel = getLocalizedValue({
    it: 'La ricerca corrente non ha prodotto risultati',
    en: 'Your current search returned no results',
  })

  return (
    <TableContainer sx={{ borderRadius: 1 }}>
      <MUITable>
        <TableHead sx={{ bgcolor: 'background.default' }}>
          <MUITableRow>
            {headLabels.map((item, i) => (
              <TableCell key={i}>{item}</TableCell>
            ))}
          </MUITableRow>
        </TableHead>
        <TableBody sx={{ bgcolor: 'background.paper' }}>
          {children}
          {isEmpty && (
            <MUITableRow>
              <TableCell colSpan={headLabels.length} sx={{ p: 0 }}>
                <Alert severity="info">{noDataLabel ?? defaultNoDataLabel}</Alert>
              </TableCell>
            </MUITableRow>
          )}
        </TableBody>
      </MUITable>
    </TableContainer>
  )
}
