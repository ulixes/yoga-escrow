import React from 'react'

export type LoadingStateProps = {
  message?: string
  skin?: string
  className?: string
}

export function LoadingState({ message = 'Loading…', skin = 'ulyxes', className }: LoadingStateProps) {
  return (
    <div data-skin={skin} className={['yui-loading', className].filter(Boolean).join(' ')} role="status" aria-live="polite">
      <span className="yui-loading__spinner" aria-hidden>◌</span>
      <span className="yui-loading__message">{message}</span>
    </div>
  )
}
