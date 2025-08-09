import * as React from 'react'

export type BrandProps = {
  logo?: React.ReactNode
  slogan?: string
  className?: string
  containerProps?: React.HTMLAttributes<HTMLDivElement>
  logoProps?: React.HTMLAttributes<HTMLDivElement>
  sloganProps?: React.HTMLAttributes<HTMLParagraphElement>
  skin?: string
}

export const Brand: React.FC<BrandProps> = ({
  logo,
  slogan = 'Ulyxes. Yoga every… anytime.',
  className,
  containerProps,
  logoProps,
  sloganProps,
  skin,
}) => {
  const classes = ['yui-brand', className].filter(Boolean).join(' ')
  const skinAttr = skin ? { 'data-skin': skin } : {}

  return (
    <div className={classes} {...skinAttr} {...containerProps}>
      <div className="yui-brand__row">
        <div className="yui-brand__logo" {...logoProps}>
          {logo ?? <span className="yui-brand__glyph" aria-hidden />}
        </div>
        {slogan ? (
          <p className="yui-brand__slogan" {...sloganProps}>
            {slogan}
          </p>
        ) : null}
      </div>
    </div>
  )
}
