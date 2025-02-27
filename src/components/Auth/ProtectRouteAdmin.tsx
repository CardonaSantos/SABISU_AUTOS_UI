import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "../Context/ContextSucursal";
import gif from "@/assets/loading.gif";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export function ProtectRouteAdmin({ children }: ProtectedRouteProps) {
  const userRol = useStore((state) => state.userRol);

  // We'll track our local "still checking userRol" state:
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If userRol is `undefined` (or empty string) => we haven't fetched yet => keep loading
    // If userRol is ANYTHING else (null or a real role), we can stop loading
    if (userRol !== undefined && userRol !== "") {
      setLoading(false);
    }
  }, [userRol]);

  // 1) If we’re still fetching userRol, show spinner
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-2">
        <img src={gif} alt="Cargando..." className="w-16 h-16 object-contain" />
        <p className="text-lg font-semibold text-gray-600">Cargando...</p>
      </div>
    );
  }

  // 2) If userRol is `null`, it means we confirmed the user is NOT logged in => go to login
  if (userRol === null) {
    return <Navigate to="/login" />;
  }

  // 3) If userRol is not "ADMIN", send them to the empleado dashboard
  if (userRol !== "ADMIN") {
    return <Navigate to="/dashboard-empleado" />;
  }

  // 4) If userRol is "ADMIN", everything’s fine: show the route
  return children;
}
