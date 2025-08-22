// interface HistoricoGlobalResponse {
//   rango: { from: string; to: string; tz: string };
//   days: {
//     fecha: string;
//     snapshotId: number | null;
//     caja: { inicio: number; ingresos: number; egresos: number; final: number };
//     banco: { inicio: number; ingresos: number; egresos: number; final: number };
//     flags: { sinSnapshot: boolean };
//   }[];
//   periodSummary: {
//     caja: { inicio: number; ingresos: number; egresos: number; final: number };
//     banco: { inicio: number; ingresos: number; egresos: number; final: number };
//   };
//   // opcional, muy útil para ranking en el periodo
//   topSucursales?: Array<{
//     sucursalId: number;
//     cajaFinal: number;
//     bancoFinal: number;
//   }>;
// }
