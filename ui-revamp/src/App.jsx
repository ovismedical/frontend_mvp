import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomeScreen from "./pages/onboarding/welcome_screen.jsx";
import Onboarding01 from "./pages/onboarding/onboarding01.jsx";
import Onboarding02 from "./pages/onboarding/onboarding02.jsx";
import Onboarding03 from "./pages/onboarding/onboarding03.jsx";
import Onboarding04 from "./pages/onboarding/onboarding04.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/onboarding01" element={<Onboarding01 />} />
        <Route path="/onboarding02" element={<Onboarding02 />} />
        <Route path="/onboarding03" element={<Onboarding03 />} />
        <Route path="/onboarding04" element={<Onboarding04 />} />
      </Routes>
    </Router>
  );
}

export default App
