import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import CropTypes from './pages/CropTypes';
import Crops from './pages/Crops';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminDashboard from './pages/AdminDashboard';
import { ToastContainer } from 'react-toastify';
import FarmersByCrop from './pages/FarmersByCrop';
import OrderDetails from './pages/OrderDetails';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navigation />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/crop-types" element={<CropTypes />} />
            <Route path="/crops" element={<Crops />} />
            <Route path="/crop/:id/farmers" element={<FarmersByCrop />} />
            <Route path="/order-details" element={<OrderDetails/>}/>
          </Routes>
        </div>
      </AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Router>
  );
}

export default App;