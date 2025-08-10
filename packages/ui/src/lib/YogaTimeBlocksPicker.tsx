import React from 'react'

export type YogaTimeItem = {
  id: string // HH:mm
  label: string
  sublabel?: string
}

export type YogaDay = {
  id: string
  label: string
  times: YogaTimeItem[]
}

export type Persona = 'runner' | 'traveler' | 'dancer' | string

export type YogaTimeBlocksPickerProps = {
  days: YogaDay[]
  selectedIds: string[] // format: dayId:HH:mm
  onChange: (ids: string[]) => void
  minSelections?: number
  onDone?: (ids: string[]) => void
  persona?: Persona
  skin?: string
  className?: string
}

// Windows
const WINDOWS = [
  { key: 'early', label: 'Early Morning', range: ['05:30', '07:00'] as const },
  { key: 'mid', label: 'Mid-Morning', range: ['09:00', '11:00'] as const },
  { key: 'lunch', label: 'Lunchtime', range: ['12:00', '13:00'] as const },
  { key: 'evening', label: 'Evening Peak', range: ['17:00', '20:00'] as const },
] as const

function toMin(hhmm: string): number { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m }

function within(hhmm: string, start: string, end: string): boolean {
  const t = toMin(hhmm)
  return t >= toMin(start) && t <= toMin(end)
}

function blockHighlightForPersona(persona?: Persona): Set<string> {
  switch (persona) {
    case 'runner': return new Set(['early', 'evening'])
    case 'traveler': return new Set(['evening', 'mid'])
    case 'dancer': return new Set(['mid', 'lunch'])
    default: return new Set(['mid', 'evening'])
  }
}

export function YogaTimeBlocksPicker(props: YogaTimeBlocksPickerProps) {
  const { days, selectedIds, onChange, minSelections = 3, onDone, persona, skin = 'ulyxes', className } = props

  const [openDayId, setOpenDayId] = React.useState<string | null>(days[0]?.id ?? null)
  const [openBlocks, setOpenBlocks] = React.useState<Record<string, Set<string>>>(() => ({}))

  const highlightedBlocks = blockHighlightForPersona(persona)

  const toggleChecked = (dayId: string, timeId: string) => {
    const id = `${dayId}:${timeId}`
    const isSelected = selectedIds.includes(id)
    const next = isSelected ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]
    onChange(next)
  }

  const canDone = selectedIds.length >= minSelections

  const toggleBlock = (dayId: string, blockKey: string) => {
    setOpenBlocks((prev) => {
      const set = new Set(prev[dayId] ?? [])
      if (set.has(blockKey)) set.delete(blockKey); else set.add(blockKey)
      return { ...prev, [dayId]: set }
    })
  }

  const isBlockOpen = (dayId: string, blockKey: string) => openBlocks[dayId]?.has(blockKey) ?? false

  const quickPick3 = () => {
    // Pick across distinct days, prefer mid, evening, lunch order
    const pref = ['mid', 'evening', 'lunch', 'early']
    const picked: string[] = []
    const usedDays = new Set<string>()

    for (const block of pref) {
      for (const day of days) {
        if (usedDays.has(day.id)) continue
        const timesInBlock = day.times.filter((t) => within(t.id, WINDOWS.find(w => w.key===block)!.range[0], WINDOWS.find(w => w.key===block)!.range[1]))
        if (timesInBlock.length === 0) continue
        const firstAvailable = timesInBlock[0]
        const id = `${day.id}:${firstAvailable.id}`
        if (!selectedIds.includes(id)) {
          picked.push(id)
          usedDays.add(day.id)
          if (picked.length === 3) break
        }
      }
      if (picked.length === 3) break
    }
    if (picked.length > 0) onChange(Array.from(new Set([...selectedIds, ...picked])).slice(0, Math.max(minSelections, 3)))
  }

  return (
    <div data-skin={skin} className={className}>
      <section className="yui-time-blocks" aria-label="Yoga time picker (blocks)">
        <header className="yui-time-blocks__header">
          <div className="yui-time-blocks__title">Pick at least {minSelections} times</div>
          <div className="yui-time-blocks__progress" aria-live="polite">
            <div className="yui-time-blocks__progress-text">{selectedIds.length}/{minSelections}</div>
            <div className="yui-time-blocks__progress-bar"><span style={{width: `${Math.min(100, (selectedIds.length/minSelections)*100)}%`}} /></div>
          </div>
        </header>
        <div className="yui-time-blocks__actions">
          <button type="button" className="yui-btn yui-time-blocks__quick" onClick={quickPick3}>Quick Pick 3</button>
          <button type="button" className="yui-btn yui-time-blocks__done" disabled={!canDone} onClick={() => canDone && onDone?.(selectedIds)}>Done</button>
        </div>

        <div className="yui-time-blocks__days">
          {days.map((day) => (
            <section key={day.id} className="yui-time-blocks__day">
              <button type="button" className="yui-time-blocks__day-toggle" aria-expanded={openDayId===day.id} onClick={() => setOpenDayId(openDayId===day.id? null : day.id)}>
                <span className="yui-time-blocks__day-label">{day.label}</span>
              </button>

              {openDayId === day.id && (
                <div className="yui-time-blocks__blocks">
                  {WINDOWS.map((w) => {
                    const times = day.times.filter((t) => within(t.id, w.range[0], w.range[1]))
                    if (times.length === 0) return null
                    const open = isBlockOpen(day.id, w.key)
                    const highlight = highlightedBlocks.has(w.key)
                    return (
                      <div key={w.key} className="yui-time-blocks__block" data-highlight={highlight || undefined}>
                        <button type="button" className="yui-time-blocks__block-toggle" aria-expanded={open} onClick={() => toggleBlock(day.id, w.key)}>
                          <span className="yui-time-blocks__block-label">{w.label}</span>
                          {highlight ? <span className="yui-time-blocks__block-sublabel">Suggested</span> : null}
                        </button>
                        {open && (
                          <ul className="yui-time-blocks__list" role="group" aria-label={`${day.label} — ${w.label}`}>
                            {times.map((t) => {
                              const id = `${day.id}:${t.id}`
                              const checked = selectedIds.includes(id)
                              return (
                                <li key={id} className="yui-time-blocks__time">
                                  <label className="yui-time-blocks__time-row">
                                    <input type="checkbox" className="yui-time-blocks__checkbox" checked={checked} onChange={() => toggleChecked(day.id, t.id)} />
                                    <span className="yui-time-blocks__time-text">
                                      <span className="yui-time-blocks__time-label">{t.label}</span>
                                      {t.sublabel ? <span className="yui-time-blocks__time-sublabel">{t.sublabel}</span> : null}
                                    </span>
                                  </label>
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          ))}
        </div>
      </section>
    </div>
  )
}
