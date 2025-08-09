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
:root {
  --yoga-primary: #3b82f6;
  --yoga-on-primary: #ffffff;
  --yoga-surface: #ffffff;
  --yoga-on-surface: #0f172a;
  --yoga-outline: #e2e8f0;
  --yoga-input: #f8fafc;
  --yoga-radius: 12px;
  --yoga-elevation: 0 6px 24px rgba(2, 6, 23, 0.08);
}

/* Example skins */
[data-skin='zen'] {
  --yoga-primary: #10b981;
  --yoga-on-primary: #052e1c;
  --yoga-surface: #f0fdf4;
  --yoga-on-surface: #052e1a;
  --yoga-outline: #bbf7d0;
  --yoga-input: #dcfce7;
  --yoga-radius: 16px;
}

[data-skin='dark'] {
  --yoga-primary: #60a5fa;
  --yoga-on-primary: #0b1220;
  --yoga-surface: #0b1220;
  --yoga-on-surface: #e2e8f0;
  --yoga-outline: #1f2937;
  --yoga-input: #111827;
  --yoga-radius: 10px;
}
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
