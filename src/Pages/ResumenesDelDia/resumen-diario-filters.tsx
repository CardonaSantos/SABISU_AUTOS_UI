"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Sucursal } from "./types";
import { RefreshCw, Download } from "lucide-react";

interface ResumenDiarioFiltersProps {
  fecha: string;
  sucursalId?: number;
  sucursales: Sucursal[];
  onFechaChange: (fecha: string) => void;
  onSucursalChange: (sucursalId?: number) => void;
  onRefresh: () => void;
  onExport: () => void;
  loading?: boolean;
}

export function ResumenDiarioFilters({
  fecha,
  sucursalId,
  sucursales,
  onFechaChange,
  onSucursalChange,
  onRefresh,
  onExport,
  loading = false,
}: ResumenDiarioFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b mb-6"
    >
      <Card className="border-0 shadow-none">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                value={fecha}
                onChange={(e) => onFechaChange(e.target.value)}
                className="w-full md:w-auto"
              />
            </div>

            <div className="flex-1 space-y-2">
              <Label htmlFor="sucursal">Sucursal</Label>
              <Select
                value={sucursalId?.toString() || "todas"}
                onValueChange={(value) =>
                  onSucursalChange(
                    value === "todas" ? undefined : Number.parseInt(value)
                  )
                }
              >
                <SelectTrigger className="w-full md:w-auto">
                  <SelectValue placeholder="Seleccionar sucursal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las sucursales</SelectItem>
                  {sucursales.map((sucursal) => (
                    <SelectItem
                      key={sucursal.id}
                      value={sucursal.id.toString()}
                    >
                      {sucursal.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={onRefresh} disabled={loading} variant="outline">
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Actualizar
              </Button>

              <Button onClick={onExport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
