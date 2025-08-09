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

/* Brand baseline */
.yui-brand { display: inline-block; }
.yui-brand__row { display: inline-flex; align-items: center; gap: 8px; }
.yui-brand__logo { display: inline-grid; place-items: center; }
.yui-brand__slogan { margin: 0; font: inherit; opacity: 0.9; }

/* Ulyxes minimal black & white skin */
[data-skin='ulyxes'] .yui-pwls {
  border: 1px solid #111;
  border-radius: 10px;
  padding: 14px;
  background: #fff;
  color: #111;
}
[data-skin='ulyxes'] .yui-pwls__title {
  font-weight: 600;
  letter-spacing: 0.2px;
}
[data-skin='ulyxes'] .yui-pwls__description {
  opacity: 0.75;
}
[data-skin='ulyxes'] .yui-pwls__input {
  border: 1px solid #111;
  border-radius: 8px;
  padding: 8px 10px;
  background: #fff;
  color: #111;
}
[data-skin='ulyxes'] .yui-pwls__input:focus {
  outline: none;
  box-shadow: inset 0 0 0 1px #000;
}
[data-skin='ulyxes'] .yui-pwls__code-boxes { gap: 6px; }
[data-skin='ulyxes'] .yui-pwls__code-box {
  border: 1px solid #111;
  border-radius: 8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
[data-skin='ulyxes'] .yui-pwls__code-box[data-filled='true'] {
  background: #111;
  color: #fff;
}
[data-skin='ulyxes'] .yui-pwls__actions { gap: 6px; }
[data-skin='ulyxes'] .yui-btn {
  border-radius: 8px;
  padding: 8px 12px;
  border: 1px solid #111;
  background: #fff;
  color: #111;
}
[data-skin='ulyxes'] .yui-btn--primary {
  background: #111;
  color: #fff;
}
[data-skin='ulyxes'] .yui-btn--secondary {
  background: #fff;
  color: #111;
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
