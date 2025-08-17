import * as React from 'react'

export type NavBarProps = {
  title?: string
  slogan?: string
  skin?: string
  className?: string
  bookingsLabel?: string
  logoutLabel?: string
  showBrand?: boolean
  logo?: React.ReactNode
  logoVariant?: 'none' | 'openCircle' | 'lotus' | 'wave'
  customMenuContent?: React.ReactNode
  onOpenBookings?: () => void
  onLogout?: () => void
}

export const NavBar: React.FC<NavBarProps> = ({
  title = 'Ulyxes',
  slogan = 'Yoga everywhere.. anytime..',
  skin,
  className,
  bookingsLabel = 'My bookings',
  logoutLabel = 'Log out',
  showBrand = true,
  logo,
  logoVariant = 'wave',
  customMenuContent,
  onOpenBookings,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!isOpen) return
      const target = e.target as Node
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsOpen(false)
      }
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [isOpen])

  const classes = ['yui-nav', className].filter(Boolean).join(' ')
  const skinAttr = skin ? { 'data-skin': skin } : {}

  const renderLogoByVariant = () => {
    if (logo) return logo
    if (logoVariant === 'none') return <span className="yui-brand__glyph" aria-hidden />
    const stroke = 'currentColor'
    const strokeWidth = 2
    const common = { fill: 'none', stroke, strokeWidth, vectorEffect: 'non-scaling-stroke' as const }
    switch (logoVariant) {
      case 'openCircle':
        return (
          <svg className="yui-brand__glyph yui-brand__logo-svg" width="28" height="28" viewBox="0 0 32 32" aria-hidden>
            <circle cx="16" cy="16" r="12" strokeLinecap="round" strokeDasharray="56 20" {...common} />
          </svg>
        )
      case 'lotus':
        return (
          <svg className="yui-brand__glyph yui-brand__logo-svg" width="28" height="28" viewBox="0 0 32 32" aria-hidden>
            <path d="M16 22c4-2 6-5 6-8" {...common} />
            <path d="M16 22c-4-2-6-5-6-8" {...common} />
            <path d="M16 22c0-3 1-6 3-8" {...common} />
            <path d="M16 22c0-3-1-6-3-8" {...common} />
          </svg>
        )
      case 'wave':
        return (
          <svg className="yui-brand__glyph yui-brand__logo-svg" width="32" height="22" viewBox="0 0 36 24" aria-hidden>
            <path d="M2 12c6-8 10 8 16 0s10-8 16 0" {...common} />
            <circle cx="26" cy="6" r="1.2" fill={stroke} />
            <path d="M26 7v4" {...common} />
          </svg>
        )
    }
  }

  return (
    <header className={classes} {...skinAttr}>
      <div className="yui-nav__row">
        {showBrand ? (
          <div className="yui-nav__brand" aria-label="brand">
            {renderLogoByVariant()}
            <div className="yui-nav__brand-text">
              <div className="yui-nav__brand-title">{title}</div>
              <div className="yui-nav__brand-slogan">{slogan}</div>
            </div>
          </div>
        ) : (
          <span />
        )}

        <div className="yui-nav__right">
          <button
            type="button"
            aria-label="Open menu"
            className="yui-nav__burger"
            aria-expanded={isOpen}
            aria-haspopup="menu"
            onClick={() => setIsOpen((v) => !v)}
          >
            <svg width="22" height="18" viewBox="0 0 22 18" aria-hidden>
              <path d="M2 3h18M2 9h18M2 15h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {isOpen ? (
            <div className="yui-nav__menu" role="menu" ref={menuRef}>
              {customMenuContent || (
                <>
                  <button
                    type="button"
                    role="menuitem"
                    className="yui-nav__menu-item"
                    onClick={() => {
                      setIsOpen(false)
                      onOpenBookings?.()
                    }}
                  >
                    {bookingsLabel}
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="yui-nav__menu-item yui-nav__menu-item--danger"
                    onClick={() => {
                      setIsOpen(false)
                      onLogout?.()
                    }}
                  >
                    {logoutLabel}
                  </button>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
