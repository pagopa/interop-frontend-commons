import React from 'react'
import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { CodeBlock as _CodeBlock } from '../CodeBlock'
import { Container } from '@mui/material'

export default {
  title: 'Components/CodeBlock',
  component: _CodeBlock,
  argTypes: {
    code: {
      control: {
        type: 'text',
      },
      defaultValue: {
        value: 'test',
      },
    },
  },
} as ComponentMeta<typeof _CodeBlock>

export const CodeBlock: ComponentStory<typeof _CodeBlock> = (args) => (
  <Container sx={{ p: 8, bgcolor: 'white' }}>
    <_CodeBlock {...args} />
  </Container>
)
