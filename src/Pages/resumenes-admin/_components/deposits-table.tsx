"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { formattMonedaGT } from "@/utils/formattMoneda";

type DepositRow = {
  cuentaBancariaId: number;
  banco: string;
  alias: string | null;
  numeroMasked: string | null;
  monto: number;
  cantidad: number;
};

export function DepositsTable({ deposits }: { deposits: DepositRow[] }) {
  if (!deposits?.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.15 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Depósitos por Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Sin depósitos de cierre
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.15 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Depósitos por Cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Banco</TableHead>
                <TableHead>Alias</TableHead>
                <TableHead>Cuenta</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deposits.map((d) => (
                <TableRow key={d.cuentaBancariaId}>
                  <TableCell className="font-medium">{d.banco}</TableCell>
                  <TableCell>{d.alias || "—"}</TableCell>
                  <TableCell>{d.numeroMasked || "—"}</TableCell>
                  <TableCell className="text-right">{d.cantidad}</TableCell>
                  <TableCell className="text-right">
                    {formattMonedaGT(d.monto)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
