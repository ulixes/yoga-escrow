import * as React from 'react'

export type BrandProps = {
  logo?: React.ReactNode
  title?: string
  slogan?: string
  subtitle?: string
  orientation?: 'vertical' | 'horizontal'
  size?: 'sm' | 'md' | 'lg'
  logoVariant?: 'none' | 'openCircle' | 'lotus' | 'wave'
  className?: string
  containerProps?: React.HTMLAttributes<HTMLDivElement>
  logoProps?: React.HTMLAttributes<HTMLDivElement>
  titleProps?: React.HTMLAttributes<HTMLDivElement>
  sloganProps?: React.HTMLAttributes<HTMLParagraphElement>
  subtitleProps?: React.HTMLAttributes<HTMLParagraphElement>
  skin?: string
}

export const Brand: React.FC<BrandProps> = ({
  logo,
  title = 'Ulyxes',
  slogan = 'Ulyxes. Yoga everywhere.. anytime..',
  subtitle,
  orientation = 'vertical',
  size = 'md',
  logoVariant = 'openCircle',
  className,
  containerProps,
  logoProps,
  titleProps,
  sloganProps,
  subtitleProps,
  skin,
}) => {
  const classes = [
    'yui-brand',
    orientation ? `yui-brand--${orientation}` : undefined,
    size ? `yui-brand--${size}` : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ')
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
          <svg className="yui-brand__glyph yui-brand__logo-svg" width="32" height="32" viewBox="0 0 32 32" aria-hidden>
            <circle cx="16" cy="16" r="12" strokeLinecap="round" strokeDasharray="56 20" {...common} />
          </svg>
        )
      case 'lotus':
        return (
          <svg className="yui-brand__glyph yui-brand__logo-svg" width="32" height="32" viewBox="0 0 32 32" aria-hidden>
            <path d="M16 22c4-2 6-5 6-8" {...common} />
            <path d="M16 22c-4-2-6-5-6-8" {...common} />
            <path d="M16 22c0-3 1-6 3-8" {...common} />
            <path d="M16 22c0-3-1-6-3-8" {...common} />
          </svg>
        )
      case 'wave':
        return (
          <svg className="yui-brand__glyph yui-brand__logo-svg" width="36" height="24" viewBox="0 0 36 24" aria-hidden>
            <path d="M2 12c6-8 10 8 16 0s10-8 16 0" {...common} />
            <circle cx="26" cy="6" r="1.2" fill={stroke} />
            <path d="M26 7v4" {...common} />
          </svg>
        )
    }
  }

  return (
    <div className={classes} {...skinAttr} {...containerProps}>
      <div className="yui-brand__row">
        <div className="yui-brand__logo" {...logoProps}>
          {renderLogoByVariant()}
        </div>
        <div className="yui-brand__text">
          {title ? (
            <div className="yui-brand__title" {...titleProps}>
              {title}
            </div>
          ) : null}
          {slogan ? (
            <p className="yui-brand__slogan" {...sloganProps}>
              {slogan}
            </p>
          ) : null}
          {subtitle ? (
            <p className="yui-brand__subtitle" {...subtitleProps}>
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
