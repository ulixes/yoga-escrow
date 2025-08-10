import * as React from 'react'

export type CuratedSlot = {
  id: string // unique id of the slot
  date: string // YYYY-MM-DD (local)
  time: string // HH:mm (local)
  title?: string // e.g., Energizing Start
  benefitTag?: string // e.g., Great for Runners
  persona?: string // e.g., Runner
  teacher?: string // optional teacher display name
}

export type TimeSlotCarouselProps = {
  slots: CuratedSlot[]

  selectedIds?: string[]
  onSelect?: (id: string) => void
  onDeselect?: (id: string) => void
  onChange?: (ids: string[]) => void

  maxSelections?: number // default 3
  enforceDistinctDay?: boolean // default true

  onDone?: (ids: string[]) => void
  onCustomize?: () => void

  className?: string
  containerProps?: React.HTMLAttributes<HTMLDivElement>
  skin?: string
}

export const TimeSlotCarousel: React.FC<TimeSlotCarouselProps> = ({
  slots,
  selectedIds,
  onSelect,
  onDeselect,
  onChange,
  maxSelections = 3,
  enforceDistinctDay = true,
  onDone,
  onCustomize,
  className,
  containerProps,
  skin,
}) => {
  const selected = React.useMemo(() => new Set(selectedIds || []), [selectedIds])

  const [message, setMessage] = React.useState<string | null>(null)
  React.useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 2000)
      return () => clearTimeout(t)
    }
  }, [message])

  const classes = ['yui-slot-carousel', className].filter(Boolean).join(' ')
  const skinAttr = skin ? { 'data-skin': skin } : {}

  const count = selected.size

  const toggle = (slot: CuratedSlot) => {
    const id = slot.id
    const next = new Set(selected)

    if (next.has(id)) {
      next.delete(id)
      onDeselect?.(id)
    } else {
      if (enforceDistinctDay) {
        const day = slot.date
        const hasSameDay = Array.from(next).some((sid) => {
          const s = slots.find((x) => x.id === sid)
          return s?.date === day
        })
        if (hasSameDay) {
          setMessage('Pick a different day for variety')
          return
        }
      }

      if (next.size >= maxSelections) {
        const first = selectedIds?.[0]
        if (first) next.delete(first)
      }
      next.add(id)
      onSelect?.(id)
    }

    const nextArr = Array.from(next)
    onChange?.(nextArr)
  }

  const handleDone = () => {
    if (count === maxSelections) onDone?.(Array.from(selected))
  }

  return (
    <div className={classes} {...skinAttr} {...containerProps}>
      <div className="yui-slot-carousel__header" role="status" aria-live="polite">
        <span className="yui-slot-carousel__progress">{count}/{maxSelections} Chosen</span>
        {message ? <span className="yui-slot-carousel__msg">{message}</span> : (
          <span className="yui-slot-carousel__hint">Tap Select on {maxSelections} suggestions</span>
        )}
      </div>

      <div className="yui-slot-carousel__deck" role="list">
        {slots.map((slot) => {
          const isSelected = selected.has(slot.id)
          return (
            <article
              key={slot.id}
              role="listitem"
              className="yui-slot-carousel__card"
              data-selected={isSelected}
              aria-selected={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(slot) }
              }}
            >
              <header className="yui-slot-carousel__card-head">
                <span className="yui-slot-carousel__day">{formatDay(slot.date)}</span>
                <span className="yui-slot-carousel__time">{formatTime(slot.time)}</span>
              </header>
              <div className="yui-slot-carousel__card-body">
                {slot.title ? <h4 className="yui-slot-carousel__title">{slot.title}</h4> : null}
                {slot.benefitTag ? (
                  <span className="yui-slot-carousel__tag">{slot.benefitTag}</span>
                ) : null}
                {slot.teacher ? (
                  <span className="yui-slot-carousel__teacher">with {slot.teacher}</span>
                ) : null}
              </div>
              <div className="yui-slot-carousel__actions">
                <button
                  type="button"
                  className="yui-btn yui-slot-carousel__select"
                  onClick={() => toggle(slot)}
                  aria-pressed={isSelected}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </button>
              </div>
            </article>
          )
        })}
      </div>

      <aside className="yui-slot-carousel__selection" aria-label="Selected slots">
        <ol className="yui-slot-carousel__selected-list">
          {Array.from(selected).map((id) => {
            const s = slots.find((x) => x.id === id)
            if (!s) return null
            return (
              <li key={id} className="yui-slot-carousel__selected-item">
                <span className="yui-slot-carousel__sel-time">{formatDay(s.date)} • {formatTime(s.time)}</span>
                {s.title ? <span className="yui-slot-carousel__sel-title">— {s.title}</span> : null}
                <button type="button" className="yui-btn yui-slot-carousel__remove" onClick={() => toggle(s)}>Remove</button>
              </li>
            )
          })}
        </ol>
        <div className="yui-slot-carousel__footer">
          {onCustomize && (
            <button type="button" className="yui-btn yui-slot-carousel__customize" onClick={onCustomize}>Customize</button>
          )}
          <button
            type="button"
            className="yui-btn yui-slot-carousel__done"
            onClick={handleDone}
            disabled={count !== maxSelections}
          >
            Done
          </button>
        </div>
      </aside>
    </div>
  )
}

function formatDay(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map((x) => parseInt(x, 10))
  const date = new Date(y, m - 1, d)
  const weekday = date.toLocaleDateString(undefined, { weekday: 'short' })
  const md = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  return `${weekday} ${md}`
}

function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map((x) => parseInt(x, 10))
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}
