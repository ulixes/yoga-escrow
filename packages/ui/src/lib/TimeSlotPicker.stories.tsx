import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { TimeSlotPicker } from './TimeSlotPicker'
import { Brand } from './Brand'

const meta: Meta<typeof TimeSlotPicker> = {
  title: 'Scheduling/TimeSlotPicker',
  component: TimeSlotPicker,
}
export default meta

type Story = StoryObj<typeof TimeSlotPicker>

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div style={{ display: 'grid', gap: 16 }}>
    <Brand
      title="Ulyxes"
      slogan="Yoga everywhere.. anytime.."
      subtitle="Move with breath. Find your space."
      orientation="vertical"
      size="lg"
      logoVariant="wave"
      skin="ulyxes"
    />
    {children}
  </div>
)

export const Default: Story = {
  render: (args) => {
    const [ids, setIds] = React.useState<string[]>([])
    return (
      <Layout>
        <TimeSlotPicker
          {...args}
          skin="ulyxes"
          selectedIds={ids}
          onChange={setIds}
        />
      </Layout>
    )
  },
  args: {
    days: 7,
  },
}
