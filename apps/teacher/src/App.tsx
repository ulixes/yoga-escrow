import { Button } from '@yoga/ui'

export default function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h1>Yoga Escrow — Teacher</h1>
      <p>Accept offers and manage classes.</p>
      <Button onClick={() => alert('Hello Teacher')}>Hello Teacher</Button>
    </div>
  )
}

