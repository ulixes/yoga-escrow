import * as React from 'react'
import { 
  Button, 
  PasswordlessSignup, 
  Brand, 
  FullJourney,
  BalanceDisplay,
  InsufficientFunds,
  PaymentConfirmation,
  TransactionConfirmation,
  TransactionError
} from '@yoga/ui'
import type { FullJourneyResult, YogaTypeItem, YogaDay, PaymentSummary } from '@yoga/ui'
import '@yoga/ui/styles.css'
import { useHeadlessEmailAuth } from './auth'
import { useBookingFlow } from './hooks/useBookingFlow'
import { useETHBalance } from './hooks/useETHBalance'
import { useFundWallet } from './hooks/useFundWallet'
import { useETHPrice } from './hooks/useETHPrice'
import { CLASS_PRICE_USD } from './config/constants'
import { History } from './components/History'

export default function App() {
  const { ready, authenticated, user, requestCode, confirmCode, logout } = useHeadlessEmailAuth()
  
  const { 
    ethBalance,
    ethBalanceFormatted,
    isLoading: isBalanceLoading,
    error: balanceError,
    refreshBalance 
  } = useETHBalance()

  const { 
    fundWallet,
    showFundingInstructions,
    copyWalletAddress,
    walletAddress,
    canFund
  } = useFundWallet()

  const { 
    usdPrice: ethPrice,
    isLoading: isPriceLoading,
    error: priceError,
    ethToUSD
  } = useETHPrice()
  
  // Resilient email extraction for prefill (covers older sessions)
  const studentEmail = React.useMemo(() => {
    const u: any = user
    return (
      u?.email?.address ||
      u?.emails?.[0]?.address ||
      (u?.linkedAccounts || []).find((a: any) => a?.type === 'email')?.address ||
      ''
    )
  }, [user])

  const { 
    step,
    journeyResult,
    bookingPayload,
    paymentState,
    loading,
    error,
    handleJourneyComplete,
    updatePaymentState,
    estimateGasForBooking,
    validatePaymentAndProceed,
    confirmPayment,
    contractState,
    transactionHash,
    escrowId,
    goToStep
  } = useBookingFlow(studentEmail, walletAddress, ethPrice)

  // Update payment state when balance changes
  React.useEffect(() => {
    if (step === 'payment' && paymentState && paymentState.isCheckingBalance) {
      console.log('Debug - Triggering payment state update with ETH balance:', ethBalanceFormatted)
      // Use actual ETH balance from wallet hook
      if (balanceError) {
        updatePaymentState('0', balanceError)
      } else {
        updatePaymentState(ethBalanceFormatted, undefined, paymentState.gasEstimate) // Use real ETH balance
      }
    }
  }, [step, paymentState?.isCheckingBalance, ethBalanceFormatted, balanceError])

  // Estimate gas when payment step starts
  React.useEffect(() => {
    if (step === 'payment' && bookingPayload && walletAddress && !paymentState?.gasEstimate && ethBalanceFormatted) {
      console.log('Estimating gas for payment step...')
      estimateGasForBooking(ethBalanceFormatted)
    }
  }, [step, bookingPayload, walletAddress, paymentState?.gasEstimate, ethBalanceFormatted, estimateGasForBooking])

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

  // Yoga configuration data
  const yogaTypes: YogaTypeItem[] = [
    {
      id: 'vinyasa',
      name: 'Vinyasa',
      tagline: 'Flow with breath',
      personas: ['runner', 'traveler', 'dancer'],
      benefits: {
        runner: ['Build heat', 'Mobility for stride', 'Core stability'],
        traveler: ['Shake off jet lag', 'Improve circulation', 'Clear mind'],
        dancer: ['Fluidity & balance', 'Expressive flow']
      }
    },
    {
      id: 'yin',
      name: 'Yin',
      tagline: 'Deep stretch',
      personas: ['runner', 'traveler'],
      benefits: {
        runner: ['Post-run recovery', 'Hip opening'],
        traveler: ['Reset nervous system', 'Gentle decompression'],
        dancer: ['Release fascia']
      }
    },
    {
      id: 'hatha',
      name: 'Hatha',
      tagline: 'Foundational & calm',
      personas: ['runner', 'traveler', 'dancer'],
      benefits: {
        runner: ['Steady strength'],
        traveler: ['Grounding breath'],
        dancer: ['Alignment & control']
      }
    }
  ]

  const days: YogaDay[] = [
    { id: 'mon', label: 'Monday', times: [
      { id: '06:00', label: '6:00 AM' },
      { id: '09:00', label: '9:00 AM' },
      { id: '18:00', label: '6:00 PM', sublabel: 'Peak' }
    ]},
    { id: 'tue', label: 'Tuesday', times: [
      { id: '06:00', label: '6:00 AM' },
      { id: '09:00', label: '9:00 AM' },
      { id: '18:00', label: '6:00 PM', sublabel: 'Peak' }
    ]},
    { id: 'wed', label: 'Wednesday', times: [
      { id: '06:00', label: '6:00 AM' },
      { id: '09:00', label: '9:00 AM' },
      { id: '18:00', label: '6:00 PM', sublabel: 'Peak' }
    ]},
    { id: 'thu', label: 'Thursday', times: [
      { id: '06:00', label: '6:00 AM' },
      { id: '09:00', label: '9:00 AM' },
      { id: '18:00', label: '6:00 PM', sublabel: 'Peak' }
    ]},
    { id: 'fri', label: 'Friday', times: [
      { id: '06:00', label: '6:00 AM' },
      { id: '09:00', label: '9:00 AM' },
      { id: '17:30', label: '5:30 PM', sublabel: 'Peak' }
    ]},
    { id: 'sat', label: 'Saturday', times: [
      { id: '09:00', label: '9:00 AM' },
      { id: '10:00', label: '10:00 AM' }
    ]},
    { id: 'sun', label: 'Sunday', times: [
      { id: '09:30', label: '9:30 AM' },
      { id: '14:00', label: '2:00 PM' }
    ]}
  ]

  const handleSubmit = (result: FullJourneyResult) => {
    handleJourneyComplete(result)
  }

  const handlePaymentProceed = async () => {
    if (bookingPayload) {
      try {
        await validatePaymentAndProceed(bookingPayload)
        // Success state will be handled by the booking flow hook
      } catch (error) {
        console.error('Payment confirmation failed:', error)
        // Error state will be handled by the booking flow hook
      }
    }
  }

  return (
    <div style={{ 
      fontFamily: 'sans-serif',
      minHeight: '100vh',
      background: '#fafafa'
    }}>
      <div style={{ 
        padding: '12px 24px',
        background: 'white',
        borderBottom: '1px solid #e0e0e0',
        marginBottom: 24
      }}>
        <div style={{ 
          maxWidth: 1200, 
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}>
          <Brand
            title="Ulyxes"
            slogan="Yoga everywhere.. anytime.."
            orientation="horizontal"
            size="sm"
            logoVariant="wave"
            skin="ulyxes"
          />
        </div>
      </div>

      {/* Journey Step */}
      {step === 'journey' && (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <FullJourney
            yogaTypes={yogaTypes}
            yogaTypePersonas={['runner', 'traveler', 'dancer']}
            days={days}
            defaultPersona="Traveler"
            defaultStudentEmail={studentEmail}
            locationProps={{
              country: 'Georgia',
              city: 'Tbilisi',
              options: ['Vake Park', 'Lisi Lake', 'Turtle Lake']
            }}
            onSubmit={handleSubmit}
            skin="ulyxes"
          />
        </div>
      )}

      {/* Payment Step */}
      {step === 'payment' && journeyResult && bookingPayload && paymentState && (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
          <h2 style={{ marginBottom: 24 }}>Payment</h2>
          
          <BalanceDisplay 
            balanceUSDC={ethToUSD(ethBalanceFormatted)}
            minimumUSDC={paymentState.totalCostUSD || CLASS_PRICE_USD}
            skin="ulyxes"
          />
          
          {!paymentState.hasSufficientBalance && (
            <InsufficientFunds
              neededUSDC={ethToUSD(paymentState.shortfallAmount)}
              onAddFunds={fundWallet}
              onCancel={() => goToStep('journey')}
              skin="ulyxes"
            />
          )}
          
          {paymentState.hasSufficientBalance && (
            <PaymentConfirmation
              summary={{
                costUSDC: CLASS_PRICE_USD,
                currentBalanceUSDC: ethToUSD(ethBalanceFormatted),
                estimatedGasFeeETH: paymentState.gasEstimate ? parseFloat(paymentState.gasEstimate.gasFeeETH) : undefined,
                estimatedGasFeeUSD: paymentState.gasEstimate?.gasFeeUSD,
                totalCostWithGas: paymentState.totalCostUSD
              }}
              onConfirm={handlePaymentProceed}
              onCancel={() => goToStep('journey')}
              skin="ulyxes"
            />
          )}
        </div>
      )}

      {/* Confirmation Step */}
      {step === 'confirmation' && transactionHash && (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
          <TransactionConfirmation
            transactionHash={transactionHash}
            escrowId={escrowId?.toString()}
            onViewTransaction={() => {
              window.open(`https://sepolia.basescan.org/tx/${transactionHash}`, '_blank')
            }}
            onBackToHome={() => goToStep('journey')}
            skin="ulyxes"
          />
        </div>
      )}
      
      {/* Error State */}
      {error && step === 'payment' && (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
          <TransactionError
            error={error}
            onRetry={() => {
              if (bookingPayload) {
                confirmPayment()
              }
            }}
            onCancel={() => goToStep('journey')}
            skin="ulyxes"
          />
        </div>
      )}

      {/* Booking History */}
      {walletAddress && (
        <div style={{ padding: '24px 0' }}>
          <History studentAddress={walletAddress as `0x${string}`} />
        </div>
      )}
    </div>
  )
}
