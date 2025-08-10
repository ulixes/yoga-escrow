import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { LocationPicker } from './LocationPicker'

const meta: Meta<typeof LocationPicker> = {
  title: 'Ulyx/LocationPicker',
  component: LocationPicker,
}
export default meta

type Story = StoryObj<typeof LocationPicker>

export const GeorgiaTbilisi: Story = {
  render: () => {
    const [loc, setLoc] = useState<any>(null)
    return (
      <div data-skin="ulyxes">
        <LocationPicker
          value={loc}
          onChange={setLoc}
          onDone={(l) => alert(`${l.country}, ${l.city} — ${l.specificLocation}`)}
        />
      </div>
    )
  },
}
