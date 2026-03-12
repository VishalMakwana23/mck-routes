import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FCEFE5] border-t-[#0B3B32]"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Root Path - Redirect depending on auth state */}
      <Route 
        path="/" 
        element={
          user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } 
      />

      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
