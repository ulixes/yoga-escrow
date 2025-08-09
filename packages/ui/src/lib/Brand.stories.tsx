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
    title: 'Ulyxes',
    slogan: 'Yoga everywhere.. anytime..',
    subtitle: 'Move with breath. Find your space.',
    orientation: 'vertical',
    size: 'md',
  },
}

export const WithLogo: Story = {
  args: {
    title: 'Ulyxes',
    slogan: 'Yoga everywhere.. anytime..',
    subtitle: 'Move with breath. Find your space.',
    orientation: 'vertical',
    size: 'md',
    logo: <PlaceholderLogo />,
  },
}

export const UlyxesSkin: Story = {
  args: {
    title: 'Ulyxes',
    slogan: 'Yoga everywhere.. anytime..',
    subtitle: 'Move with breath. Find your space.',
    orientation: 'vertical',
    size: 'md',
    logo: <PlaceholderLogo />,
    skin: 'ulyxes',
  },
}

export const Hero: Story = {
  name: 'Hero (Large, Vertical)',
  args: {
    title: 'Ulyxes',
    slogan: 'Yoga everywhere.. anytime..',
    subtitle: 'Move with breath. Find your space.',
    orientation: 'vertical',
    size: 'lg',
    logo: <PlaceholderLogo />,
    skin: 'ulyxes',
  },
}
