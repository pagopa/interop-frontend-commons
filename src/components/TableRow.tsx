import React from 'react'
import { TableRow as MUITableRow, TableCell, Typography } from '@mui/material'

type Cell = string | JSX.Element

export interface TableRowProps {
  /**
   * The content to display in the last column of the table.
   * Here you can pass a button or a link. It will be aligned to the right.
   * */
  children?: React.ReactNode
  /**
   * The data to display in the table's cells.
   * If the cell contains a string, it will be wrapped in a Typography component.
   * If the cell contains a JSX.Element, it will be rendered as is.
   *
   * **IMPORTANT: remember to pass a key to the cell if it contains a JSX.Element.**
   */
  cellData: Array<Cell>
}

export const TableRow: React.FC<TableRowProps> = ({ cellData, children }) => {
  return (
    <MUITableRow sx={{ bgcolor: 'common.white' }}>
      {cellData.map((cell, i) => {
        return (
          <TableCell key={i} sx={{ py: 2 }}>
            {typeof cell === 'string' ? (
              <Typography component="span" sx={{ display: 'inline-block' }} variant="body2">
                {cell}
              </Typography>
            ) : (
              cell
            )}
          </TableCell>
        )
      })}
      {children && (
        <TableCell sx={{ minWidth: '15rem' }} align="right">
          {children}
        </TableCell>
      )}
    </MUITableRow>
  )
}
