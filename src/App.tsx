import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PreferenceProvider } from './context/PreferenceContext';
import { ScheduleProvider } from './context/ScheduleContext';
import AppLayout from './components/layout/AppLayout';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// User
import SignUpPage from './pages/User/SignUpPage';
import LoginPage from './pages/User/LoginPage';
import ProfilePage from './pages/User/ProfilePage';
import ProfileEditPage from './pages/User/ProfileEditPage';
import OnboardingPage from './pages/User/OnboardingPage';
import HomePage from './pages/User/HomePage';

// Restaurant
import RestaurantListPage from './pages/Restaurant/RestaurantListPage';
import RestaurantDetailPage from './pages/Restaurant/RestaurantDetailPage';
import RestaurantSearchPage from './pages/Restaurant/RestaurantSearchPage';
import RestaurantMapPage from './pages/Restaurant/RestaurantMapPage';

// Schedule
import ScheduleListPage from './pages/Schedule/ScheduleListPage';
import ScheduleCreatePage from './pages/Schedule/ScheduleCreatePage';
import ScheduleDetailPage from './pages/Schedule/ScheduleDetailPage';
import ScheduleEditPage from './pages/Schedule/ScheduleEditPage';

function RootRedirect() {
  const { isAuthenticated, hasCompletedOnboarding, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted">
        로딩 중...
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasCompletedOnboarding) return <Navigate to="/onboarding" replace />;
  return <Navigate to="/home" replace />;
}

export default function App() {
  return (
    <PreferenceProvider>
      <AuthProvider>
        <ScheduleProvider>
          <BrowserRouter>
        <Routes>
          {/* 루트 */}
          <Route path="/" element={<RootRedirect />} />

          {/* 인증 (하단 네비 없음) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 메인 앱 (하단 네비 포함) */}
          <Route element={<AppLayout />}>
            <Route
              path="/home"
              element={
                <ProtectedRoute requireOnboarding>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <ProfileEditPage />
                </ProtectedRoute>
              }
            />

            {/* Restaurant */}
            <Route
              path="/restaurants"
              element={
                <ProtectedRoute requireOnboarding>
                  <RestaurantListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurants/search"
              element={
                <ProtectedRoute requireOnboarding>
                  <RestaurantSearchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurants/map"
              element={
                <ProtectedRoute requireOnboarding>
                  <RestaurantMapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurants/:id"
              element={
                <ProtectedRoute requireOnboarding>
                  <RestaurantDetailPage />
                </ProtectedRoute>
              }
            />

            {/* Schedule */}
            <Route
              path="/schedules"
              element={
                <ProtectedRoute requireOnboarding>
                  <ScheduleListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedules/new"
              element={
                <ProtectedRoute requireOnboarding>
                  <ScheduleCreatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedules/:id"
              element={
                <ProtectedRoute requireOnboarding>
                  <ScheduleDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedules/:id/edit"
              element={
                <ProtectedRoute requireOnboarding>
                  <ScheduleEditPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
          </BrowserRouter>
        </ScheduleProvider>
      </AuthProvider>
    </PreferenceProvider>
  );
}
