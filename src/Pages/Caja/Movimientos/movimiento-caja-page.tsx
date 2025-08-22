"use client";
// src/pages/movimiento-caja/index.tsx
import type { Proveedor } from "./types";

import { MovimientoFinancieroForm } from "./movimiento-caja-form";
import { CuentaBancaria } from "./movimientos-financieros";

interface PropsMovimientosPage {
  getMovimientosCaja: () => Promise<void>;
  userID: number;
  reloadContext: () => Promise<void>;
  proveedores: Proveedor[];
  cuentasBancarias: CuentaBancaria[];
}

export default function MovimientoCajaPage({
  userID,
  reloadContext,
  proveedores,
  cuentasBancarias,
}: PropsMovimientosPage) {
  return (
    <div className="container mx-auto">
      {/* Configuración de Sonner */}
      <MovimientoFinancieroForm
        cuentasBancarias={cuentasBancarias}
        proveedores={proveedores}
        userID={userID}
        reloadContext={reloadContext}
      />
    </div>
  );
}
