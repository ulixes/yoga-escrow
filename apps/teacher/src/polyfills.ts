// Minimal browser polyfills for Node globals some deps expect
// Buffer polyfill
import { Buffer } from 'buffer'

declare global {
  interface Window {
    Buffer?: typeof Buffer
  }
}

if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
  window.Buffer = Buffer
}