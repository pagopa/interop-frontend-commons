import React from 'react'
import { render } from '@testing-library/react'
import { NumericFilterField } from '../components/NumericFilterField'
import type { NumericFilterFieldOptions } from '../filters.types'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'

const fieldProps: NumericFilterFieldOptions = {
  type: 'numeric',
  label: 'Test',
  name: 'test',
}

const TestNumericFilterField = ({
  fn,
  ...overrideFilterProps
}: Partial<NumericFilterFieldOptions> & { fn?: ReturnType<typeof vi.fn> }) => {
  const [value, setValue] = React.useState<string>('')

  return (
    <NumericFilterField
      value={value}
      field={{ ...fieldProps, ...overrideFilterProps }}
      onFieldsValuesChange={(_, value) => setValue(value as string)}
      onChangeActiveFilter={fn ?? vi.fn()}
    />
  )
}

describe('NumericFilterField testing', () => {
  it('the value of active filters is kept between the min and max numeric filter field options boundary', async () => {
    const user = userEvent.setup()
    const onChangeActiveFilterSpy = vi.fn()
    const MAX = 20
    const MIN = 10
    const screen = render(
      <TestNumericFilterField min={MIN} max={MAX} fn={onChangeActiveFilterSpy} />
    )

    const input = screen.getByLabelText('Test')
    await user.type(input, '1{enter}')
    expect(onChangeActiveFilterSpy).toBeCalledWith('numeric', 'test', MIN.toString())
    await user.type(input, '999')
    await user.click(screen.getByRole('button'))
    expect(onChangeActiveFilterSpy).toBeCalledWith('numeric', 'test', MAX.toString())
    await user.type(input, '15')
    await user.click(screen.getByRole('button'))
    expect(onChangeActiveFilterSpy).toBeCalledWith('numeric', 'test', '15')
  })
})
