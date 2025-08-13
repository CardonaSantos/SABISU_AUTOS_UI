"use client";
// src/pages/movimiento-caja/index.tsx
import { useState, useEffect } from "react";
import { MovimientoCajaForm } from "./movimiento-caja-form";
import type { Proveedor } from "./types";
import { getProveedores } from "./api";
import { toast } from "sonner";
import { CajaAbierta } from "../interfaces";

interface PropsMovimientosPage {
  getMovimientosCaja: () => Promise<void>;
  userID: number;
  getCajaAbierta: () => Promise<CajaAbierta | null>;
  reloadContext: () => Promise<void>;
}

export default function MovimientoCajaPage({
  getMovimientosCaja,
  userID,
  getCajaAbierta,
  reloadContext,
}: PropsMovimientosPage) {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loadingProveedores, setLoadingProveedores] = useState(true);
  const [errorProveedores, setErrorProveedores] = useState<string | null>(null);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        setLoadingProveedores(true);
        const data = await getProveedores();
        setProveedores(data);
      } catch (error: any) {
        setErrorProveedores(error.message);
        toast.error("Error al cargar los proveedores: " + error.message);
      } finally {
        setLoadingProveedores(false);
      }
    };

    fetchProveedores();
  }, []);

  if (loadingProveedores) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p>Cargando proveedores...</p>
      </div>
    );
  }

  if (errorProveedores) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-red-500">
        <p>Error: {errorProveedores}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* Configuración de Sonner */}
      <MovimientoCajaForm
        proveedores={proveedores}
        getMovimientosCaja={getMovimientosCaja}
        userID={userID}
        getCajaAbierta={getCajaAbierta}
        reloadContext={reloadContext}
      />
    </div>
  );
}
