import './App.css';
import LoginSignupPage from './screens/LoginSignupPage';
import ForgotPassword from './screens/forgetPassword';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<LoginSignupPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  </Router>
  );
}

export default App;
