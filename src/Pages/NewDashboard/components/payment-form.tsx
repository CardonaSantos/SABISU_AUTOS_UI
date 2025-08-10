"use client";

import type React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useStore } from "@/components/Context/ContextSucursal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type Cuotas, EstadoCierre, EstadoPago } from "../types/dashboard";

const API_URL = import.meta.env.VITE_API_URL;

interface PaymentFormProps {
  cuota: Cuotas | undefined;
  CreditoID: number | undefined;
  setOpenPaymentCuota: (value: boolean) => void;
  getCredits: () => Promise<void>;
}

export function PaymentForm({
  cuota,
  setOpenPaymentCuota,
  CreditoID,
  getCredits,
}: PaymentFormProps) {
  const usuarioId = useStore((state) => state.userId) ?? 0;
  const [monto, setMonto] = useState<string>("");
  const [estado, setEstado] = useState<EstadoPago>(EstadoPago.PAGADA);
  const [error, setError] = useState<string | null>(null);
  const [comentario, setComentario] = useState<string>("");
  const [comentarioCierre, setComentarioCierre] = useState<string>("");
  const [openCloseCredit, setOpenCloseCredit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [estadoCierre, setEstadoCierre] = useState<EstadoCierre>(
    EstadoCierre.COMPLETADA
  );

  const validateForm = (): boolean => {
    if (!monto || Number.parseFloat(monto) <= 0) {
      setError("El monto debe ser un número positivo");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (cuota) {
      const data = {
        monto: Number(monto),
        ventaCuotaId: Number(cuota.id),
        estado: estado,
        comentario,
        usuarioId: Number(usuarioId),
        CreditoID: CreditoID,
      };

      try {
        const response = await axios.post(
          `${API_URL}/cuotas/register-new-pay`,
          data
        );
        if (response.status === 201) {
          toast.success("Registro de pago de cuota registrado");
          getCredits();
          setOpenPaymentCuota(false);
        }
        setMonto("");
        setEstado(EstadoPago.PAGADA);
      } catch (error) {
        console.error("Error:", error);
        setError("Error al registrar el pago. Por favor, intente nuevamente.");
        toast.error("Error al registrar pago de crédito. Inténtelo de nuevo");
      }
    }
  };

  const handleCloseCredit = async (creditID: number) => {
    if (!creditID) {
      toast.error("El ID del crédito no es válido.");
      return;
    }
    if (isDeleting) {
      toast.info("El cierre ya está en proceso...");
      return;
    }
    setIsDeleting(true);

    if (!estadoCierre) {
      toast.info("Seleccione un estado");
      setIsDeleting(false);
      return;
    }

    try {
      const payload = {
        comentario: comentarioCierre?.trim() || null,
        estado: estadoCierre,
      };

      const response = await axios.patch(
        `${API_URL}/cuotas/close-credit-regist/${creditID}`,
        payload
      );

      if (response.status === 200) {
        toast.success("Crédito cerrado con éxito");
        setOpenCloseCredit(false);
        getCredits();
      } else {
        throw new Error("Respuesta inesperada del servidor");
      }
    } catch (error) {
      toast.error("Error al registrar el cierre. Inténtelo de nuevo.");
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="monto">Monto</Label>
        <Input
          id="monto"
          type="number"
          step="0.01"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          placeholder="Ingrese el monto"
          required
          aria-describedby="monto-error"
        />
        {error && (
          <p id="monto-error" className="text-sm text-red-500 mt-1">
            {error}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="estado">Estado</Label>
        <Select
          value={estado}
          onValueChange={(value: EstadoPago) => setEstado(value)}
        >
          <SelectTrigger id="estado">
            <SelectValue placeholder="Seleccione el estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={EstadoPago.PAGADA}>Pagada</SelectItem>
            <SelectItem value={EstadoPago.ATRASADA}>Atrasada</SelectItem>
          </SelectContent>
        </Select>
        <Textarea
          className="my-2"
          onChange={(e) => setComentario(e.target.value)}
          value={comentario}
          placeholder="Ingresar comentario (opcional)"
        />
      </div>
      <Button type="submit" className="w-full">
        Registrar Pago
      </Button>
      <Button
        className="w-full"
        variant="destructive"
        type="button"
        disabled={isDeleting}
        onClick={() => setOpenCloseCredit(true)}
      >
        Cerrar Registro
      </Button>
      <Dialog onOpenChange={setOpenCloseCredit} open={openCloseCredit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Cierre del Crédito</DialogTitle>
            <DialogDescription>
              Estás a punto de cerrar este registro de crédito. Una vez cerrado:
            </DialogDescription>
            <ul className="list-disc pl-6 text-muted-foreground text-sm">
              <li>No se podrán registrar más pagos.</li>
              <li>El estado del crédito será marcado como finalizado.</li>
              <li>Esta acción no se puede deshacer.</li>
            </ul>
            <DialogDescription className="mt-2">
              ¿Estás seguro de que deseas continuar?
            </DialogDescription>
            <div className="py-2">
              <Label htmlFor="estadoCierre">Estado</Label>
              <Select
                value={estadoCierre}
                onValueChange={(value: EstadoCierre) => setEstadoCierre(value)}
              >
                <SelectTrigger id="estadoCierre">
                  <SelectValue placeholder="Seleccione el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EstadoCierre.COMPLETADA}>
                    COMPLETADA
                  </SelectItem>
                  <SelectItem value={EstadoCierre.CANCELADA}>
                    CANCELADA
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <Textarea
              placeholder="Añadir un comentario final (opcional)"
              value={comentarioCierre}
              onChange={(e) => setComentarioCierre(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-end space-x-2">
              <Button
                className="w-full bg-transparent"
                variant="outline"
                onClick={() => setOpenCloseCredit(false)}
              >
                Cancelar
              </Button>
              <Button
                className="w-full"
                variant="destructive"
                disabled={isDeleting}
                onClick={() => {
                  handleCloseCredit(cuota?.id ?? 0);
                }}
              >
                {isDeleting ? "Cerrando..." : "Cerrar Crédito"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}
