import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import LandingPage from './pages/Home'; // reusing original Home as Landing
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage'; // Dashboard
import MatchesPage from './pages/MatchesPage';
import VideoChat from './pages/VideoChat';
import Join from './pages/Join'; // Legacy
import ChatPage from './pages/ChatPage';
import CirclesPage from './pages/CirclesPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // Or spinner
  if (!user) return <Navigate to="/auth" />;
  return <Layout>{children}</Layout>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/join" element={<Join />} />

      {/* Protected Routes */}
      <Route path="/onboarding" element={
        <ProtectedRouteWrapper>
          <OnboardingPage />
        </ProtectedRouteWrapper>
      } />
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/matches" element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} />
      <Route path="/live" element={<ProtectedRoute><VideoChat /></ProtectedRoute>} />
      <Route path="/circles" element={<ProtectedRoute><CirclesPage /></ProtectedRoute>} />
      <Route path="/chat/:matchId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
    </Routes>
  );
}

// Separate wrapper needed because hooks in ProtectedRoute need provider
const ProtectedRouteWrapper = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" />;
  return children;
}


function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-neon-purple/30">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  );
}

export default App;
