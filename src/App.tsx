import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-bg">
        <div className="flex flex-col items-center gap-4 rounded-[28px] border border-[rgba(255,255,255,0.72)] bg-[rgba(255,255,255,0.8)] px-8 py-7 shadow-card backdrop-blur">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-soft border-t-brand"></div>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">ziing.ai</p>
            <p className="mt-1 text-sm font-medium text-ink-base">Loading workspace</p>
          </div>
        </div>
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
