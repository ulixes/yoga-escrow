import * as React from 'react'

export type BrandProps = {
  logo?: React.ReactNode
  title?: string
  slogan?: string
  subtitle?: string
  orientation?: 'vertical' | 'horizontal'
  size?: 'sm' | 'md' | 'lg'
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

  return (
    <div className={classes} {...skinAttr} {...containerProps}>
      <div className="yui-brand__row">
        <div className="yui-brand__logo" {...logoProps}>
          {logo ?? <span className="yui-brand__glyph" aria-hidden />}
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
