import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

/**
 * Gates a route tree behind login and (optionally) a role.
 * `roles` may be a single role string or an array; omit to allow any logged-in user.
 * `loginPath` is where to bounce an unauthenticated visitor, with a return-to.
 */
export default function RequireAuth({ roles, loginPath, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas text-muted">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Accounts with a school-issued temporary password must choose their own first.
  if (user.mustChangePassword && location.pathname !== "/account/password") {
    return <Navigate to="/account/password" replace />;
  }

  const allowed = roles ? (Array.isArray(roles) ? roles.includes(user.role) : user.role === roles) : true;
  if (!allowed) {
    return <Navigate to={loginPath} replace />;
  }

  return children;
}
