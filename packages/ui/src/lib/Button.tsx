import * as React from 'react'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'ghost'
}

export const Button: React.FC<ButtonProps> = ({
  size = 'md',
  variant = 'primary',
  className,
  children,
  ...rest
}) => {
  return (
    <button
      className={[
        'yui-btn',
        size ? `yui-btn--${size}` : undefined,
        variant ? `yui-btn--${variant}` : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </button>
  )
}
