import { Navigate } from '../lib/router';
import { useAuth } from '../lib/AuthContext';

export function ProtectedRoute({ allowRoles, children }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-brand-700">
        Durum doğrulanıyor...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowRoles && !allowRoles.includes(profile?.role)) {
    return <Navigate to="/" replace />;
  }

  return children ?? null;
}
