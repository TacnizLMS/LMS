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
import FinePage from './screens/fine';
import DashboardAdmin from './screens/admin_Pages/dashboardAdmin';
import CatalogAdmin from './screens/admin_Pages/catalogAdmin';
import BooksPageAdmin from './screens/admin_Pages/bookPageAdmin';
import UserPageAdmin from './screens/admin_Pages/userPageAdmin';
import FineAdmin from './screens/admin_Pages/fineAdmin';

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
      <Route path='/catalog' element={<Catalog />} />
      <Route path='/books' element={<BooksPage />} />
      <Route path='/fine' element={<FinePage />} />
      <Route path='/admin-dashboard' element={<DashboardAdmin />} />
      <Route path='/catalog-admin' element={<CatalogAdmin />} />
      <Route path='/books-admin' element={<BooksPageAdmin />} />
      <Route path='/userPageAdmin' element={<UserPageAdmin />} />
      <Route path='/admin-fine' element={<FineAdmin />} />



    </Routes>
  </Router>
  );
}

export default App;
