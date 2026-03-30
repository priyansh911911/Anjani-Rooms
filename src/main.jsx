import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './admin/AuthContext.jsx'
import ProtectedRoute from './admin/ProtectedRoute.jsx'
import AdminLogin from './admin/pages/AdminLogin.jsx'
import AdminLayout from './admin/pages/AdminLayout.jsx'
import AdminDashboard from './admin/pages/AdminDashboard.jsx'
import AdminRooms from './admin/pages/AdminRooms.jsx'
import RoomForm from './admin/pages/RoomForm.jsx'
import AdminCategories from './admin/pages/AdminCategories.jsx'
import AdminSettings from './admin/pages/AdminSettings.jsx'
import AdminGallery from './admin/pages/AdminGallery.jsx'
import About from './pages/About.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="rooms" element={<AdminRooms />} />
            <Route path="rooms/new" element={<RoomForm />} />
            <Route path="rooms/:id/edit" element={<RoomForm />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="gallery" element={<AdminGallery />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
