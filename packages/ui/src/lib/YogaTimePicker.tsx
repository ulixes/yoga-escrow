import React from 'react'

export type YogaTimeItem = {
  id: string
  label: string
  sublabel?: string
}

export type YogaDay = {
  id: string
  label: string
  times: YogaTimeItem[]
}

export type YogaTimePickerProps = {
  days: YogaDay[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  minSelections?: number
  onDone?: (ids: string[]) => void
  skin?: string
  className?: string
}

export function YogaTimePicker(props: YogaTimePickerProps) {
  const {
    days,
    selectedIds,
    onChange,
    minSelections = 3,
    onDone,
    skin = 'ulyxes',
    className,
  } = props

  const toggle = (id: string) => {
    const isSelected = selectedIds.includes(id)
    const next = isSelected
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id]
    onChange(next)
  }

  const canDone = selectedIds.length >= minSelections

  return (
    <div data-skin={skin} className={className}>
      <section className="yui-time-picker" aria-label="Yoga time picker">
        <header className="yui-time-picker__header">
          <div className="yui-time-picker__title">Pick at least {minSelections} times</div>
          <div className="yui-time-picker__progress">
            {selectedIds.length}/{minSelections}
          </div>
        </header>

        <div className="yui-time-picker__days">
          {days.map((day) => (
            <div key={day.id} className="yui-time-picker__day">
              <div className="yui-time-picker__day-label">{day.label}</div>
              <ul className="yui-time-picker__list" role="list">
                {day.times.map((t) => {
                  const id = `${day.id}:${t.id}`
                  const checked = selectedIds.includes(id)
                  return (
                    <li key={id} className="yui-time-picker__row">
                      <label className="yui-time-picker__time">
                        <input
                          className="yui-time-picker__checkbox"
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggle(id)}
                          aria-label={`${day.label} ${t.label}${t.sublabel ? `, ${t.sublabel}` : ''}`}
                        />
                        <span className="yui-time-picker__time-text">
                          <span className="yui-time-picker__time-label">{t.label}</span>
                          {t.sublabel ? (
                            <span className="yui-time-picker__time-sublabel">{t.sublabel}</span>
                          ) : null}
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <footer className="yui-time-picker__actions">
          <button
            type="button"
            className="yui-btn yui-time-picker__done"
            disabled={!canDone}
            onClick={() => canDone && onDone?.(selectedIds)}
          >
            Done
          </button>
        </footer>
      </section>
    </div>
  )
}
