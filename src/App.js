import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import HomeClient from './pages/client-pages/HomeClient';
import HomeSaloon from './pages/saloon-pages/HomeSaloon';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import Search from './pages/client-pages/Search';
import Bookings from './pages/client-pages/Bookings';
import SalonMap from './pages/client-pages/Map';
import SalonProfile from './pages/client-pages/SalonProfile';
import BookAppointment from './pages/client-pages/BookAppointment';
import Profile from './pages/client-pages/Profile';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ✅ Protected Routes */}
          <Route
            path="/home-client"
            element={
              <PrivateRoute requiredType="client">
                <HomeClient />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute requiredType="client">
                <HomeClient />
              </PrivateRoute>
            }
          />

          <Route
            path="/search"
            element={
              <PrivateRoute requiredType="client">
                <Search />
              </PrivateRoute>
            }
          />
          <Route
            path="/map"
            element={
              <PrivateRoute requiredType="client">
                <SalonMap />
              </PrivateRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <PrivateRoute requiredType="client">
                <Bookings />
              </PrivateRoute>
            }
          />
          <Route
            path="/salon/:id"
            element={
              <PrivateRoute requiredType="client">
                <SalonProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/book/:salonId"
            element={
              <PrivateRoute requiredType="client">
                <BookAppointment />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute requiredType="client">
                <Profile />
              </PrivateRoute>
            }
          />


          <Route
            path="/home-saloon"
            element={
              <PrivateRoute requiredType="saloon">
                <HomeSaloon />
              </PrivateRoute>
            }
          />
          

          <Route path="/login" element={<Login />} />
          <Route path="/register-new" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
