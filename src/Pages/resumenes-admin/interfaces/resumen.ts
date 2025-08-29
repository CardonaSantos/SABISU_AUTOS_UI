// src/Pages/ResumenDiarioAdmin/types.ts
export interface ResumenDiarioAdminResponse {
  fecha: string; // YYYY-MM-DD (TZ GT)
  sucursalId: number;

  caja: {
    inicio: number;
    ingresos: number;
    egresos: number; // incluye depósito de cierre
    finalFisico: number; // inicio + ingresos - egresos
    egresosSinCierre: number; // egresos - depositoCierreCaja
    finalOperativo: number; // inicio + ingresos - egresosSinCierre
  };

  banco: {
    inicio: number;
    ingresos: number; // depósitos de cierre (u otros)
    egresos: number;
    final: number; // inicio + ingresos - egresos
  };

  ventas: {
    total: number;
    cantidad: number;
    ticketPromedio: number;
    porMetodo: Record<string, number>; // p.ej. { CONTADO: 64 }
    efectivo: number; // suma de métodos "cash"
  };

  egresos: {
    costosVenta: {
      total: number;
      caja: number;
      banco: number;
      pagoProveedor: { caja: number; banco: number };
    };
    gastosOperativos: {
      total: number;
      caja: number;
      banco: number;
    };
  };

  transferencias: {
    depositoCierre: {
      montoBanco: number; // + en banco
      montoCaja: number; // - en caja (positivo en el payload)
      cantidad: number; // número de depósitos del día
      porCuenta: Array<{
        cuentaBancariaId: number;
        banco: string;
        alias: string | null;
        numeroMasked: string | null;
        monto: number;
        cantidad: number;
      }>;
    };
    bancoACaja: number; // si hubo transferencia inversa en el día
    validaciones: {
      cajaDisponibleAntesDeDepositar: number; // inicio + ingresos - egresosSinCierre
      excesoDeposito: number; // max(0, deposito - disponible)
    };
  };

  comparativos: {
    // informativos (útiles para gráficas)
    netoCajaOperativo: number; // ingresosCaja - egresosSinCierre
    efectivoVentas: number; // ventas.efectivo
    variacionCajaVsVentasEfectivo: number; // neto - efectivo (no dispara alerta)

    // semáforo de ventas (principal)
    ingresosCajaPorVentas: number; // MF INGRESO/VENTA (o fallback)
    ingresosCajaPorVentasEstimado: boolean; // true si usamos fallback
    deltaVentasCajaVsEfectivo: number; // ingresosCajaPorVentas - efectivo
    ventasOk: boolean;

    // semáforo de depósito (principal)
    cajaDisponibleAntesDeDepositar: number;
    depositoCierreCaja: number;
    excesoDeposito: number;
    depositoOk: boolean;

    alertas: string[]; // mensajes listos para UI
  };

  diagnostico: {
    snapshotPrevio: { caja: number | null; banco: number | null };
    aperturaCaja: number | null;
    chequeos: { identidadCajaOk: boolean; identidadBancoOk: boolean };
  };
}
