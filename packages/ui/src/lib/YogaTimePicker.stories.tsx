import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { YogaTimePicker, YogaDay } from './YogaTimePicker'

const meta: Meta<typeof YogaTimePicker> = {
  title: 'Ulyx/YogaTimePicker',
  component: YogaTimePicker,
}
export default meta

type Story = StoryObj<typeof YogaTimePicker>

const sampleDays: YogaDay[] = [
  {
    id: 'mon',
    label: 'Monday',
    times: [
      { id: '07:00', label: '7:00 AM' },
      { id: '12:00', label: '12:00 PM', sublabel: 'Lunch Flow' },
      { id: '18:00', label: '6:00 PM' },
    ],
  },
  {
    id: 'tue',
    label: 'Tuesday',
    times: [
      { id: '06:30', label: '6:30 AM' },
      { id: '10:00', label: '10:00 AM' },
      { id: '19:30', label: '7:30 PM' },
    ],
  },
  {
    id: 'wed',
    label: 'Wednesday',
    times: [
      { id: '08:00', label: '8:00 AM' },
      { id: '16:00', label: '4:00 PM' },
      { id: '20:00', label: '8:00 PM' },
    ],
  },
]

export const Minimal: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([])
    return (
      <div data-skin="ulyxes">
        <YogaTimePicker
          days={sampleDays}
          selectedIds={selected}
          onChange={setSelected}
          minSelections={3}
          onDone={(ids) => alert(`Selected: ${ids.join(', ')}`)}
        />
      </div>
    )
  },
}
