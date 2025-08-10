"use client";
// src/pages/movimiento-caja/index.tsx
import { useState, useEffect } from "react";
import { MovimientoCajaForm } from "./movimiento-caja-form";
import type { Proveedor } from "./types";
import { getProveedores } from "./api";
import { Toaster, toast } from "sonner"; // Importa Toaster y toast de sonner

export default function MovimientoCajaPage() {
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

  // Función de callback para refrescar los movimientos de caja
  // Esta función sería pasada por el componente padre real
  const handleGetMovimientosCaja = () => {
    console.log("Función getMovimientosCaja llamada: Refrescando datos...");
    // Aquí iría la lógica para volver a cargar la lista de movimientos de caja
    // Por ejemplo, si tuvieras una tabla de movimientos en esta misma página,
    // la actualizarías aquí.
  };

  const handleFormSuccess = () => {
    console.log(
      "Formulario enviado exitosamente. Realizando acciones post-envío."
    );
    // Aquí podrías añadir lógica adicional después de un envío exitoso,
    // como navegar a otra página o mostrar un mensaje global.
  };

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
    <div className="container mx-auto py-8 px-4">
      <Toaster richColors position="top-right" />{" "}
      {/* Configuración de Sonner */}
      <MovimientoCajaForm
        proveedores={proveedores}
        onSuccess={handleFormSuccess}
        getMovimientosCaja={handleGetMovimientosCaja}
      />
    </div>
  );
}
