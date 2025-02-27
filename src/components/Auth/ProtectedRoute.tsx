import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import gif from "@/assets/loading.gif";
import { useStore } from "../Context/ContextSucursal";
interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // const isAuth = localStorage.getItem("authTokenPos") !== null; //esto ya es un booleano si o no
  const userRol = useStore((state) => state.userRol);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (userRol) {
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

  return userRol ? children : <Navigate to="/login" />;
}
