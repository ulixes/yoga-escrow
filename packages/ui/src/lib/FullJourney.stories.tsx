import type { Meta, StoryObj } from '@storybook/react'
import React, { useMemo, useState } from 'react'
import { FullJourney } from './FullJourney'
import { YogaTypeItem } from './YogaTypePicker'
import { YogaDay, YogaTimeItem } from './YogaTimeBlocksPicker'

const meta: Meta<typeof FullJourney> = {
  title: 'Ulyx/FullJourney',
  component: FullJourney,
}
export default meta

type Story = StoryObj<typeof FullJourney>

function toLabel(hhmm: string): string {
  const [h, m] = hhmm.split(':').map((x) => parseInt(x, 10))
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

function rangeTimes(start: string, end: string, stepMin = 30): string[] {
  const toMin = (s: string) => { const [hh, mm] = s.split(':').map((x) => parseInt(x, 10)); return hh * 60 + mm }
  const pad = (n: number) => (n < 10 ? `0${n}` : String(n))
  const res: string[] = []
  for (let t = toMin(start); t <= toMin(end); t += stepMin) {
    const hh = Math.floor(t / 60)
    const mm = t % 60
    res.push(`${pad(hh)}:${pad(mm)}`)
  }
  return res
}

function makeItems(times: string[], peakAt?: string): YogaTimeItem[] {
  return times.map((t) => ({ id: t, label: toLabel(t), sublabel: peakAt === t ? 'Peak' : undefined }))
}

const EARLY = rangeTimes('05:30', '07:00')
const MID_MORNING = rangeTimes('09:00', '11:00')
const LUNCH = rangeTimes('12:00', '13:00')
const EVENING_FULL = rangeTimes('17:00', '20:00')
const EVENING_SHORT = rangeTimes('17:00', '18:00')

const days: YogaDay[] = [
  { id: 'mon', label: 'Monday', times: [
    ...makeItems(EARLY),
    ...makeItems(MID_MORNING),
    ...makeItems(LUNCH),
    ...makeItems(EVENING_FULL, '18:00'),
  ]},
  { id: 'tue', label: 'Tuesday', times: [
    ...makeItems(EARLY),
    ...makeItems(MID_MORNING),
    ...makeItems(LUNCH),
    ...makeItems(EVENING_FULL, '18:00'),
  ]},
  { id: 'wed', label: 'Wednesday', times: [
    ...makeItems(EARLY),
    ...makeItems(MID_MORNING),
    ...makeItems(LUNCH),
    ...makeItems(EVENING_FULL, '18:00'),
  ]},
  { id: 'thu', label: 'Thursday', times: [
    ...makeItems(EARLY),
    ...makeItems(MID_MORNING),
    ...makeItems(LUNCH),
    ...makeItems(EVENING_SHORT, '18:00'),
  ]},
  { id: 'fri', label: 'Friday', times: [
    ...makeItems(EARLY),
    ...makeItems(MID_MORNING),
    ...makeItems(LUNCH),
    ...makeItems(EVENING_SHORT, '17:30'),
  ]},
  { id: 'sat', label: 'Saturday', times: makeItems(MID_MORNING) },
  { id: 'sun', label: 'Sunday', times: [
    ...makeItems(rangeTimes('09:30', '11:00')),
    ...makeItems(['13:00', '14:00', '15:00'])
  ]},
]

const yogaTypes: YogaTypeItem[] = [
  { id: 'vinyasa', name: 'Vinyasa', tagline: 'Flow with breath', personas: ['runner','traveler','dancer'], benefits: {
    runner: ['Build heat', 'Mobility for stride', 'Core stability'],
    traveler: ['Shake off jet lag', 'Improve circulation', 'Clear mind'],
    dancer: ['Fluidity & balance', 'Expressive flow'],
  }},
  { id: 'yin', name: 'Yin', tagline: 'Deep stretch', personas: ['runner','traveler'], benefits: {
    runner: ['Post-run recovery', 'Hip opening'],
    traveler: ['Reset nervous system', 'Gentle decompression'],
    dancer: ['Release fascia'],
  }},
  { id: 'hatha', name: 'Hatha', tagline: 'Foundational & calm', personas: ['runner','traveler','dancer'], benefits: {
    runner: ['Steady strength'],
    traveler: ['Grounding breath'],
    dancer: ['Alignment & control'],
  }},
]

export const Flow: Story = {
  render: () => {
    const [result, setResult] = useState<any>(null)
    return (
      <div data-skin="ulyxes" style={{ maxWidth: 720 }}>
        <FullJourney
          yogaTypes={yogaTypes}
          yogaTypePersonas={['runner','traveler','dancer']}
          days={days}
          defaultPersona="Traveler"
          locationProps={{ country: 'Georgia', city: 'Tbilisi', options: ['Vake Park','Lisi Lake','Turtle Lake'] }}
          onSubmit={(r) => { setResult(r); console.log(r) }}
        />
      </div>
    )
  },
}
