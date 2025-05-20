// src/App.js
import { Routes, Route } from 'react-router-dom'; // ⬅️ No `BrowserRouter` here
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Home from './pages/Home';
import AddCrop from './pages/AddCrop';
import CropStages from './pages/CropStages';
import ProtectedRoute from './components/ProtectedRoute';
import CropOrders from './pages/CropOrders';
import EditProfile from './pages/EditProfile';

function App() {
  return (
    <AuthProvider>
      <Navigation />
      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
             <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Home />} />
          <Route path="/add-crop" element={<AddCrop />} />
          <Route path="/crops/:cropId/stages" element={<CropStages />} />
          <Route path="/crops/:cropId/orders" element={<CropOrders />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          </Route>
        </Routes>
      </div>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
