import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
interface ProtectedRouteProps {
  children: ReactNode;
}

interface TokenInfo {
  nombre: string;
  id: number;
  correo: string;
  rol: string;
}
export function ProtectRouteAdmin({ children }: ProtectedRouteProps) {
  const isAuth = localStorage.getItem("authToken");

  const [user, setUser] = useState<TokenInfo | null>(null);

  useEffect(() => {
    if (isAuth) {
      try {
        const decodedToken: TokenInfo = jwtDecode(isAuth);
        setUser(decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("authTokenPos"); // Limpia el token inválido
      }
    }
  }, [isAuth]);

  if (!isAuth || !user) return <Navigate to="/login" />;

  if (user?.rol !== "ADMIN") {
    return <Navigate to="/dashboard-empleado" />;
  }

  return children;
}
