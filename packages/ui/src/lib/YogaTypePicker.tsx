import * as React from 'react'

export type YogaTypeItem = {
  id: string
  name: string
  tagline?: string
  personas: string[]
  benefits: Record<string, string[]>
}

export type YogaTypePickerProps = {
  items: YogaTypeItem[]
  personas: string[]
  filterPersona?: string | null
  onFilterPersona?: (persona: string | null) => void
  onSelect?: (id: string) => void
  className?: string
  containerProps?: React.HTMLAttributes<HTMLDivElement>
  skin?: string
}

export const YogaTypePicker: React.FC<YogaTypePickerProps> = ({
  items,
  personas,
  filterPersona: controlledPersona,
  onFilterPersona,
  onSelect,
  className,
  containerProps,
  skin,
  
}) => {
  const [internalPersona, setInternalPersona] = React.useState<string | null>(null)

  const persona = controlledPersona !== undefined ? controlledPersona : internalPersona

  const setPersona = (p: string | null) => {
    if (onFilterPersona) onFilterPersona(p)
    if (controlledPersona === undefined) setInternalPersona(p)
  }
  
  const filtered = React.useMemo(() => {
    return items.filter((item) => (persona ? item.personas.includes(persona) : true))
  }, [items, persona])

  const classes = ['yui-yoga-picker', className].filter(Boolean).join(' ')
  const skinAttr = skin ? { 'data-skin': skin } : {}

  return (
    <div className={classes} {...skinAttr} {...containerProps}>
      <div className="yui-yoga-picker__controls" role="region" aria-label="Filters">
        <div className="yui-yoga-picker__personas" role="tablist" aria-label="Personas">
          <button
            type="button"
            className="yui-yoga-picker__persona-btn"
            data-active={persona == null}
            onClick={() => setPersona(null)}
          >
            All
          </button>
          {personas.map((p) => (
            <button
              key={p}
              type="button"
              className="yui-yoga-picker__persona-btn"
              data-active={persona === p}
              onClick={() => setPersona(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="yui-yoga-picker__grid" role="list">
        {filtered.map((item) => (
          <article key={item.id} role="listitem" className="yui-yoga-picker__card" data-personas={item.personas.join(' ')}>
            <h3 className="yui-yoga-picker__card-title">{item.name}</h3>
            {item.tagline ? <p className="yui-yoga-picker__card-tagline">{item.tagline}</p> : null}

            {persona ? (
              <ul className="yui-yoga-picker__benefits-list">
                {(item.benefits[persona] || []).slice(0, 3).map((text, idx) => (
                  <li key={idx} className="yui-yoga-picker__benefit-item">{text}</li>
                ))}
              </ul>
            ) : (
              <div className="yui-yoga-picker__persona-tags">
                {item.personas.map((p) => (
                  <span key={p} className="yui-yoga-picker__tag">{p}</span>
                ))}
              </div>
            )}

            {onSelect && (
              <button type="button" className="yui-btn yui-yoga-picker__select" onClick={() => onSelect(item.id)}>
                Select
              </button>
            )}
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="yui-yoga-picker__empty" role="status">No types match your filters</div>
        )}
      </div>
    </div>
  )
}
