import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ChapterDetail } from './pages/ChapterDetail';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AnimatedBackground } from './components/AnimatedBackground';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-900 relative">
        <AnimatedBackground />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Home page - accessible to both guests and authenticated users */}
          <Route path="/" element={<RegisterPage />} />
          
          {/* Protected Routes - require authentication */}
          <Route path="/chapter/:id" element={
            <ProtectedRoute>
              <ChapterDetail />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;