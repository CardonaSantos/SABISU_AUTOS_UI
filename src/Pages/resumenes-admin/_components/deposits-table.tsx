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
import { formattMoneda } from "@/Pages/Utils/Utils";
import { ResumenDiarioAdminResponse } from "../interfaces/resumen";

interface DepositsTableProps {
  deposits: ResumenDiarioAdminResponse["depositos"]["porCuenta"];
}

export function DepositsTable({ deposits }: DepositsTableProps) {
  if (deposits.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
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
      transition={{ duration: 0.3, delay: 0.5 }}
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
              {deposits.map((deposit) => (
                <TableRow key={deposit.cuentaBancariaId}>
                  <TableCell className="font-medium">{deposit.banco}</TableCell>
                  <TableCell>{deposit.alias || "—"}</TableCell>
                  <TableCell>{deposit.numeroMasked || "—"}</TableCell>
                  <TableCell className="text-right">
                    {deposit.cantidad}
                  </TableCell>
                  <TableCell className="text-right">
                    {formattMoneda(deposit.monto)}
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
