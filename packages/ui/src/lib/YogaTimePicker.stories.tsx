import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { YogaTimePicker, YogaDay } from './YogaTimePicker'

const meta: Meta<typeof YogaTimePicker> = {
  title: 'Ulyx/YogaTimePicker',
  component: YogaTimePicker,
}
export default meta

type Story = StoryObj<typeof YogaTimePicker>

const midMorning = () => ([
  { id: '09:00', label: '9:00 AM' },
  { id: '09:30', label: '9:30 AM' },
  { id: '10:00', label: '10:00 AM' },
  { id: '10:30', label: '10:30 AM' },
  { id: '11:00', label: '11:00 AM' },
])

const sampleDays: YogaDay[] = [
  { id: 'mon', label: 'Monday', times: midMorning() },
  { id: 'tue', label: 'Tuesday', times: midMorning() },
  { id: 'wed', label: 'Wednesday', times: midMorning() },
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
