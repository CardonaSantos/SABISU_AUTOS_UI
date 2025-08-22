export interface ResumenDiarioAdminResponse {
  fecha: string; // YYYY-MM-DD
  sucursalId: number;

  caja: { inicio: number; ingresos: number; egresos: number; final: number };
  banco: { inicio: number; ingresos: number; egresos: number; final: number };

  ventas: {
    total: number;
    cantidad: number;
    ticketPromedio: number;
    porMetodo: Record<string, number>;
    efectivo: number; // derivado de porMetodo
  };

  egresos: {
    costosVenta: {
      total: number;
      caja: number;
      banco: number;
      pagoProveedor: { caja: number; banco: number };
    };
    gastosOperativos: { total: number; caja: number; banco: number };
    depositosCajaABanco: number; // solo DEPOSITO_CIERRE (flujo, no ingreso operativo)
  };

  depositos: {
    totalMonto: number; // suma deltaBanco > 0 de DEPOSITO_CIERRE
    totalCantidad: number;
    porTipo: { CIERRE_CAJA: { monto: number; cantidad: number } };
    porCuenta: Array<{
      cuentaBancariaId: number;
      banco: string;
      alias: string | null;
      numeroMasked: string | null;
      monto: number;
      cantidad: number;
    }>;
  };

  comparativos: {
    netoCajaOperativo: number; // ingresosCaja - (egresosCaja - egresoCajaPorCierre)
    efectivoVentas: number;
    variacionCajaVsVentasEfectivo: number; // netoCajaOperativo - efectivoVentas
    alertas: string[];
  };

  cierre: {
    huboCierre: boolean;
    montoDepositadoCierre: number;
  };
}
