// PROTECTOR PARA CUALQUIER USUARIO LOGUEADO
import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { useStore } from "../Context/ContextSucursal";
import gif from "@/assets/loading.gif";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const userRol = useStore((state) => state.userRol);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRol !== undefined && userRol !== "") {
      setLoading(false);
    }
  }, [userRol]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-2">
        <img src={gif} alt="Cargando..." className="w-16 h-16 object-contain" />
        <p className="text-lg font-semibold text-gray-600">Cargando...</p>
      </div>
    );
  }

  // If userRol is `null`, we know user is not logged in
  if (userRol === null) {
    return <Navigate to="/login" />;
  }

  // Otherwise, userRol is set to something valid => show the route
  return children;
}
