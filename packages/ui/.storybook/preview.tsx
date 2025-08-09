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
.yui-brand__text { display: grid; gap: 2px; }
.yui-brand__title { font-weight: 700; letter-spacing: 0.2px; }
.yui-brand__slogan { margin: 0; font: inherit; opacity: 0.9; }
.yui-brand__subtitle { margin: 0; opacity: 0.65; }

/* YogaTypePicker baseline */
.yui-yoga-picker { display: grid; gap: 12px; }
.yui-yoga-picker__controls { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.yui-yoga-picker__personas { display: flex; gap: 6px; }
.yui-yoga-picker__persona-btn { font: inherit; padding: 6px 10px; border: 1px solid currentColor; background: transparent; border-radius: 999px; }
.yui-yoga-picker__persona-btn[data-active='true'] { background: currentColor; color: #fff; }
.yui-yoga-picker__search-input { font: inherit; padding: 8px 10px; }
.yui-yoga-picker__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; }
.yui-yoga-picker__card { display: grid; gap: 8px; border: 1px solid currentColor; border-radius: 10px; padding: 10px; }
.yui-yoga-picker__benefits { display: grid; gap: 8px; }
.yui-yoga-picker__benefits-group { display: grid; gap: 4px; }
.yui-yoga-picker__benefits-list { margin: 0; padding-left: 18px; }
.yui-yoga-picker__persona-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.yui-yoga-picker__tag { border: 1px solid currentColor; border-radius: 999px; padding: 2px 8px; font-size: 12px; }
.yui-yoga-picker__select { padding: 8px 12px; }

/* TeacherPicker baseline */
.yui-teacher-picker { display: grid; gap: 16px; }
.yui-teacher-picker__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
.yui-teacher-picker__card { display: grid; gap: 10px; border: 1px solid currentColor; border-radius: 14px; padding: 12px; }
.yui-teacher-picker__header { display: grid; grid-template-columns: 56px 1fr; gap: 10px; align-items: center; }
.yui-teacher-picker__avatar { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; display: block; }
.yui-teacher-picker__title { display: grid; gap: 4px; }
.yui-teacher-picker__name { margin: 0; font-weight: 600; }
.yui-teacher-picker__bio { margin: 0; opacity: 0.75; }
.yui-teacher-picker__tags { display: grid; gap: 6px; }
.yui-teacher-picker__personas, .yui-teacher-picker__yoga-types { display: flex; flex-wrap: wrap; gap: 6px; }
.yui-teacher-picker__tag { border: 1px solid currentColor; border-radius: 999px; padding: 2px 8px; font-size: 12px; }
.yui-teacher-picker__meta { display: flex; gap: 10px; font-size: 12px; opacity: 0.8; }
.yui-teacher-picker__posts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
.yui-teacher-picker__post { aspect-ratio: 1/1; width: 100%; object-fit: cover; border-radius: 8px; }
.yui-teacher-picker__actions { display: none; }
.yui-teacher-picker__card:hover .yui-teacher-picker__actions { display: block; }

/* Ulyxes minimal black & white skin */
[data-skin='ulyxes'] { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
[data-skin='ulyxes'] .yui-pwls {
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 16px;
  padding: 20px;
  background: #fff;
  color: #111;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  gap: 16px;
}
[data-skin='ulyxes'] .yui-pwls__title {
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 0.15px;
}
[data-skin='ulyxes'] .yui-pwls__description { opacity: 0.7; }
[data-skin='ulyxes'] .yui-pwls__input {
  border: none;
  border-bottom: 1px solid rgba(0,0,0,0.25);
  border-radius: 0;
  padding: 8px 0;
  background: transparent;
  color: #111;
  transition: border-color 150ms ease;
}
[data-skin='ulyxes'] .yui-pwls__input:focus {
  outline: none;
  border-bottom-color: #111;
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
  border: none;
  background: transparent;
  color: #111;
  padding: 0;
  border-radius: 0;
  text-decoration: underline;
  text-underline-offset: 3px;
}
[data-skin='ulyxes'] .yui-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Brand – monochrome elegance */
[data-skin='ulyxes'] .yui-brand__title { font-size: 22px; letter-spacing: 0.2px; }
[data-skin='ulyxes'] .yui-brand__slogan { letter-spacing: 0.2px; }
[data-skin='ulyxes'] .yui-brand__subtitle { letter-spacing: 0.15px; }
[data-skin='ulyxes'] .yui-brand__glyph { width: 28px; height: 28px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.6); display: inline-block; }

/* Ulyxes – YogaTypePicker airy, minimal */
[data-skin='ulyxes'] .yui-yoga-picker { gap: 18px; }
[data-skin='ulyxes'] .yui-yoga-picker__personas { gap: 10px; }
[data-skin='ulyxes'] .yui-yoga-picker__persona-btn {
  border: none;
  background: transparent;
  padding: 2px 0;
  border-radius: 0;
  text-decoration: none;
}
[data-skin='ulyxes'] .yui-yoga-picker__persona-btn[data-active='true'] { text-decoration: underline; text-underline-offset: 4px; }
[data-skin='ulyxes'] .yui-yoga-picker__grid { gap: 16px; }
[data-skin='ulyxes'] .yui-yoga-picker__card {
  border: none;
  padding: 14px 16px;
  border-radius: 14px;
  box-shadow: 0 1px 0 rgba(0,0,0,0.08);
}
[data-skin='ulyxes'] .yui-yoga-picker__card-title { font-weight: 600; letter-spacing: 0.2px; margin: 0; }
[data-skin='ulyxes'] .yui-yoga-picker__card-tagline { margin: 0; opacity: 0.65; }
[data-skin='ulyxes'] .yui-yoga-picker__benefits-list { margin: 8px 0 0; padding-left: 18px; opacity: 0.9; }
[data-skin='ulyxes'] .yui-yoga-picker__persona-tags { gap: 8px; }
[data-skin='ulyxes'] .yui-yoga-picker__tag { border: none; padding: 0; text-decoration: underline; text-underline-offset: 3px; font-size: 13px; }
[data-skin='ulyxes'] .yui-yoga-picker__select { text-decoration: underline; text-underline-offset: 3px; align-self: start; }
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
