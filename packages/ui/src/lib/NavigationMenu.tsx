import React from 'react'

export interface NavItem {
  id: string
  label: string
  onClick?: () => void
}

export interface NavigationMenuProps {
  title?: string
  slogan?: string
  user?: {
    name?: string
    email?: string
    address?: `0x${string}` | string
    avatarUrl?: string
  }
  items?: NavItem[]
  onLogout?: () => void
  skin?: 'ulyxes' | 'default'
}

export function NavigationMenu({ title = 'Ulyxes', slogan, user, items = [], onLogout, skin = 'ulyxes' }: NavigationMenuProps) {
  return (
    <header className="yui-nav" data-skin={skin}>
      <div className="yui-nav__inner">
        <div className="yui-nav__brand">
          <div className="yui-nav__title">{title}</div>
          {slogan && <div className="yui-nav__slogan">{slogan}</div>}
        </div>

        <nav className="yui-nav__actions" aria-label="Primary">
          {items.map(item => (
            <button key={item.id} className="yui-btn yui-btn--ghost" onClick={item.onClick}>{item.label}</button>
          ))}
        </nav>

        <div className="yui-nav__user">
          {user?.avatarUrl ? (
            <img className="yui-avatar" src={user.avatarUrl} alt={user.name || user.email || 'User'} />
          ) : (
            <div className="yui-avatar" aria-hidden>
              {(user?.name || user?.email || 'U').slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="yui-user__meta">
            {user?.name && <div className="yui-user__name">{user.name}</div>}
            {(user?.email || user?.address) && (
              <div className="yui-user__sub">{user.email || user.address}</div>
            )}
          </div>
          {onLogout && (
            <button className="yui-btn yui-btn--link" onClick={onLogout}>Logout</button>
          )}
        </div>
      </div>
    </header>
  )}
