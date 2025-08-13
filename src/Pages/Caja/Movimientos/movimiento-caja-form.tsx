"use client";
// src/pages/movimiento-caja/movimiento-caja-form.tsx
import type React from "react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  type CreateMovimientoCajaDto,
  type MovimientoCajaFormErrors,
  type Proveedor,
  TipoMovimientoCaja,
  CategoriaMovimiento,
} from "./types";
import { TIPO_MOVIMIENTO_CAJA_OPTIONS } from "./movimiento-caja-enums";
import { DollarSign, Calendar, Tag, Check } from "lucide-react";
import { AdvancedDialog } from "@/utils/components/AdvancedDialog";
import { motion } from "framer-motion";
import DesvanecerHaciaArriba from "@/Crm/Motion/DashboardAnimations";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { createMovimientoCaja, getPreviaCerrar } from "./api";
import { CATS_BY_TIPO } from "./tiposYCategorias";
import { useStore } from "@/components/Context/ContextSucursal";
import { CajaAbierta } from "../interfaces";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { PreviewCierreInterface } from "./previaCerrar.interface";
registerLocale("es", es);

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale("es");
interface MovimientoCajaFormProps {
  proveedores: Proveedor[];
  getMovimientosCaja: () => Promise<void>;
  userID: number;
  getCajaAbierta: () => Promise<CajaAbierta | null>;
  reloadContext: () => Promise<void>;
}

