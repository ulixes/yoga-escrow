import * as React from 'react'
import { Button, PasswordlessSignup, Brand } from '@yoga/ui'
import '@yoga/ui/styles.css'
import { useHeadlessEmailAuth } from './auth'

export default function App() {
  const { ready, authenticated, user, requestCode, confirmCode, logout } = useHeadlessEmailAuth()

  if (!ready) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        fontFamily: 'sans-serif'
      }}>
        Loading…
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 24,
        fontFamily: 'sans-serif'
      }}>
        <div style={{ 
          display: 'grid', 
          gap: 24, 
          maxWidth: 440, 
          width: '100%' 
        }}>
          <Brand
            title="Ulyxes"
            slogan="Yoga everywhere.. anytime.."
            subtitle="Move with breath. Find your space."
            orientation="vertical"
            size="lg"
            logoVariant="wave"
            skin="ulyxes"
          />
          <PasswordlessSignup
            onRequestCode={requestCode}
            onVerifyCode={confirmCode}
            onSuccess={() => {}}
            skin="ulyxes"
            translations={{
              enterEmailTitle: 'Sign up or log in',
              enterEmailDescription: 'Enter your email to get started with Yoga Escrow'
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      fontFamily: 'sans-serif', 
      padding: 24,
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <Brand
            title="Ulyxes"
            slogan="Ulyxes. Yoga everywhere.. anytime.."
            orientation="horizontal"
            size="md"
            logoVariant="wave"
            skin="ulyxes"
          />
        </div>
        
        <div style={{ marginBottom: 24 }}>
          <h2>Student Dashboard</h2>
          <p>Welcome, {user?.email?.address || 'student'}!</p>
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Button onClick={() => logout()} variant="secondary">
            Log out
          </Button>
        </div>
      </div>
    </div>
  )
}
