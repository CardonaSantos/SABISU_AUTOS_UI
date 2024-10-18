import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuth = localStorage.getItem("authTokenPos") !== null; //esto ya es un booleano si o no

  return isAuth ? children : <Navigate to="/login" />;
}
