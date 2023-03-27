import React from 'react'
import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { InformationContainer as _InformationContainer } from '../InformationContainer'
import { Container } from '@mui/material'

export default {
  title: 'Components/InformationContainer',
  component: _InformationContainer,
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
      defaultValue: 'test',
    },
    labelDescription: {
      control: {
        type: 'text',
      },
      defaultValue: 'Description test',
    },
    content: {
      control: {
        type: 'text',
      },
      defaultValue: 'value',
    },
  },
} as ComponentMeta<typeof _InformationContainer>

const Template: ComponentStory<typeof _InformationContainer> = (args) => {
  return (
    <Container sx={{ p: 8, bgcolor: 'white' }}>
      <_InformationContainer {...args} />
    </Container>
  )
}

export const DirectionRow = Template.bind({})

export const DirectionColumn = Template.bind({})
DirectionColumn.args = {
  direction: 'column',
}

export const WithCopyToClipboardButton = Template.bind({})
WithCopyToClipboardButton.args = {
  copyToClipboard: {
    value: 'test',
  },
}
