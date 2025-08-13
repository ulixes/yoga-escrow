import { useCallback } from 'react'
import { usePrivy, useLoginWithEmail } from '@privy-io/react-auth'

export function useHeadlessEmailAuth() {
  const { ready, authenticated, user, getAccessToken, logout } = usePrivy()
  const { sendCode, loginWithCode } = useLoginWithEmail()
  
  console.log('[AUTH DEBUG] ready:', ready)
  console.log('[AUTH DEBUG] authenticated:', authenticated)
  console.log('[AUTH DEBUG] user in auth hook:', user)

  const requestCode = useCallback(async (email: string) => {
    try {
      await sendCode({ email })
    } catch (error) {
      console.error('Failed to send code:', error)
      throw error
    }
  }, [sendCode])

  const confirmCode = useCallback(async (email: string, code: string) => {
    try {
      console.log('[AUTH DEBUG] Attempting login with:', { email, code })
      const result = await loginWithCode({ code })
      console.log('[AUTH DEBUG] Login result:', result)
      console.log('[AUTH DEBUG] User after login:', user)
    } catch (error) {
      console.error('[AUTH DEBUG] Failed to verify code:', error)
      throw error
    }
  }, [loginWithCode, user])

  return {
    ready,
    authenticated,
    user,
    getAccessToken,
    requestCode,
    confirmCode,
    logout,
  }
}
