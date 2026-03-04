import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './pages/Auth/LoginPage';
import { ProfileSetupPage } from './pages/Auth/ProfileSetupPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { RecordListPage } from './pages/RecordList/RecordListPage';
import { PlayerDetailPage } from './pages/PlayerDetail/PlayerDetailPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { ItemsPage } from './pages/Items/ItemsPage';
import { ItemDetailPage } from './pages/Items/ItemDetailPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicy/PrivacyPolicyPage';

const router = createBrowserRouter([
  /* ── Public routes ── */
  { path: '/login', element: <LoginPage /> },
  { path: '/setup', element: <ProfileSetupPage /> },

  /* ── Protected routes ── */
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'records/new', element: <Navigate to="/records" replace /> },
      { path: 'records', element: <RecordListPage /> },
      { path: 'players/:id', element: <PlayerDetailPage /> },
      { path: 'tools', element: <ItemsPage /> },
      { path: 'tools/:toolKey', element: <ItemDetailPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
