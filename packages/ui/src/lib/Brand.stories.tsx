import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Brand } from './Brand'

const meta: Meta<typeof Brand> = {
  title: 'Brand/LogoAndSlogan',
  component: Brand,
  argTypes: {
    skin: { control: 'text' },
    slogan: { control: 'text' },
  },
}

export default meta

type Story = StoryObj<typeof Brand>

const PlaceholderLogo = () => (
  <div
    className="yui-brand__glyph"
    aria-hidden
    style={{
      width: 28,
      height: 28,
      borderRadius: '50%',
      border: '2px solid currentColor',
      display: 'inline-block',
    }}
  />
)

export const Default: Story = {
  args: {
    slogan: 'Ulyxes. Yoga every… anytime.',
  },
}

export const WithLogo: Story = {
  args: {
    slogan: 'Ulyxes. Yoga every… anytime.',
    logo: <PlaceholderLogo />,
  },
}

export const UlyxesSkin: Story = {
  args: {
    slogan: 'Ulyxes. Yoga every… anytime.',
    logo: <PlaceholderLogo />,
    skin: 'ulyxes',
  },
}
