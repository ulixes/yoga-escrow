import { Button } from '@yoga/ui'

export default function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h1>Yoga Escrow — Student</h1>
      <p>Create offers and manage bookings.</p>
      <Button onClick={() => alert('Hello Student')}>Hello Student</Button>
    </div>
  )
}

