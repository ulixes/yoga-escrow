import type { Preview } from '@storybook/react'
import React from 'react'

export const parameters: Preview['parameters'] = {
  controls: { expanded: true },
  backgrounds: {
    default: 'white',
    values: [
      { name: 'white', value: '#ffffff' },
      { name: 'dark', value: '#0b1220' },
    ],
  },
}

const GlobalStyles: React.FC = () => (
  <style>
    {`
/* Raw, class-only baseline. No visual opinion. */
.yui-pwls { display: grid; gap: 12px; max-width: 420px; }
.yui-pwls__form { display: block; }
.yui-pwls__section { display: grid; gap: 8px; }
.yui-pwls__title { font: inherit; font-weight: 600; margin: 0; }
.yui-pwls__description { margin: 0; opacity: 0.9; }
.yui-pwls__input { font: inherit; }
.yui-pwls__code-boxes { display: grid; gap: 8px; }
.yui-pwls__code-box { display: grid; place-items: center; height: 44px; }
.yui-pwls__actions { display: flex; gap: 8px; }

/* Button baseline, still unstyled */
.yui-btn { font: inherit; cursor: pointer; }
    `}
  </style>
)

export const decorators = [
  (Story) => (
    <div style={{ padding: 24, display: 'grid', placeItems: 'start', minHeight: '100vh' }}>
      <GlobalStyles />
      <Story />
    </div>
  ),
]
