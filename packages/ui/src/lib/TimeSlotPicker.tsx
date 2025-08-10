import * as React from 'react'

export type TimeSlotPickerProps = {
  // Render window
  days?: number // number of days from tomorrow to show (default 7)
  hours?: string[] // times in HH:mm (local time) (default hourly 07:00-20:00)
  startDate?: Date // min date (default: tomorrow)

  // Selection
  selectedIds?: string[] // id format: YYYY-MM-DD|HH:mm (local)
  disabledIds?: string[] // ids that cannot be selected
  onSelect?: (id: string) => void
  onDeselect?: (id: string) => void
  onChange?: (ids: string[]) => void // emitted after every toggle

  // UI
  className?: string
  containerProps?: React.HTMLAttributes<HTMLDivElement>
  skin?: string
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  days = 7,
  hours,
  startDate,
  selectedIds,
  disabledIds = [],
  onSelect,
  onDeselect,
  onChange,
  className,
  containerProps,
  skin,
}) => {
  const minDate = React.useMemo(() => {
    if (startDate) return stripTime(startDate)
    const d = new Date()
    d.setDate(d.getDate() + 1) // tomorrow
    return stripTime(d)
  }, [startDate])

  const hoursList = React.useMemo(() => hours ?? buildDefaultHours(), [hours])
  const selected = React.useMemo(() => new Set(selectedIds || []), [selectedIds])
  const disabled = React.useMemo(() => new Set(disabledIds || []), [disabledIds])

  const [openDayIndex, setOpenDayIndex] = React.useState<number | null>(0)

  const dayItems = React.useMemo(() => buildDays(minDate, days), [minDate, days])

  const classes = ['yui-slot-picker', className].filter(Boolean).join(' ')
  const skinAttr = skin ? { 'data-skin': skin } : {}

  const count = selected.size

  const toggle = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) {
      next.delete(id)
      onDeselect?.(id)
    } else {
      // If we already have 3, auto-remove the earliest selected (FIFO)
      if (next.size >= 3) {
        const first = selectedIds?.[0]
        if (first) next.delete(first)
      }
      next.add(id)
      onSelect?.(id)
    }
    const nextArr = Array.from(next)
    onChange?.(nextArr)
  }

  return (
    <div className={classes} {...skinAttr} {...containerProps}>
      <div className="yui-slot-picker__header" role="status" aria-live="polite">
        <span className="yui-slot-picker__progress">{count}/3 Chosen</span>
        <span className="yui-slot-picker__hint">Pick exactly three day + hour slots</span>
      </div>

      <div className="yui-slot-picker__days">
        {dayItems.map((d, idx) => {
          const isOpen = openDayIndex === idx
          const isDisabledDay = d.date < minDate
          return (
            <section key={d.key} className="yui-slot-picker__day" data-open={isOpen} aria-disabled={isDisabledDay}>
              <button
                type="button"
                className="yui-slot-picker__day-toggle"
                onClick={() => setOpenDayIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                disabled={isDisabledDay}
                title={isDisabledDay ? 'Today is not selectable' : undefined}
              >
                <span className="yui-slot-picker__day-name">{d.label}</span>
                <span className="yui-slot-picker__day-date">{d.dateLabel}</span>
              </button>

              {isOpen && (
                <ul className="yui-slot-picker__hours" role="group" aria-label={`Hours for ${d.label}`}>
                  {hoursList.map((hhmm) => {
                    const id = `${d.key}|${hhmm}`
                    const isSelected = selected.has(id)
                    const isDisabled = disabled.has(id) || isDisabledDay
                    return (
                      <li key={hhmm} className="yui-slot-picker__hour-row">
                        <label className="yui-slot-picker__hour">
                          <input
                            type="checkbox"
                            className="yui-slot-picker__checkbox"
                            checked={isSelected}
                            disabled={isDisabled}
                            onChange={() => toggle(id)}
                            aria-checked={isSelected}
                          />
                          <span className="yui-slot-picker__hour-label">{formatHour(hhmm)}</span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
          )
        })}
      </div>

      <div className="yui-slot-picker__footer" aria-live="polite">
        {count < 3 ? (
          <span className="yui-slot-picker__validation">Select {3 - count} more</span>
        ) : count > 3 ? (
          <span className="yui-slot-picker__validation" data-error>Too many selected; last added replaced earliest</span>
        ) : (
          <span className="yui-slot-picker__validation" data-ok>All set</span>
        )}
      </div>
    </div>
  )
}

function stripTime(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function buildDays(minDate: Date, days: number): { key: string; label: string; dateLabel: string; date: Date }[] {
  const items: { key: string; label: string; dateLabel: string; date: Date }[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(minDate)
    d.setDate(minDate.getDate() + i)
    const key = formatDateKey(d)
    items.push({
      key,
      label: formatDayName(d),
      dateLabel: formatMonthDay(d),
      date: d,
    })
  }
  return items
}

function buildDefaultHours(): string[] {
  const list: string[] = []
  for (let h = 7; h <= 20; h++) {
    list.push(`${pad2(h)}:00`)
  }
  return list
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function formatDayName(d: Date): string {
  return d.toLocaleDateString(undefined, { weekday: 'long' })
}

function formatMonthDay(d: Date): string {
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function formatHour(hhmm: string): string {
  const [h, m] = hhmm.split(':').map((x) => parseInt(x, 10))
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}
