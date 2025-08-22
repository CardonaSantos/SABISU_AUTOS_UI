"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CerrarCajaV2Dto, PreviaCierreResponse } from "./cierre.types";
import { cerrarCajaV2 } from "./caja.api";
import { getPreviaCierre } from "./types2";

type CuentaBancaria = {
  id: number;
  banco: string;
  numero: string;
  alias?: string | null;
};

type CierreCajaDialogProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  registroCajaId: number;
  usuarioCierreId: number;
  cuentasBancarias: CuentaBancaria[];
  onClosed?: () => void;
  reloadContext: () => Promise<void>;
};

const createCierreCajaSchema = (previa?: PreviaCierreResponse) =>
  z
    .object({
      modo: z.enum([
        "SIN_DEPOSITO",
        "DEPOSITO_PARCIAL",
        "DEPOSITO_TODO",
        "CAMBIO_TURNO",
      ] as const),
      comentarioFinal: z.string().optional(),

      // depósito
      cuentaBancariaId: z.number().optional(),
      montoParcial: z.number().optional(),

      // cambio de turno
      abrirSiguiente: z.boolean().optional(),
      usuarioInicioSiguienteId: z.number().optional(),
      fondoFijoSiguiente: z.number().optional(),
      comentarioAperturaSiguiente: z.string().optional(),
    })
    .refine(
      (d) =>
        ["DEPOSITO_PARCIAL", "DEPOSITO_TODO"].includes(d.modo)
          ? !!d.cuentaBancariaId
          : true,
      {
        path: ["cuentaBancariaId"],
        message: "Cuenta bancaria requerida para depósitos",
      }
    )
    .refine(
      (d) =>
        d.modo === "DEPOSITO_PARCIAL"
          ? !!d.montoParcial &&
            d.montoParcial > 0 &&
            (!previa || d.montoParcial <= previa.enCaja)
          : true,
      {
        path: ["montoParcial"],
        message: `Monto debe ser > 0 y <= Q${
          previa?.enCaja?.toFixed(2) ?? "0.00"
        }`,
      }
    )
    .refine(
      (d) =>
        d.modo === "CAMBIO_TURNO" && d.abrirSiguiente
          ? !!d.usuarioInicioSiguienteId
          : true,
      {
        path: ["usuarioInicioSiguienteId"],
        message: "Usuario requerido para abrir siguiente turno",
      }
    );

type CierreCajaFormData = z.infer<ReturnType<typeof createCierreCajaSchema>>;

