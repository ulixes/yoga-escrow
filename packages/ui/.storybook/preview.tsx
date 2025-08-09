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
.yui-brand__row { display: grid; gap: 6px; justify-items: start; }
.yui-brand__logo { display: inline-grid; place-items: center; }
.yui-brand__slogan { margin: 0; font: inherit; opacity: 0.9; }

/* Ulyxes minimal black & white skin */
[data-skin='ulyxes'] { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
[data-skin='ulyxes'] .yui-pwls {
  border: 1px solid #111;
  border-radius: 12px;
  padding: 16px;
  background: #fff;
  color: #111;
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
}
[data-skin='ulyxes'] .yui-pwls__title {
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 0.15px;
}
[data-skin='ulyxes'] .yui-pwls__description { opacity: 0.7; }
[data-skin='ulyxes'] .yui-pwls__input {
  border: 1px solid #111;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
  color: #111;
  transition: box-shadow 150ms ease, transform 120ms ease;
}
[data-skin='ulyxes'] .yui-pwls__input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0,0,0,0.12) inset;
}
[data-skin='ulyxes'] .yui-pwls__code-boxes { gap: 8px; }
[data-skin='ulyxes'] .yui-pwls__code-box {
  border: 1px solid #111;
  border-radius: 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  transition: background-color 150ms ease, color 150ms ease, transform 120ms ease;
}
[data-skin='ulyxes'] .yui-pwls__code-box[data-filled='true'] { background: #111; color: #fff; }
[data-skin='ulyxes'] .yui-pwls__code-box[data-filled='true'] .yui-pwls__code-digit { transform: translateY(-1px); }
[data-skin='ulyxes'] .yui-pwls__code-digit { transition: transform 120ms ease; }
[data-skin='ulyxes'] .yui-pwls__actions { gap: 8px; }
[data-skin='ulyxes'] .yui-btn {
  border-radius: 10px;
  padding: 10px 14px;
  border: 1px solid #111;
  background: #fff;
  color: #111;
  transition: background-color 160ms ease, color 160ms ease, transform 120ms ease, box-shadow 160ms ease;
}
[data-skin='ulyxes'] .yui-btn--primary { background: #111; color: #fff; }
[data-skin='ulyxes'] .yui-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,0.08); }
[data-skin='ulyxes'] .yui-btn:active:not(:disabled) { transform: translateY(0); box-shadow: 0 2px 6px rgba(0,0,0,0.08); }
[data-skin='ulyxes'] .yui-btn:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }

/* Brand – monochrome elegance */
[data-skin='ulyxes'] .yui-brand__slogan { letter-spacing: 0.2px; }
[data-skin='ulyxes'] .yui-brand__glyph { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #111; display: inline-block; }
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
