import { useState } from 'react'
import WelcomeScreen from './pages/onboarding/welcome_screen.jsx';

function App() {
  const [count, setCount] = useState(0)

  return <WelcomeScreen />;
}

export default App
