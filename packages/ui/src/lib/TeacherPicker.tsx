import * as React from 'react'

export type TeacherItem = {
  id: string
  name: string
  bio?: string
  avatarUrl?: string
  personas?: string[]
  yogaTypes?: string[]
  followerCount?: number
  rating?: number
  postImages?: string[]
}

export type TeacherPickerProps = {
  items: TeacherItem[]
  onSelect?: (id: string) => void
  onDeselect?: (id: string) => void
  selectedIds?: string[]
  selectionMode?: 'single' | 'multiple'
  pickingId?: string | null
  className?: string
  containerProps?: React.HTMLAttributes<HTMLDivElement>
  skin?: string
  renderAvatar?: (item: TeacherItem) => React.ReactNode
}

export const TeacherPicker: React.FC<TeacherPickerProps> = ({
  items,
  onSelect,
  onDeselect,
  selectedIds,
  selectionMode = 'single',
  pickingId = null,
  className,
  containerProps,
  skin,
  renderAvatar,
}) => {
  const classes = ['yui-teacher-picker', className].filter(Boolean).join(' ')
  const skinAttr = skin ? { 'data-skin': skin } : {}
  const selectedSet = React.useMemo(() => new Set(selectedIds || []), [selectedIds])

  return (
    <div className={classes} {...skinAttr} {...containerProps}>
      <div className="yui-teacher-picker__grid" role="list">
        {items.map((t) => {
          const isSelected = selectedSet.has(t.id)
          const isPicking = pickingId === t.id
          const handleToggle = () => {
            if (isSelected) {
              if (onDeselect) onDeselect(t.id)
            } else {
              if (onSelect) onSelect(t.id)
            }
          }
          const handleKeyDown: React.KeyboardEventHandler<HTMLElement> = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleToggle()
            }
          }
          return (
          <article
            key={t.id}
            role="listitem"
            className="yui-teacher-picker__card"
            data-selected={isSelected}
            data-picking={isPicking}
            tabIndex={0}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            aria-selected={isSelected}
            aria-label={`${t.name}: ${isSelected ? 'Deselect' : 'Select'}`}
          >
            <header className="yui-teacher-picker__header">
              <div className="yui-teacher-picker__avatar-wrap" aria-hidden>
                {renderAvatar ? (
                  renderAvatar(t)
                ) : t.avatarUrl ? (
                  <img className="yui-teacher-picker__avatar" src={t.avatarUrl} alt="" />
                ) : (
                  <div className="yui-teacher-picker__avatar" />
                )}
              </div>
              <div className="yui-teacher-picker__title">
                <h3 className="yui-teacher-picker__name">{t.name}</h3>
                {t.bio ? <p className="yui-teacher-picker__bio">{t.bio}</p> : null}
              </div>
            </header>

            <div className="yui-teacher-picker__tags">
              <div className="yui-teacher-picker__personas">
                {(t.personas || []).map((p) => (
                  <span key={p} className="yui-teacher-picker__tag yui-teacher-picker__tag--persona">
                    {p}
                  </span>
                ))}
              </div>
              <div className="yui-teacher-picker__yoga-types">
                {(t.yogaTypes || []).map((yt) => (
                  <span key={yt} className="yui-teacher-picker__tag yui-teacher-picker__tag--type">
                    {yt}
                  </span>
                ))}
              </div>
            </div>

            {(t.followerCount != null || t.rating != null) && (
              <div className="yui-teacher-picker__meta">
                {t.followerCount != null && (
                  <span className="yui-teacher-picker__followers" title="Instagram followers">
                    {Intl.NumberFormat(undefined, { notation: 'compact' }).format(t.followerCount)} followers
                  </span>
                )}
                {t.rating != null && (
                  <span className="yui-teacher-picker__rating" title="Rating">
                    {t.rating.toFixed(1)}★
                  </span>
                )}
              </div>
            )}

            <div className="yui-teacher-picker__posts" aria-hidden>
              {(t.postImages || []).slice(0, 4).map((src, idx) => (
                <img key={idx} src={src} alt="" className="yui-teacher-picker__post" />
              ))}
            </div>

            <div className="yui-teacher-picker__actions">
              {isSelected && onDeselect ? (
                <button
                  type="button"
                  className="yui-btn yui-teacher-picker__deselect"
                  onClick={(e) => { e.stopPropagation(); onDeselect(t.id) }}
                  aria-pressed={isSelected}
                >
                  Deselect
                </button>
              ) : (
                onSelect && (
                  <button
                    type="button"
                    className="yui-btn yui-teacher-picker__select"
                    onClick={(e) => { e.stopPropagation(); onSelect(t.id) }}
                    aria-pressed={isSelected}
                    disabled={selectionMode === 'single' && isSelected}
                  >
                    Select Teacher
                  </button>
                )
              )}
            </div>
          </article>
        )})}
      </div>
    </div>
  )
}