export function MovimientoCajaForm({
  proveedores,
  userID,
  reloadContext,
}: MovimientoCajaFormProps) {
  const sucursalID = useStore((state) => state.sucursalId) ?? 0;

  const buildInitialFormData = (): CreateMovimientoCajaDto => ({
    tipo: TipoMovimientoCaja.INGRESO,
    categoria: undefined,
    monto: 0,
    usuarioId: userID,
    fecha: dayjs().format("YYYY-MM-DDTHH:mm"),
    sucursalId: sucursalID,
  });

  const [formData, setFormData] = useState<CreateMovimientoCajaDto>(
    buildInitialFormData()
  );
  const [errors, setErrors] = useState<MovimientoCajaFormErrors>({});
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para previa (cierre total/parcial)
  const [previewCierre, setPreviewCierre] =
    useState<PreviewCierreInterface | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [parcialEnable, setParcialEnable] = useState(false);

  // Helpers de UI
  const isDepositoBanco = formData.tipo === TipoMovimientoCaja.DEPOSITO_BANCO;
  const isDepositoCierre =
    formData.tipo === "DEPOSITO_BANCO" &&
    formData.categoria === "DEPOSITO_CIERRE";
  const isCostoVentaOrDepositoProveedor =
    formData.categoria === CategoriaMovimiento.COSTO_VENTA ||
    formData.categoria === CategoriaMovimiento.DEPOSITO_PROVEEDOR;

  const efectivoDisponible = previewCierre?.efectivoDisponible ?? null;

  // Handlers básicos
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseFloat(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleChangeFecha = (date: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      fecha: date ? dayjs(date).format("YYYY-MM-DDTHH:mm") : "",
    }));
    setErrors((prev) => ({ ...prev, fecha: undefined }));
  };

  const handleSelectChange = (
    name: keyof CreateMovimientoCajaDto,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "proveedorId" ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Cascadas por Tipo/Categoría (limpieza de campos incompatibles)
  useEffect(() => {
    const allowed = CATS_BY_TIPO[formData.tipo];
    setFormData((prev) => {
      const next = { ...prev };
      if (!allowed) {
        next.categoria = undefined;
        next.proveedorId = undefined;
        next.usadoParaCierre = false;
        next.banco = undefined;
        next.numeroBoleta = undefined;
        return next;
      }
      if (next.categoria && !allowed.includes(next.categoria))
        next.categoria = undefined;
      return next;
    });
    setErrors((e) => ({ ...e, categoria: undefined }));
  }, [formData.tipo]);

  useEffect(() => {
    setFormData((prev) => {
      const next = { ...prev };
      if (
        prev.tipo === "DEPOSITO_BANCO" &&
        prev.categoria === "DEPOSITO_CIERRE"
      ) {
        next.usadoParaCierre = true;
        next.proveedorId = undefined;
      } else if (prev.tipo === "DEPOSITO_BANCO") {
        next.usadoParaCierre = false;
      }
      if (
        prev.categoria !== "COSTO_VENTA" &&
        prev.categoria !== "DEPOSITO_PROVEEDOR"
      ) {
        next.proveedorId = undefined;
      }
      if (prev.tipo !== "DEPOSITO_BANCO") {
        next.banco = undefined;
        next.numeroBoleta = undefined;
      }
      return next;
    });
  }, [formData.categoria, formData.tipo]);

  // Si es depósito de cierre y NO parcial, el monto lo calcula el server
  useEffect(() => {
    if (isDepositoCierre && !parcialEnable) {
      setFormData((prev) => ({ ...prev, monto: 0 }));
    }
  }, [isDepositoCierre, parcialEnable]);

  // Toggle de cierre parcial: trae previa
  const fetchPreview = async () => {
    setLoadingPreview(true);
    try {
      const data = await getPreviaCerrar(sucursalID, userID);
      setPreviewCierre(data);
    } catch {
      toast.error("Error al calcular la previa de cierre.");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleToggleParcial = (checked: boolean) => {
    setParcialEnable(checked);
    if (checked && isDepositoCierre) fetchPreview();
  };

  // Validación
  const validateForm = (): boolean => {
    const newErrors: MovimientoCajaFormErrors = {};
    if (!formData.tipo) newErrors.tipo = "El tipo de movimiento es requerido.";
    if (!formData.usuarioId)
      newErrors.usuarioId = "El ID de usuario es requerido.";
    if (!formData.fecha) newErrors.fecha = "La fecha es requerida.";

    const allowed = CATS_BY_TIPO[formData.tipo];
    if (allowed && !formData.categoria) {
      newErrors.categoria = "La categoría es requerida para este tipo.";
    }

    // EGRESO
    if (formData.tipo === "EGRESO") {
      if (
        !["COSTO_VENTA", "GASTO_OPERATIVO"].includes(formData.categoria as any)
      ) {
        newErrors.categoria = "Categoría inválida para EGRESO.";
      }
      if (formData.categoria === "COSTO_VENTA" && !formData.proveedorId) {
        newErrors.proveedorId = "Proveedor obligatorio en Costo de Venta.";
      }
      if (formData.monto <= 0) newErrors.monto = "El monto debe ser mayor a 0.";
    }

    // DEPÓSITO BANCO
    if (formData.tipo === "DEPOSITO_BANCO") {
      if (
        !["DEPOSITO_CIERRE", "DEPOSITO_PROVEEDOR"].includes(
          formData.categoria as any
        )
      ) {
        newErrors.categoria = "Categoría inválida para Depósito.";
      }
      if (formData.categoria === "DEPOSITO_CIERRE") {
        if (!formData.banco) newErrors.banco = "Banco es obligatorio.";
        if (!formData.numeroBoleta)
          newErrors.numeroBoleta = "Boleta es obligatoria.";

        if (parcialEnable) {
          if (formData.monto <= 0) newErrors.monto = "Ingresa un monto válido.";
          if (
            efectivoDisponible != null &&
            formData.monto > efectivoDisponible
          ) {
            newErrors.monto = `No puedes depositar más de Q ${efectivoDisponible.toFixed(
              2
            )}.`;
          }
        }
      }
      if (formData.categoria === "DEPOSITO_PROVEEDOR") {
        if (!formData.proveedorId) {
          newErrors.proveedorId =
            "Proveedor es obligatorio para depósito a proveedor.";
        }
        if (formData.monto <= 0)
          newErrors.monto = "El monto debe ser mayor a 0.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) setIsConfirmDialogOpen(true);
    else toast.error("Por favor, corrige los errores del formulario.");
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setIsConfirmDialogOpen(false);

    // payload con flag depositarTodo para depósito de cierre
    const payload: CreateMovimientoCajaDto & { depositarTodo?: boolean } = {
      ...formData,
      usuarioId: Number(formData.usuarioId),
      fecha: formData.fecha
        ? new Date(formData.fecha).toISOString()
        : undefined,
    };

    if (isDepositoCierre) {
      if (parcialEnable) {
        payload.depositarTodo = false; // usa payload.monto
        payload.monto = Number(formData.monto);
      } else {
        payload.depositarTodo = true; // server calcula y deposita todo
        delete (payload as any).monto;
      }
    } else {
      payload.monto = Number(formData.monto);
    }

    try {
      await toast.promise(
        (async () => {
          await createMovimientoCaja(payload);
          await reloadContext(); // 1 sola recarga
        })(),
        {
          loading: "Registrando movimiento...",
          success: "Registrado",
          error: (e) => e?.message || "Error al registrar el movimiento.",
        }
      );
      setFormData(buildInitialFormData());
      setParcialEnable(false);
      setPreviewCierre(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI
  const allowedCategorias = CATS_BY_TIPO[formData.tipo] ?? null;
  const categoriaDisabled = !allowedCategorias;

  return (
    <motion.div {...DesvanecerHaciaArriba}>
      <Card className="mx-auto w-full">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-center">
            Registrar Movimiento de Caja
          </CardTitle>
          <CardDescription>
            Completa los detalles para registrar un nuevo movimiento de caja.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            {/* Fecha / Tipo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">
                  <Calendar className="inline-block h-4 w-4 mr-1" />
                  Fecha
                </Label>
                <DatePicker
                  disabled
                  id="fecha"
                  selected={
                    formData.fecha ? dayjs(formData.fecha).toDate() : null
                  }
                  onChange={handleChangeFecha}
                  timeIntervals={15}
                  timeCaption="Hora"
                  dateFormat="yyyy-MM-dd HH:mm"
                  locale="es"
                  className={cn(
                    "w-full ml-2 py-1 rounded-md p-1 text-black",
                    errors.fecha && "border-red-500"
                  )}
                />
                {errors.fecha && (
                  <p className="text-red-500 text-sm">{errors.fecha}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">
                  <Tag className="inline-block h-4 w-4 mr-1" />
                  Tipo de Movimiento
                </Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(v) =>
                    handleSelectChange("tipo", v as TipoMovimientoCaja)
                  }
                >
                  <SelectTrigger
                    id="tipo"
                    className={errors.tipo ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent
                    side="bottom"
                    className="max-h-60 overflow-y-auto"
                  >
                    {TIPO_MOVIMIENTO_CAJA_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tipo && (
                  <p className="text-red-500 text-sm">{errors.tipo}</p>
                )}
              </div>
            </div>

            {/* Categoría / Monto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría</Label>
                {categoriaDisabled ? (
                  <Input
                    id="categoria"
                    value="No aplica"
                    disabled
                    className="text-muted-foreground"
                  />
                ) : (
                  <Select
                    value={formData.categoria}
                    onValueChange={(v) =>
                      handleSelectChange("categoria", v as CategoriaMovimiento)
                    }
                  >
                    <SelectTrigger
                      id="categoria"
                      className={errors.categoria ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Selecciona la categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {allowedCategorias!.map((v) => (
                        <SelectItem key={v} value={v}>
                          {v.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.categoria && (
                  <p className="text-red-500 text-sm">{errors.categoria}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="monto">
                  <DollarSign className="inline-block h-4 w-4 mr-1" />
                  Monto
                </Label>

                {/* Depósito cierre total => texto, parcial => input */}
                {isDepositoCierre && !parcialEnable ? (
                  <Input
                    id="monto"
                    disabled
                    value="Se calculará automáticamente"
                  />
                ) : (
                  <Input
                    id="monto"
                    name="monto"
                    type="number"
                    step="0.01"
                    value={Number(formData.monto) || 0}
                    onChange={handleChange}
                    className={errors.monto ? "border-red-500" : ""}
                  />
                )}

                {errors.monto && (
                  <p className="text-red-500 text-sm">{errors.monto}</p>
                )}

                {isDepositoCierre && (
                  <div className="flex items-center gap-3 pt-1">
                    <Switch
                      id="switchparcial"
                      checked={parcialEnable}
                      onCheckedChange={handleToggleParcial}
                    />
                    <Label htmlFor="switchparcial" className="cursor-pointer">
                      Habilitar cierre parcial
                    </Label>
                  </div>
                )}

                {isDepositoCierre && parcialEnable && (
                  <div className="text-sm text-muted-foreground">
                    {loadingPreview ? (
                      <p>Calculando previa…</p>
                    ) : previewCierre ? (
                      <>
                        <p>
                          Efectivo disponible:{" "}
                          <strong>
                            Q {previewCierre.efectivoDisponible.toFixed(2)}
                          </strong>
                        </p>
                        <p>
                          Saldo tras depósito:{" "}
                          <strong>
                            Q{" "}
                            {(
                              previewCierre.efectivoDisponible -
                              (Number(formData.monto) || 0)
                            ).toFixed(2)}
                          </strong>
                        </p>
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Descripción / Referencia */}
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción (Opcional)</Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion || ""}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referencia">Referencia (Opcional)</Label>
              <Input
                id="referencia"
                name="referencia"
                value={formData.referencia || ""}
                onChange={handleChange}
              />
            </div>

            {/* Campos de banco/boleta */}
            {isDepositoBanco && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="banco">Banco</Label>
                  <Input
                    id="banco"
                    name="banco"
                    value={formData.banco || ""}
                    onChange={handleChange}
                    className={errors.banco ? "border-red-500" : ""}
                  />
                  {errors.banco && (
                    <p className="text-red-500 text-sm">{errors.banco}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroBoleta">Número de Boleta</Label>
                  <Input
                    id="numeroBoleta"
                    name="numeroBoleta"
                    value={formData.numeroBoleta || ""}
                    onChange={handleChange}
                    className={errors.numeroBoleta ? "border-red-500" : ""}
                  />
                  {errors.numeroBoleta && (
                    <p className="text-red-500 text-sm">
                      {errors.numeroBoleta}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Proveedor cuando aplica */}
            {isCostoVentaOrDepositoProveedor && (
              <div className="space-y-2">
                <Label htmlFor="proveedorId">Proveedor</Label>
                <Select
                  value={formData.proveedorId?.toString() || ""}
                  onValueChange={(v) => handleSelectChange("proveedorId", v)}
                >
                  <SelectTrigger
                    id="proveedorId"
                    className={errors.proveedorId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Selecciona un proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {proveedores.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.proveedorId && (
                  <p className="text-red-500 text-sm">{errors.proveedorId}</p>
                )}
              </div>
            )}

            {/* Flag visual */}
            {formData.usadoParaCierre && (
              <div className="text-red-600 font-semibold flex items-center gap-2">
                <Check className="h-4 w-4" /> Usado para Cierre de Caja
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrar Movimiento"}
            </Button>
          </form>
        </CardContent>

        <AdvancedDialog
          open={isConfirmDialogOpen}
          onOpenChange={setIsConfirmDialogOpen}
          title="Confirmar Registro"
          description="¿Estás seguro de que deseas registrar este movimiento de caja?"
          confirmButton={{
            label: "Confirmar",
            onClick: handleConfirmSubmit,
            loading: isSubmitting,
            loadingText: "Registrando...",
          }}
          cancelButton={{
            label: "Cancelar",
            onClick: () => setIsConfirmDialogOpen(false),
            disabled: isSubmitting,
          }}
          type="confirmation"
          icon="info"
        />
      </Card>
    </motion.div>
  );
}
