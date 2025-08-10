"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Play,
  Square,
  DollarSign,
  MessageSquare,
  User,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  RegistroCajaFormData,
  RegistroCajaInicioFormData,
  RegistroAbierto,
} from "./types";
import { formatCurrency } from "./utils";

interface CashRegisterFormProps {
  isCashRegistOpen: boolean;
  registroAbierto?: RegistroAbierto;
  userName?: string;
  onOpenCashRegister: (data: RegistroCajaInicioFormData) => Promise<void>;
  onCloseCashRegister: (
    data: RegistroCajaFormData & {
      depositosIds: number[];
      egresosIds: number[];
      ventasIds: number[];
      id: number;
    }
  ) => Promise<void>;
  sucursalId: number;
  usuarioId: number;
  depositosIds: number[];
  egresosIds: number[];
  ventasIds: number[];
}

export function CashRegisterForm({
  isCashRegistOpen,
  registroAbierto,
  userName,
  onOpenCashRegister,
  // onCloseCashRegister,
  sucursalId,
  usuarioId,
  depositosIds,
  egresosIds,
  onCloseCashRegister,
  ventasIds,
}: // depositosIds,
// egresosIds,
// ventasIds,
CashRegisterFormProps) {
  const [formData, setFormData] = useState<RegistroCajaFormData>({
    saldoInicial: registroAbierto?.saldoInicial || 0,
    saldoFinal: 0,
    fechaInicio: new Date().toISOString().split("T")[0],
    fechaCierre: "",
    estado: "ABIERTO",
    comentario: registroAbierto?.comentario || "",
    sucursalId,
    usuarioId,
  });

  const [formDataInicio, setFormDataInicio] =
    useState<RegistroCajaInicioFormData>({
      saldoInicial: 0,
      estado: "ABIERTO",
      comentario: "",
      sucursalId,
      usuarioId,
    });

  const [truncateOpen, setTruncateOpen] = useState(false);
  const [truncateClose, setTruncateClose] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [closeConfirm, setCloseConfirm] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChangeInicio = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormDataInicio((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (truncateClose) return;
    setTruncateClose(true);
    if (!formData.saldoFinal || formData.saldoFinal <= 0) {
      toast.warning("Saldo final no ingresado");
      setTruncateClose(false);
      return;
    }
    const dataToSend = {
      ...formData,
      sucursalId,
      usuarioId,
      depositosIds,
      egresosIds,
      ventasIds,
      id: registroAbierto?.id || 0,
    };
    try {
      await onCloseCashRegister(dataToSend);
      setFormData({
        saldoInicial: 0,
        saldoFinal: 0,
        fechaInicio: new Date().toISOString().split("T")[0],
        fechaCierre: "",
        estado: "ABIERTO",
        comentario: "",
        sucursalId,
        usuarioId,
      });
      setCloseConfirm(false);
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setTruncateClose(false);
    }
  };

  const handleSubmitInicio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (truncateOpen) return;
    setTruncateOpen(true);

    if (!formDataInicio.saldoInicial || formDataInicio.saldoInicial <= 0) {
      toast.warning("Debe ingresar un saldo inicial");
      setTruncateOpen(false);
      return;
    }

    try {
      await onOpenCashRegister(formDataInicio);
      setFormDataInicio({
        comentario: "",
        estado: "ABIERTO",
        sucursalId,
        usuarioId,
        saldoInicial: 0,
      });
      setOpenConfirm(false);
    } catch (error) {
      // Error handling is done in parent component
      console.log("El error es: ", error);
    } finally {
      setTruncateOpen(false);
    }
  };

  if (isCashRegistOpen) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Square className="h-6 w-6 text-red-500" />
            <CardTitle>Registro de Caja</CardTitle>
          </div>
          {userName && (
            <div className="flex items-center justify-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm text-muted-foreground">{userName}</h3>
            </div>
          )}
          <CardDescription>
            Ingrese los detalles del cierre de caja
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="saldoInicial"
                  className="flex items-center gap-2"
                >
                  <DollarSign className="h-4 w-4" />
                  Saldo Inicial
                </Label>
                <Input
                  id="saldoInicial"
                  name="saldoInicial"
                  type="number"
                  value={registroAbierto?.saldoInicial || 0}
                  readOnly
                  className="bg-muted"
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(registroAbierto?.saldoInicial || 0)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="saldoFinal" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Saldo Final de Salida *
                </Label>
                <Input
                  id="saldoFinal"
                  name="saldoFinal"
                  type="number"
                  step="0.01"
                  value={formData.saldoFinal}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
                {formData.saldoFinal > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(formData.saldoFinal)}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comentario" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comentario
              </Label>
              <Textarea
                id="comentario"
                name="comentario"
                value={formData.comentario}
                onChange={handleInputChange}
                placeholder="Ingrese un comentario (opcional)"
                rows={3}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button
              variant="destructive"
              type="button"
              className="w-full"
              onClick={() => setCloseConfirm(true)}
              size="lg"
            >
              <Square className="h-4 w-4 mr-2" />
              Cerrar Caja
            </Button>
          </CardFooter>
        </form>

        <Dialog open={closeConfirm} onOpenChange={setCloseConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Confirmar cierre
              </DialogTitle>
              <DialogDescription>
                ¿Estás seguro de cerrar el turno? Esta acción no puede
                deshacerse.
                <br />
                <span className="font-medium">
                  Saldo final: {formatCurrency(formData.saldoFinal)}
                </span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setCloseConfirm(false)}
                disabled={truncateClose}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                disabled={truncateClose}
                onClick={handleSubmit}
              >
                {truncateClose ? "Cerrando..." : "Confirmar Cierre"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Play className="h-6 w-6 text-green-500" />
          <CardTitle>Registrar Turno</CardTitle>
        </div>
        {userName && (
          <div className="flex items-center justify-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm text-muted-foreground">{userName}</h3>
          </div>
        )}
        <CardDescription>
          Ingrese el saldo inicial para comenzar el turno
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmitInicio}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="saldoInicial" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Saldo Inicial *
            </Label>
            <Input
              id="saldoInicial"
              name="saldoInicial"
              type="number"
              step="0.01"
              value={formDataInicio.saldoInicial}
              onChange={handleInputChangeInicio}
              placeholder="0.00"
              required
            />
            {formDataInicio.saldoInicial > 0 && (
              <p className="text-xs text-muted-foreground">
                {formatCurrency(formDataInicio.saldoInicial)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comentario" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comentario
            </Label>
            <Textarea
              id="comentario"
              name="comentario"
              value={formDataInicio.comentario}
              onChange={handleInputChangeInicio}
              placeholder="Ingrese un comentario (opcional)"
              rows={3}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full"
            type="button"
            onClick={() => setOpenConfirm(true)}
            size="lg"
          >
            <Play className="h-4 w-4 mr-2" />
            Iniciar Turno
          </Button>
        </CardFooter>
      </form>

      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Confirmar inicio
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de iniciar el turno? Esta acción no puede
              deshacerse.
              <br />
              <span className="font-medium">
                Saldo inicial: {formatCurrency(formDataInicio.saldoInicial)}
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenConfirm(false)}
              disabled={truncateOpen}
            >
              Cancelar
            </Button>
            <Button disabled={truncateOpen} onClick={handleSubmitInicio}>
              {truncateOpen ? "Iniciando..." : "Confirmar Inicio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
