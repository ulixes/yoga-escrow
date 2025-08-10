import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { YogaTimePicker, YogaDay, YogaTimeItem } from './YogaTimePicker'

const meta: Meta<typeof YogaTimePicker> = {
  title: 'Ulyx/YogaTimePicker',
  component: YogaTimePicker,
}
export default meta

type Story = StoryObj<typeof YogaTimePicker>

function toLabel(hhmm: string): string {
  const [h, m] = hhmm.split(':').map((x) => parseInt(x, 10))
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

function makeItems(times: string[], peakAt?: string): YogaTimeItem[] {
  return times.map((t) => ({ id: t, label: toLabel(t), sublabel: peakAt === t ? 'Peak' : undefined }))
}

function rangeTimes(start: string, end: string, stepMin = 30): string[] {
  const toMin = (s: string) => {
    const [hh, mm] = s.split(':').map((x) => parseInt(x, 10))
    return hh * 60 + mm
  }
  const pad = (n: number) => (n < 10 ? `0${n}` : String(n))
  const res: string[] = []
  for (let t = toMin(start); t <= toMin(end); t += stepMin) {
    const hh = Math.floor(t / 60)
    const mm = t % 60
    res.push(`${pad(hh)}:${pad(mm)}`)
  }
  return res
}

// Windows by trend
const EARLY = rangeTimes('05:30', '07:00')
const MID_MORNING = rangeTimes('09:00', '11:00')
const LUNCH = rangeTimes('12:00', '13:00')
const EVENING_FULL = rangeTimes('17:00', '20:00')
const EVENING_SHORT = rangeTimes('17:00', '18:00')

const sampleDays: YogaDay[] = [
  // Monday – High, Evenings (peak 6–7 PM) + keep other windows
  {
    id: 'mon',
    label: 'Monday',
    times: [
      ...makeItems(EARLY),
      ...makeItems(MID_MORNING),
      ...makeItems(LUNCH),
      ...makeItems(EVENING_FULL, '18:00'),
    ],
  },
  // Tuesday – High, Evenings (peak 6–7 PM)
  {
    id: 'tue',
    label: 'Tuesday',
    times: [
      ...makeItems(EARLY),
      ...makeItems(MID_MORNING),
      ...makeItems(LUNCH),
      ...makeItems(EVENING_FULL, '18:00'),
    ],
  },
  // Wednesday – High, Evenings (peak 6–7 PM)
  {
    id: 'wed',
    label: 'Wednesday',
    times: [
      ...makeItems(EARLY),
      ...makeItems(MID_MORNING),
      ...makeItems(LUNCH),
      ...makeItems(EVENING_FULL, '18:00'),
    ],
  },
  // Thursday – Medium, Evenings (5–6 PM)
  {
    id: 'thu',
    label: 'Thursday',
    times: [
      ...makeItems(EARLY),
      ...makeItems(MID_MORNING),
      ...makeItems(LUNCH),
      ...makeItems(EVENING_SHORT, '18:00'),
    ],
  },
  // Friday – Low-Medium, earlier evenings (5–6 PM)
  {
    id: 'fri',
    label: 'Friday',
    times: [
      ...makeItems(EARLY),
      ...makeItems(MID_MORNING),
      ...makeItems(LUNCH),
      ...makeItems(EVENING_SHORT, '17:30'),
    ],
  },
  // Saturday – High, Mornings (9–11 AM)
  { id: 'sat', label: 'Saturday', times: makeItems(MID_MORNING) },
  // Sunday – Medium, Mornings or Afternoons
  {
    id: 'sun',
    label: 'Sunday',
    times: [
      ...makeItems(rangeTimes('09:30', '11:00')),
      ...makeItems(['13:00', '14:00', '15:00']),
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
