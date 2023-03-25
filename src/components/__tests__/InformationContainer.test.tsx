import React from 'react'
import { InformationContainer, InformationContainerSkeleton } from '../InformationContainer'
import renderer from 'react-test-renderer'

describe('InformationContainer component', () => {
  it('Renders correctly', () => {
    const tree = renderer
      .create(<InformationContainer label={'test-title'} content="information" />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('Renders the loading skeleton correctly', () => {
    const tree = renderer.create(<InformationContainerSkeleton />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('Render correctly with column direction', () => {
    const tree = renderer
      .create(
        <InformationContainer direction="column" label={'test-title'} content="information" />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('Render correctly with content as tring', () => {
    const tree = renderer
      .create(
        <InformationContainer
          label={'test-title'}
          labelDescription="label-description"
          content="information"
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('Render correctly with JSX as content', () => {
    const tree = renderer
      .create(
        <InformationContainer
          label={'test-title'}
          labelDescription="label-description"
          content={<p>information</p>}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('Render correctly with copy to clipboard button', () => {
    const tree = renderer
      .create(
        <InformationContainer
          label={'test-title'}
          copyToClipboard={{ value: 'test', tooltipTitle: 'test' }}
          content="information"
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
