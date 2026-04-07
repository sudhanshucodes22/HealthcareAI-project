import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DiseasePredictor from './pages/DiseasePredictor';
import BloodDonation from './pages/BloodDonation';
import MentalHealth from './pages/MentalHealth';
import MedicineReminder from './pages/MedicineReminder';
import EmergencyLocator from './pages/EmergencyLocator';
import Login from './pages/Login';
import Register from './pages/Register';
import HealthInsurance from './pages/HealthInsurance';
import OnlineAppointments from './pages/OnlineAppointments';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/disease-predictor" element={<DiseasePredictor />} />
            <Route path="/blood-donation" element={<BloodDonation />} />
            <Route path="/mental-health" element={<MentalHealth />} />
            <Route path="/medicine-reminder" element={<MedicineReminder />} />
            <Route path="/emergency-locator" element={<EmergencyLocator />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/health-insurance" element={<HealthInsurance />} />
            <Route path="/online-appointments" element={<OnlineAppointments />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
