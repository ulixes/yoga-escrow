import React from 'react'

export type BookingInfoItem = {
  icon?: React.ReactNode
  title: string
  description: string
}

export type BookingInfoProps = {
  heading?: string
  items?: BookingInfoItem[]
  variant?: 'full' | 'side' | 'accordion'
  skin?: string
  className?: string
}

const DEFAULT_ITEMS: BookingInfoItem[] = [
  {
    icon: '🕐',
    title: 'Multiple Time Options',
    description: 'Choose 3 preferred slots to guarantee availability.',
  },
  {
    icon: '🔒',
    title: 'Secure Payments',
    description: 'Blockchain escrow keeps your ETH safe until confirmation.',
  },
  {
    icon: '↩️',
    title: 'Risk‑Free Booking',
    description: 'Full refunds available anytime before teacher accepts.',
  },
]

export function BookingInfo(props: BookingInfoProps) {
  const { heading = 'Safe & Simple Yoga Booking', items = DEFAULT_ITEMS, variant = 'full', skin = 'ulyxes', className } = props
  const [open, setOpen] = React.useState<boolean>(variant !== 'accordion')

  const containerProps: React.HTMLAttributes<HTMLDivElement> = {
    'data-skin': skin,
    'data-variant': variant,
    className: ['yui-booking-info', className].filter(Boolean).join(' '),
  }

  const content = (
    <div className="yui-booking-info__items" role="list">
      {items.map((it, idx) => (
        <div key={idx} role="listitem" className="yui-booking-info__item">
          <div className="yui-booking-info__icon" aria-hidden>{it.icon ?? '•'}</div>
          <div className="yui-booking-info__text">
            <div className="yui-booking-info__title">{it.title}</div>
            <div className="yui-booking-info__desc">{it.description}</div>
          </div>
        </div>
      ))}
    </div>
  )

  if (variant === 'accordion') {
    return (
      <section {...containerProps}>
        <button type="button" className="yui-booking-info__toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span className="yui-booking-info__heading">{heading}</span>
        </button>
        {open ? content : null}
      </section>
    )
  }

  return (
    <section {...containerProps}>
      <div className="yui-booking-info__heading">{heading}</div>
      {content}
    </section>
  )
}
