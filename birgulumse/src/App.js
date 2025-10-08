import { Navigate, Route, Routes } from './lib/router';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import AdminDashboardPage from './pages/AdminDashboard';
import CreateListingPage from './pages/CreateListing';
import DonorDashboardPage from './pages/DonorDashboard';
import HomePage from './pages/Home';
import ListingDetailPage from './pages/ListingDetail';
import ListingsPage from './pages/Listings';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import { ROLES } from './lib/constants';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listings/:id" element={<ListingDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/create-listing"
          element={
            <ProtectedRoute allowRoles={[ROLES.DONOR]}>
              <CreateListingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowRoles={[ROLES.DONOR]}>
              <DonorDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowRoles={[ROLES.ADMIN]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
