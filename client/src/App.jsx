import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './routes/ProtectedRoute';

import Login from './pages/Login';
import ComingSoon from './pages/ComingSoon';
import CommandCenter from './pages/CommandCenter';
import Portfolio from './pages/Portfolio';
import Support from './pages/Support';
import Register from './pages/Register';
import KYC from './pages/KYC';
import Admin from './pages/Admin';
import Nominee from './pages/Nominee';
import Statements from './pages/Statements';
import SIPs from './pages/SIPs';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<CommandCenter />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/support" element={<Support />} />
              
              {/* Placeholders */}
              <Route path="/sip" element={<SIPs />} />
              <Route path="/kyc" element={<KYC />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/nominee" element={<Nominee />} />
              <Route path="/statements" element={<Statements />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
