import React from 'react'
import { Spinner } from '../Spinner'
import renderer from 'react-test-renderer'

describe('Spinner component', () => {
  it('Renders correctly with label and column direction', () => {
    const tree = renderer.create(<Spinner label={'test-title'} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('Renders correctly without label and column direction', () => {
    const tree = renderer.create(<Spinner />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('Renders correctly with label and row direction', () => {
    const tree = renderer.create(<Spinner direction="row" label={'test-title'} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('Renders correctly without label and row direction', () => {
    const tree = renderer.create(<Spinner direction="row" />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
