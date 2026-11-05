import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CommunityMapPage } from './pages/CommunityMapPage';
import { ResourceSharingPage } from './pages/ResourceSharingPage';
import { BloodDonationPage } from './pages/BloodDonationPage';
import { NotificationsPage } from './pages/NotificationsPage';

// Citizen Pages
import { CitizenDashboard } from './pages/CitizenDashboard';
import { CreateHelpRequestPage } from './pages/CreateHelpRequestPage';
import { MyRequestsPage } from './pages/MyRequestsPage';

// Volunteer Pages
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { VolunteerProfilePage } from './pages/VolunteerProfilePage';
import { AvailableRequestsPage } from './pages/AvailableRequestsPage';
import { MyAssignmentsPage } from './pages/MyAssignmentsPage';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { UserManagementPage } from './pages/UserManagementPage';
import { RequestManagementPage } from './pages/RequestManagementPage';

const AppLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Pages that display sidebar when logged in
  const isDashboardView =
    user &&
    (location.pathname.startsWith('/citizen') ||
      location.pathname.startsWith('/volunteer') ||
      location.pathname.startsWith('/admin') ||
      location.pathname === '/notifications');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <div className="flex-1 flex w-full">
        {isDashboardView && <Sidebar />}
        <main className="flex-1 min-w-0 bg-slate-50 overflow-x-hidden">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout>
          <Routes>
            {/* Public Accessible Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/map" element={<CommunityMapPage />} />
            <Route path="/resources" element={<ResourceSharingPage />} />
            <Route path="/blood-donations" element={<BloodDonationPage />} />

            {/* Notifications (Protected) */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />

            {/* Citizen Protected Routes */}
            <Route
              path="/citizen/dashboard"
              element={
                <ProtectedRoute allowedRoles={['citizen', 'admin']}>
                  <CitizenDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/create-request"
              element={
                <ProtectedRoute allowedRoles={['citizen', 'admin']}>
                  <CreateHelpRequestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/my-requests"
              element={
                <ProtectedRoute allowedRoles={['citizen', 'admin']}>
                  <MyRequestsPage />
                </ProtectedRoute>
              }
            />

            {/* Volunteer Protected Routes */}
            <Route
              path="/volunteer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
                  <VolunteerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/volunteer/profile"
              element={
                <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
                  <VolunteerProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/volunteer/available-requests"
              element={
                <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
                  <AvailableRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/volunteer/assignments"
              element={
                <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
                  <MyAssignmentsPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/requests"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <RequestManagementPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </Router>
  );
}
