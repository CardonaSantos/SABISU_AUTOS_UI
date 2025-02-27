import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { useStore } from "../Context/ContextSucursal";
import gif from "@/assets/loading.gif";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectRouteAdmin({ children }: ProtectedRouteProps) {
  const isAuth = localStorage.getItem("authTokenPos");
  const userRol = useStore((state) => state.userRol);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRol) {
      setLoading(false);
    }
  }, [isAuth, userRol]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-2">
        <img src={gif} alt="Cargando..." className="w-16 h-16 object-contain" />
        <p className="text-lg font-semibold text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!isAuth || !userRol) return <Navigate to="/dashboard" />;

  if (userRol !== "ADMIN") {
    return <Navigate to="/dashboard-empleado" />;
  }

  return children;
}
