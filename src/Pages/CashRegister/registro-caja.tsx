"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/components/Context/ContextSucursal";
import { CashRegisterForm } from "./cash-register-form";
import { TransactionAccordion } from "./transaction-accordion";
import { cashRegisterApi } from "./cash-register-api";
import {
  RegistroAbierto,
  VentaWithOutCashRegist,
  RegistroCajaInicioFormData,
  RegistroCajaFormData,
} from "./types";
import { Movimiento, TipoMovimientoCaja } from "./interface";

export default function RegistroCaja() {
  const [isCashRegistOpen, setCashRegistIsOpen] = useState(false);
  const [registroAbierto, setRegistroAbierto] = useState<RegistroAbierto>();
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [ventas, setVentas] = useState<VentaWithOutCashRegist[]>([]);
  const [loading, setLoading] = useState(true);

  const sucursalId = useStore((state) => state.sucursalId) ?? 0;
  const usuarioId = useStore((state) => state.userId) ?? 0;
  const userName = useStore((state) => state.userNombre) ?? "";

  const getCashRegistOpen = async () => {
    try {
      const data = await cashRegisterApi.getCashRegistOpen(
        sucursalId,
        usuarioId
      );
      if (data) {
        setCashRegistIsOpen(true);
        setRegistroAbierto(data);
      } else {
        setCashRegistIsOpen(false);
        setRegistroAbierto(undefined);
      }
    } catch (error) {
      toast.error("Error al conseguir registro de caja");
    }
  };

  const getMovimientos = async () => {
    if (!registroAbierto?.id) return;
    try {
      const data = await cashRegisterApi.getMovimientos(registroAbierto.id);
      setMovimientos(data);
    } catch {
      toast.warning("No se pudieron conseguir movimientos de caja");
    }
  };
  const getRegistrosVentas = async () => {
    try {
      const data = await cashRegisterApi.getSales(sucursalId, usuarioId);
      setVentas(data);
    } catch (error) {
      toast.warning("No se pudieron conseguir registros de ventas");
    }
  };

  const handleOpenCashRegister = async (data: RegistroCajaInicioFormData) => {
    try {
      console.log("La data para crear caja en registro-caja es: ", data);

      await cashRegisterApi.openCashRegister(data);
      toast.success("El registro de caja se ha creado correctamente.");
      await getCashRegistOpen();
    } catch (error) {
      toast.error("No se pudo abrir el registro de caja. Intente nuevamente.");
      throw error;
    }
  };

  const handleCloseCashRegister = async (
    data: RegistroCajaFormData & {
      depositosIds: number[];
      egresosIds: number[];
      ventasIds: number[];
      id: number;
    }
  ) => {
    try {
      await cashRegisterApi.closeCashRegister(data);
      toast.success("El registro de caja se ha cerrado correctamente.");
      await Promise.all([getCashRegistOpen(), getRegistrosVentas()]);
    } catch (error) {
      toast.error("No se pudo cerrar el registro de caja. Intente nuevamente.");
      throw error;
    }
  };

  // CARGAR TODA LA DATA
  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        getCashRegistOpen(),
        getRegistrosVentas(),
        getMovimientos(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sucursalId && usuarioId) {
      loadAllData();
    }
  }, [sucursalId, usuarioId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Dentro de tu componente padre:
  const depositosIds = movimientos
    .filter((m) => m.tipo === TipoMovimientoCaja.DEPOSITO_BANCO)
    .map((m) => m.id);

  const egresosIds = movimientos
    .filter((m) => m.tipo === TipoMovimientoCaja.EGRESO)
    .map((m) => m.id);

  const ventasIds = movimientos
    .filter((m) => m.tipo === TipoMovimientoCaja.VENTA)
    .map((m) => m.id);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <CashRegisterForm
        isCashRegistOpen={isCashRegistOpen}
        registroAbierto={registroAbierto}
        userName={userName}
        onOpenCashRegister={handleOpenCashRegister}
        onCloseCashRegister={handleCloseCashRegister}
        sucursalId={sucursalId}
        usuarioId={usuarioId}
        depositosIds={depositosIds}
        egresosIds={egresosIds}
        ventasIds={ventasIds}
      />
      <TransactionAccordion movimientos={movimientos} ventas={ventas} />
    </div>
  );
}
