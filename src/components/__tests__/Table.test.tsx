import React from 'react'
import { render } from '@testing-library/react'
import { Button, Chip } from '@mui/material'
import { TableRow } from '../TableRow'
import { Table } from '../Table'

const tableInputs = {
  standard: {
    headLabels: ['c1', 'c2', 'c3', 'c4'],
    children: (
      <>
        <TableRow cellData={['r1c1', 'ric2', 'r1c3', <Chip key="r1c4" label="r1c4" />]}>
          <Button>r1c4</Button>
        </TableRow>
        <TableRow cellData={['r2c1', 'r2c2', 'r2c3', <Chip key="r2c4" label="r2c4" />]}>
          <Button>r2c4</Button>
        </TableRow>
        <TableRow cellData={['r3c1', 'r3c2', 'r3c3', <Chip key="r3c4" label="r3c4" />]}>
          <Button>r3c4</Button>
        </TableRow>
      </>
    ),
  },
  emptyState: {
    headLabels: ['c1', 'c2', 'c3', 'c4'],
    children: <React.Fragment />,
    isEmpty: true,
    noDataLabel: 'noDataLabel',
  },
}

describe("Checks that Table snapshots didn't change", () => {
  it('renders a Table with 2 head labels and 2 rows', () => {
    const table = render(<Table {...tableInputs.standard}>{tableInputs.standard.children}</Table>)

    expect(table).toMatchSnapshot()
  })

  it('renders Table empty state', () => {
    const table = render(<Table {...tableInputs.emptyState}>{tableInputs.standard.children}</Table>)

    expect(table).toMatchSnapshot()
  })
})
