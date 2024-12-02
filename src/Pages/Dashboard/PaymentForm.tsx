import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useStore } from "@/components/Context/ContextSucursal";
import axios from "axios";
import { toast } from "sonner";

interface PaymentFormProps {
  ventaCuotaId: number;
}

const API_URL = import.meta.env.VITE_API_URL;

type EstadoPago = "PENDIENTE" | "PAGADA" | "ATRASADA";

export const PaymentForm: React.FC<PaymentFormProps> = ({ ventaCuotaId }) => {
  const usuarioId = useStore((state) => state.userId) ?? 0;
  const [monto, setMonto] = useState<string>("");
  const [estado, setEstado] = useState<EstadoPago>("PENDIENTE");
  const [error, setError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    if (!monto || parseFloat(monto) <= 0) {
      setError("El monto debe ser un número positivo");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      monto: Number(monto),
      ventaCuotaId: Number(ventaCuotaId),
      estado: estado,
      usuarioI: Number(usuarioId),
    };

    try {
      const response = await axios.post(
        `${API_URL}/cuotas/register-new-pay`,
        data
      );

      if (response.status === 201) {
        toast.success("Registro de pago de cuota registrado");
      }

      console.log("Pago registrado exitosamente");
      setMonto("");
      setEstado("PENDIENTE");
    } catch (error) {
      console.error("Error:", error);
      setError("Error al registrar el pago. Por favor, intente nuevamente.");
      console.log("Error al registrar pago de crédito. Inténtelo de nuevo");
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
            <SelectItem value="PENDIENTE">Pendiente</SelectItem>
            <SelectItem value="PAGADA">Pagada</SelectItem>
            <SelectItem value="ATRASADA">Atrasada</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        Registrar Pago
      </Button>
    </form>
  );
};
