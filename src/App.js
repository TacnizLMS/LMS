import './App.css';
import LoginSignupPage from './screens/LoginSignupPage';
import ForgotPassword from './screens/forgetPassword';
import OtpScreen from './screens/otpScreen';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResetPassword from './screens/resetPassword';
import SignUp from './screens/signUp';
import Sidebar from './components/sideBar';
import LogoutPopup from './screens/logOutPopUp';
import Dashboard from './screens/dashboard';
import Catalog from './screens/catalog';
import BooksPage from './screens/bookPage';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<LoginSignupPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path='/otpPage' element={<OtpScreen />} />
      <Route path='/reset-password' element={<ResetPassword />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/sidebar' element={<Sidebar />} />
      <Route path='/logout' element={<LogoutPopup />} />
      <Route path='/dashboard' element={<Dashboard />} />
      {/* <Route path='/admin' element={<Admin />} /> */}
      <Route path='/catalog' element={<Catalog />} />
      {/* <Route path='/borrowers' element={<Borrowers />} /> */}
      <Route path='/books' element={<BooksPage />} />
      {/* <Route path='/loans' element={<Loans />} /> */}
      {/* <Route path='/settings' element={<Settings />} /> */}


    </Routes>
  </Router>
  );
}

export default App;
