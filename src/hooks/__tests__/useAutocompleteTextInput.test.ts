import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import { useAutocompleteTextInput } from '../useAutocompleteTextInput'

vi.useFakeTimers()

describe('useAutocompleteTextInput hooks tests', () => {
  it('should not update the state if an input with length less than 3 is given', async () => {
    const { result } = renderHook(() => useAutocompleteTextInput())

    expect(result.current[0]).toBe('')
    vi.advanceTimersByTime(300)
    act(() => {
      result.current[1]('t')
      vi.advanceTimersByTime(300)
    })
    expect(result.current[0]).toBe('')
    act(() => {
      result.current[1]('te')
      vi.advanceTimersByTime(300)
    })
    expect(result.current[0]).toBe('')
    act(() => {
      result.current[1]('tes')
      vi.advanceTimersByTime(300)
    })
    expect(result.current[0]).toEqual('tes')
    act(() => {
      result.current[1]('test')
      vi.advanceTimersByTime(300)
    })
    expect(result.current[0]).toEqual('test')
  })
})
