import * as React from 'react'
import { 
  Button, 
  TeacherOnboarding,
  NavBar,
  TeacherClassesList,
  PasswordlessSignup
} from '@yoga/ui'
import '@yoga/ui/styles.css'
import { useHeadlessEmailAuth } from './auth'
import { useTeacherClassRequests } from './hooks/useTeacherClassRequests'
import { useTeacherActions } from './hooks/useTeacherActions'
import { useETHPrice } from './hooks/useETHPrice'

type AppStep = 'onboarding' | 'dashboard'

export default function App() {
  const [step, setStep] = React.useState<AppStep>('onboarding')
  const [teacherHandle, setTeacherHandle] = React.useState<string>('')

  // Authentication hooks
  const { ready, authenticated, user, requestCode, confirmCode, logout } = useHeadlessEmailAuth()

  // Extract wallet address from user
  const walletAddress = React.useMemo(() => {
    return user?.wallet?.address as `0x${string}` | undefined
  }, [user])

  // Hooks for class requests and actions
  const { opportunities, upcomingClasses, classHistory, isLoading, error, refreshRequests } = useTeacherClassRequests(teacherHandle)
  
  // Debug log
  console.log('App - opportunities:', opportunities, 'type:', typeof opportunities)
  console.log('App - upcomingClasses:', upcomingClasses, 'type:', typeof upcomingClasses)
  console.log('App - classHistory:', classHistory, 'type:', typeof classHistory)
  const { acceptClass, actionState, resetActionState } = useTeacherActions()
  const { ethPrice } = useETHPrice()

  // Check if teacher has already set their handle and is authenticated
  React.useEffect(() => {
    if (authenticated) {
      const savedHandle = localStorage.getItem('teacherHandle')
      if (savedHandle) {
        setTeacherHandle(savedHandle)
        setStep('dashboard')
      }
    }
  }, [authenticated])

  const handleOnboardingComplete = (igHandle: string) => {
    setTeacherHandle(igHandle)
    localStorage.setItem('teacherHandle', igHandle)
    setStep('dashboard')
  }

  const handleAcceptOpportunity = async (opportunityId: string, escrowId: number, timeIndex: number) => {
    try {
      await acceptClass({
        escrowId,
        teacherHandle,
        timeIndex
      })
      
      // Refresh the opportunities list after successful acceptance
      setTimeout(refreshRequests, 2000) // Wait a bit for blockchain confirmation
    } catch (error) {
      console.error('Failed to accept opportunity:', error)
    }
  }

  const handleIgnoreClass = (classId: number) => {
    // For now, just log the ignore action
    // In a real implementation, you might want to store ignored requests locally
    console.log('Ignoring class request:', classId)
  }

  const handleAcceptGroup = async (groupKey: string) => {
    try {
      // Find the group and accept the first opportunity
      const group = opportunities.find(opp => opp.groupKey === groupKey)
      if (!group || group.opportunities.length === 0) {
        throw new Error('Group not found')
      }
      
      // Accept the first opportunity in the group
      const firstOpp = group.opportunities[0]
      await acceptClass({
        escrowId: firstOpp.escrowId,
        teacherHandle,
        timeIndex: firstOpp.timeIndex
      })
      
      // Refresh the opportunities list after successful acceptance
      setTimeout(refreshRequests, 2000)
    } catch (error) {
      console.error('Failed to accept group class:', error)
    }
  }

  const handleViewDetails = (opportunity: any) => {
    console.log('Viewing details for opportunity:', opportunity)
    // TODO: Implement details modal/view
  }

  const handleViewClassDetails = (escrowId: number) => {
    console.log('Viewing class details for escrow:', escrowId)
    // TODO: Implement class details modal/view
  }

  const handleCancelClass = async (escrowId: number) => {
    console.log('Cancelling class for escrow:', escrowId)
    // TODO: Implement cancel class functionality
    // This would call a cancelClass function from contract
  }

  const handleLogout = () => {
    // Clear teacher handle from localStorage and state
    localStorage.removeItem('teacherHandle')
    setTeacherHandle('')
    setStep('onboarding')
    logout()
  }

  // Loading state while Privy initializes
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

  // Authentication gate - if not authenticated, show login
  if (!authenticated) {
    return (
      <div style={{ 
        fontFamily: 'sans-serif',
        minHeight: '100vh',
        background: '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <PasswordlessSignup
          onRequestCode={requestCode}
          onVerifyCode={confirmCode}
          skin="ulyxes"
          title="Teacher Login"
          description="Enter your email to access your teacher dashboard"
        />
      </div>
    )
  }

  // Onboarding step  
  if (step === 'onboarding') {
    return (
      <div style={{ 
        fontFamily: 'sans-serif',
        minHeight: '100vh',
        background: '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <TeacherOnboarding
          onComplete={handleOnboardingComplete}
          onSkip={() => handleOnboardingComplete('@teacher')} // fallback
        />
      </div>
    )
  }

  // Dashboard step
  return (
    <div style={{ 
      fontFamily: 'sans-serif',
      minHeight: '100vh',
      background: '#fafafa'
    }}>
      <NavBar
        skin="ulyxes"
        title="Teacher Dashboard"
        slogan={`Welcome, ${teacherHandle} • ${walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'No wallet'}`}
        onLogout={handleLogout}
        logoutLabel="Log out"
      />

      <TeacherClassesList
        opportunities={opportunities}
        upcomingClasses={upcomingClasses}
        classHistory={classHistory}
        teacherHandle={teacherHandle}
        onAcceptOpportunity={handleAcceptOpportunity}
        onAcceptGroup={handleAcceptGroup}
        onViewDetails={handleViewDetails}
        onViewClassDetails={handleViewClassDetails}
        onCancelClass={handleCancelClass}
        ethToFiatRate={ethPrice || undefined}
        fiatCurrency="USD"
      />
    </div>
  )
}

