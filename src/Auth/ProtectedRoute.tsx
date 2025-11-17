import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  const role = localStorage.getItem("role"); 
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/mainpage" replace />;
  }

  if (location.pathname.startsWith("/superadmin") && role !== "superadmin") {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  if (location.pathname.startsWith("/admin") && role !== "admin") {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  if (location.pathname.startsWith("/user") && role !== "user") {
    return <Navigate to={`/${role}/home`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
