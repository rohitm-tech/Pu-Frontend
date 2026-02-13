import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const { user, isAuthenticated, loading, login, logout } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={login} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Signup onLogin={login} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
              <Dashboard user={user} onLogout={logout} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
