import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PenToolIcon as Tool, User, Calendar } from "lucide-react";

enum EstadoReparacion {
  RECIBIDO = "RECIBIDO",
  PENDIENTE = "PENDIENTE",
  EN_PROCESO = "EN_PROCESO",
  ESPERANDO_PIEZAS = "ESPERANDO_PIEZAS",
  REPARADO = "REPARADO",
  ENTREGADO = "ENTREGADO",
  CANCELADO = "CANCELADO",
  NO_REPARABLE = "NO_REPARABLE",
  FINALIZADO = "FINALIZADO",
}

interface Reparacion {
  id: number;
  estado: EstadoReparacion;
  problemas: string;
  observaciones: string;
  fechaRecibido: string;
  cliente: {
    nombre: string;
  };
  producto?: {
    nombre: string;
  };
  productoExterno?: string;
}

interface RepairCardProps {
  reparacion: Reparacion;
}

const RepairCard: React.FC<RepairCardProps> = ({ reparacion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [estado, setEstado] = useState(reparacion.estado);
  const [problemas, setProblemas] = useState(reparacion.problemas);
  const [observaciones, setObservaciones] = useState(reparacion.observaciones);

  const getStatusColor = (status: EstadoReparacion) => {
    switch (status) {
      case EstadoReparacion.RECIBIDO:
      case EstadoReparacion.PENDIENTE:
        return "bg-yellow-500";
      case EstadoReparacion.EN_PROCESO:
      case EstadoReparacion.ESPERANDO_PIEZAS:
        return "bg-blue-500";
      case EstadoReparacion.REPARADO:
        return "bg-green-500";
      case EstadoReparacion.ENTREGADO:
      case EstadoReparacion.FINALIZADO:
        return "bg-purple-500";
      case EstadoReparacion.CANCELADO:
      case EstadoReparacion.NO_REPARABLE:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <Badge className={getStatusColor(reparacion.estado)}>
            {reparacion.estado}
          </Badge>
          <span className="text-sm text-gray-500">#{reparacion.id}</span>
        </div>
        <h3 className="text-lg font-semibold mb-2 truncate">
          {reparacion.producto
            ? reparacion.producto.nombre
            : reparacion.productoExterno}
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            <span className="truncate">{reparacion.cliente.nombre}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {new Date(reparacion.fechaRecibido).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Tool className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Actualizar Reparación</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="estado" className="text-right">
                  Estado
                </label>
                <Select
                  value={estado}
                  onValueChange={(value: EstadoReparacion) => setEstado(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(EstadoReparacion).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="problemas" className="text-right">
                  Problemas
                </label>
                <Textarea
                  id="problemas"
                  value={problemas}
                  onChange={(e) => setProblemas(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="observaciones" className="text-right">
                  Observaciones
                </label>
                <Textarea
                  id="observaciones"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button>Guardar cambios</Button>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default RepairCard;
