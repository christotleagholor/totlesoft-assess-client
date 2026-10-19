import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SSO } from './pages/SSO';
import { Dashboard } from './pages/Dashboard';
import { Guidelines } from './pages/Guidelines';
import { Practice } from './pages/Practice';
import { RealTest } from './pages/RealTest';
import { Result } from './pages/Result';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sso" element={<SSO />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assessment/guidelines" element={<Guidelines />} />
        <Route path="/assessment/practice" element={<Practice />} />
        <Route path="/assessment/test" element={<RealTest />} />
        <Route path="/assessment/result" element={<Result />} />
        <Route path="*" element={<Navigate to="/sso" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;