export function CierreCajaDialog({
  open,
  onOpenChange,
  registroCajaId,
  usuarioCierreId,
  cuentasBancarias,
  onClosed,
  reloadContext,
}: CierreCajaDialogProps) {
  const [previa, setPrevia] = useState<PreviaCierreResponse | null>(null);
  const [isLoadingPrevia, setIsLoadingPrevia] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CierreCajaFormData>({
    resolver: zodResolver(createCierreCajaSchema(previa || undefined)),
    defaultValues: {
      modo: "SIN_DEPOSITO",
      abrirSiguiente: true,
    },
  });

  console.log("El form es: ", form);
  console.log("La previa es: ", previa);

  const watchedValues = form.watch();

  // Cargar previa al abrir el modal
  useEffect(() => {
    if (open && registroCajaId) {
      setIsLoadingPrevia(true);
      getPreviaCierre(registroCajaId)
        .then((data) => {
          setPrevia(data);
          form.setValue("fondoFijoSiguiente", data.fondoFijoActual);
        })
        .catch((error) => {
          console.error("Error cargando previa:", error);
          toast.error("Error al cargar información de caja");
        })
        .finally(() => {
          setIsLoadingPrevia(false);
        });
    }
  }, [open, registroCajaId, form]);

  const efectivoDisponible =
    previa?.puedeDepositarHasta ?? Math.max(0, previa?.enCaja ?? 0);

  // Calcular depósito esperado
  const calcularDeposito = (): number => {
    if (!previa) return 0;

    if (watchedValues.modo === "DEPOSITO_TODO") {
      return efectivoDisponible; // nunca negativo
    }

    if (watchedValues.modo === "DEPOSITO_PARCIAL") {
      const val = Number(watchedValues.montoParcial || 0);
      // clamp 0..efectivoDisponible
      return Math.min(Math.max(val, 0), efectivoDisponible);
    }

    return 0; // SIN_DEPOSITO y CAMBIO_TURNO
  };

  const depositoCalculado = calcularDeposito();
  const saldoFinalEsperado = (previa?.enCaja ?? 0) - depositoCalculado;

  const requiereDeposito = ["DEPOSITO_PARCIAL", "DEPOSITO_TODO"].includes(
    watchedValues.modo
  );

  const onSubmit = async (data: CierreCajaFormData) => {
    if (!previa) return;

    setIsSubmitting(true);
    try {
      const payload: CerrarCajaV2Dto = {
        registroCajaId,
        usuarioCierreId,
        modo: data.modo,
        comentarioFinal: data.comentarioFinal,
      };

      if (["DEPOSITO_PARCIAL", "DEPOSITO_TODO"].includes(data.modo)) {
        payload.cuentaBancariaId = data.cuentaBancariaId!;
        if (data.modo === "DEPOSITO_PARCIAL")
          payload.montoParcial = data.montoParcial!;
      }

      if (data.modo === "CAMBIO_TURNO") {
        payload.abrirSiguiente = data.abrirSiguiente ?? true;
        if (payload.abrirSiguiente) {
          payload.usuarioInicioSiguienteId = data.usuarioInicioSiguienteId!;
          payload.fondoFijoSiguiente = data.fondoFijoSiguiente;
          payload.comentarioAperturaSiguiente =
            data.comentarioAperturaSiguiente;
        }
      }

      if (requiereDeposito) {
        payload.cuentaBancariaId = data.cuentaBancariaId;
      }

      if (data.modo === "DEPOSITO_PARCIAL") {
        payload.montoParcial = data.montoParcial;
      }

      if (data.modo === "CAMBIO_TURNO") {
        payload.abrirSiguiente = data.abrirSiguiente;
        if (data.abrirSiguiente) {
          payload.usuarioInicioSiguienteId = data.usuarioInicioSiguienteId;
          payload.fondoFijoSiguiente = data.fondoFijoSiguiente;
          payload.comentarioAperturaSiguiente =
            data.comentarioAperturaSiguiente;
        }
      }

      console.log("Cerrando caja con payload:", payload);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Uncomment for real API call:
      await cerrarCajaV2(payload);

      toast.success("Caja cerrada exitosamente");
      onOpenChange(false);
      onClosed?.();
    } catch (error) {
      console.error("Error cerrando caja:", error);
      toast.error("Error al cerrar la caja");
    } finally {
      setIsSubmitting(false);
      await reloadContext();
    }
  };

  const formatCuentaBancaria = (cuenta: CuentaBancaria) => {
    const numeroMasked = `****${cuenta.numero.slice(-4)}`;
    return `${cuenta.banco} - ${
      cuenta.alias || numeroMasked
    } (${numeroMasked})`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cerrar Caja</DialogTitle>
          <DialogDescription>
            Configure los detalles del cierre de caja
          </DialogDescription>
        </DialogHeader>

        {isLoadingPrevia ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Cargando información...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna principal */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Modo de cierre (3 opciones) */}
                  <FormField
                    control={form.control}
                    name="modo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modo de cierre</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="grid grid-cols-1 gap-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="SIN_DEPOSITO"
                                id="sin-deposito"
                              />
                              <Label htmlFor="sin-deposito">
                                Solo cerrar (sin depósito)
                              </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="DEPOSITO_PARCIAL"
                                id="deposito-parcial"
                                disabled={efectivoDisponible < 0} // <<< aquí
                              />
                              <Label htmlFor="deposito-parcial">
                                Depositar parcial
                              </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="DEPOSITO_TODO"
                                id="deposito-todo"
                                disabled={efectivoDisponible < 0} // <<< aquí
                              />
                              <Label htmlFor="deposito-todo">
                                Depositar todo
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Cuenta bancaria - solo si hay depósito */}
                  {requiereDeposito && (
                    <FormField
                      control={form.control}
                      name="cuentaBancariaId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cuenta bancaria *</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            value={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione una cuenta" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cuentasBancarias.map((cuenta) => (
                                <SelectItem
                                  key={cuenta.id}
                                  value={cuenta.id.toString()}
                                >
                                  {formatCuentaBancaria(cuenta)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Monto parcial - solo para DEPOSITO_PARCIAL */}
                  {watchedValues.modo === "DEPOSITO_PARCIAL" && (
                    <FormField
                      control={form.control}
                      name="montoParcial"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monto a depositar *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0.01"
                              max={efectivoDisponible} // <<< aquí
                              defaultValue={field.value}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {previa?.warnings?.length ? (
                    <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
                      {previa.warnings.map((w, i) => (
                        <div key={i}>{w}</div>
                      ))}
                    </div>
                  ) : null}

                  {/* Comentario final */}
                  <FormField
                    control={form.control}
                    name="comentarioFinal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comentario final (opcional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Notas del cierre" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Columna lateral - Resumen */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Resumen</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Efectivo en caja:
                        </span>
                        <span className="font-medium">
                          Q {previa?.enCaja?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Fondo fijo:
                        </span>
                        <span className="font-medium">
                          Q {previa?.fondoFijoActual?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                      <hr />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Depósito a realizar:
                        </span>
                        <span className="font-medium text-blue-600">
                          Q {depositoCalculado.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Saldo final esperado:
                        </span>
                        <span className="font-medium text-green-600">
                          Q {saldoFinalEsperado.toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !form.formState.isValid}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? "Cerrando..." : "Cerrar Caja"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
