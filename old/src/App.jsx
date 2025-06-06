import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import MainPage from "./MainPage";
import PatientLogin from "./patient_login";
import AdminLogin from "./admin_login";
import Dashboard from "./dashboard"
import Dailylogger from "./dailylogger";
import QuizPage from "./quizpage";
import PersonalInfo from "./personal_info";
import FAQ from "./faq";
import DataPage from "./data";
import Settings from "./settings";
import ContactUs from "./contactus";
import CreateAccount from "./patient_create_account";
import AdminDashboard from "./admin_dashboard";
import AdminPatientLookup from "./admin_patient_lookup";
import "./App.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/patientlogin" element={<PatientLogin />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/admin/patient/:username" element={<AdminPatientLookup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dailylogger" element={<Dailylogger />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/personalinfo" element={<PersonalInfo />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/data" element={<DataPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/contactus" element={<ContactUs />} />
      </Routes>
    </Router>
  );
}

export default App;