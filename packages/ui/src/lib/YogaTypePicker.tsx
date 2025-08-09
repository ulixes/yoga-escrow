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
  query?: string
  onFilterPersona?: (persona: string | null) => void
  onQueryChange?: (query: string) => void
  onSelect?: (id: string) => void
  className?: string
  containerProps?: React.HTMLAttributes<HTMLDivElement>
  searchInputProps?: React.InputHTMLAttributes<HTMLInputElement>
  skin?: string
  renderIcon?: (item: YogaTypeItem) => React.ReactNode
}

export const YogaTypePicker: React.FC<YogaTypePickerProps> = ({
  items,
  personas,
  filterPersona: controlledPersona,
  query: controlledQuery,
  onFilterPersona,
  onQueryChange,
  onSelect,
  className,
  containerProps,
  searchInputProps,
  skin,
  renderIcon,
}) => {
  const [internalPersona, setInternalPersona] = React.useState<string | null>(null)
  const [internalQuery, setInternalQuery] = React.useState('')

  const persona = controlledPersona !== undefined ? controlledPersona : internalPersona
  const query = controlledQuery !== undefined ? controlledQuery : internalQuery

  const setPersona = (p: string | null) => {
    if (onFilterPersona) onFilterPersona(p)
    if (controlledPersona === undefined) setInternalPersona(p)
  }
  const setQuery = (q: string) => {
    if (onQueryChange) onQueryChange(q)
    if (controlledQuery === undefined) setInternalQuery(q)
  }

  const normalizedQuery = query.trim().toLowerCase()
  const filtered = React.useMemo(() => {
    return items.filter((item) => {
      const personaOk = persona ? item.personas.includes(persona) : true
      if (!personaOk) return false
      if (!normalizedQuery) return true
      const hay = [item.name, item.tagline, ...Object.values(item.benefits).flat()].join(' ').toLowerCase()
      return hay.includes(normalizedQuery)
    })
  }, [items, persona, normalizedQuery])

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
        <div className="yui-yoga-picker__search">
          <input
            type="search"
            placeholder="Search benefits or types"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="yui-yoga-picker__search-input"
            {...searchInputProps}
          />
        </div>
      </div>

      <div className="yui-yoga-picker__grid" role="list">
        {filtered.map((item) => (
          <article key={item.id} role="listitem" className="yui-yoga-picker__card" data-personas={item.personas.join(' ')}>
            <header className="yui-yoga-picker__card-header">
              <div className="yui-yoga-picker__card-icon" aria-hidden>
                {renderIcon ? renderIcon(item) : <span className="yui-yoga-picker__icon" />}
              </div>
              <div className="yui-yoga-picker__card-titles">
                <h3 className="yui-yoga-picker__card-title">{item.name}</h3>
                {item.tagline ? <p className="yui-yoga-picker__card-tagline">{item.tagline}</p> : null}
              </div>
            </header>

            <div className="yui-yoga-picker__benefits">
              {personas.map((p) => {
                const points = item.benefits[p] || []
                if (points.length === 0) return null
                return (
                  <section key={p} className="yui-yoga-picker__benefits-group" data-persona={p} data-highlight={persona === p}>
                    <h4 className="yui-yoga-picker__benefits-title">{p}</h4>
                    <ul className="yui-yoga-picker__benefits-list">
                      {points.map((text, idx) => (
                        <li key={idx} className="yui-yoga-picker__benefit-item">
                          {text}
                        </li>
                      ))}
                    </ul>
                  </section>
                )
              })}
            </div>

            <footer className="yui-yoga-picker__card-footer">
              <div className="yui-yoga-picker__persona-tags">
                {item.personas.map((p) => (
                  <span key={p} className="yui-yoga-picker__tag" data-selected={persona === p}>
                    {p}
                  </span>
                ))}
              </div>
              <button
                type="button"
                className="yui-btn yui-yoga-picker__select"
                onClick={() => onSelect?.(item.id)}
              >
                Select
              </button>
            </footer>
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="yui-yoga-picker__empty" role="status">No types match your filters</div>
        )}
      </div>
    </div>
  )
}
