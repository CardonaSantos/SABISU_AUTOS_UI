// src/Pages/CuentasBancarias/_components/CuentaFormDialog.tsx
"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CuentaBancariaResumen,
  CuentaCreatePayload,
  TipoCuenta,
} from "../Interfaces/CuentaBancariaResumen";

// ⬅️ Hacemos 'tipo' REQUERIDO pero con DEFAULT para evitar undefined
const schema = z.object({
  banco: z.string().min(2, "Banco requerido"),
  numero: z.string().min(3, "Número requerido"),
  alias: z.string().nullable().optional(),
  // default ⇒ input: opcional | output: requerido
  tipo: z.enum(["AHORRO", "CORRIENTE", "TARJETA"]).default("CORRIENTE"),
});
type FormIn = z.input<typeof schema>; // { banco; numero; alias?; tipo?: ... }
type FormOut = z.output<typeof schema>; // { banco; numero; alias?; tipo: ... }

export function CuentaFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
  loading,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: CuentaBancariaResumen | null;
  onSubmit: (payload: CuentaCreatePayload) => void;
  loading?: boolean;
}) {
  const form = useForm<FormIn, any, FormOut>({
    resolver: zodResolver(schema),
    defaultValues: { banco: "", numero: "", alias: "", tipo: "CORRIENTE" },
  });

  const {
    register,
    // control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (initial) {
      reset({
        banco: initial.banco,
        numero: initial.numero,
        alias: initial.alias ?? "",
        tipo: initial.tipo as TipoCuenta, // ya viene safe
      });
    } else {
      reset({ banco: "", numero: "", alias: "", tipo: "CORRIENTE" });
    }
  }, [initial, reset]);

  const onValid = (data: FormOut) => {
    const payload: CuentaCreatePayload = {
      banco: data.banco.trim(),
      numero: data.numero.trim(),
      alias: data.alias?.trim() || null,
      // aunque en tu payload sea opcional, enviarlo no hace daño
      tipo: data.tipo,
    };
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initial ? "Editar cuenta bancaria" : "Nueva cuenta bancaria"}
          </DialogTitle>
          <DialogDescription>
            {initial
              ? "Actualiza los datos de la cuenta."
              : "Crea una nueva cuenta para registrar movimientos."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValid)} className="space-y-3">
          <div>
            <Label>Banco</Label>
            <Input {...register("banco")} placeholder="Banco Industrial" />
            {errors.banco && (
              <p className="text-xs text-red-500">{errors.banco.message}</p>
            )}
          </div>

          <div>
            <Label>Número</Label>
            <Input {...register("numero")} placeholder="1234567890" />
            {errors.numero && (
              <p className="text-xs text-red-500">{errors.numero.message}</p>
            )}
          </div>

          <div>
            <Label>Alias</Label>
            <Input {...register("alias")} placeholder="Cuenta Principal" />
          </div>

          <div>
            <Label>Tipo</Label>
            <Controller
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <Select
                  value={field.value ?? "CORRIENTE"}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CORRIENTE">CORRIENTE</SelectItem>
                    <SelectItem value="AHORRO">AHORRO</SelectItem>
                    <SelectItem value="TARJETA">TARJETA</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {initial ? "Guardar cambios" : "Crear cuenta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
