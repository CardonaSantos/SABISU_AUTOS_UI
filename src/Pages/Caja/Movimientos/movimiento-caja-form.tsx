"use client";
// src/pages/movimiento-caja/movimiento-caja-form.tsx
import type React from "react";
import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  type CreateMovimientoCajaDto,
  type MovimientoCajaFormErrors,
  type Proveedor,
  TipoMovimientoCaja,
  CategoriaMovimiento,
} from "./types";
import {
  TIPO_MOVIMIENTO_CAJA_OPTIONS,
  CATEGORIA_MOVIMIENTO_OPTIONS,
} from "./movimiento-caja-enums";
import {
  DollarSign,
  Calendar,
  Tag,
  List,
  Banknote,
  FileText,
  User,
  Building,
  Info,
  Check,
  Save,
  X,
} from "lucide-react";
import { AdvancedDialog } from "@/utils/components/AdvancedDialog";

interface MovimientoCajaFormProps {
  proveedores: Proveedor[];
  onSuccess: () => void;
  getMovimientosCaja: () => void; // Prop para refrescar datos
}

const initialFormData: CreateMovimientoCajaDto = {
  tipo: TipoMovimientoCaja.INGRESO, // Valor por defecto
  categoria: CategoriaMovimiento.GASTO_OPERATIVO, // Valor por defecto
  monto: 0,
  usuarioId: 1, // Asume un usuario por defecto, esto debería venir de la sesión
  fecha: new Date().toISOString().split("T")[0], // Fecha actual en formato YYYY-MM-DD
};

export function MovimientoCajaForm({
  proveedores,
  onSuccess,
  getMovimientosCaja,
}: MovimientoCajaFormProps) {
  const [formData, setFormData] =
    useState<CreateMovimientoCajaDto>(initialFormData);
  const [errors, setErrors] = useState<MovimientoCajaFormErrors>({});
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseFloat(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined })); // Clear error on change
  };

  const handleSelectChange = (
    name: keyof CreateMovimientoCajaDto,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined })); // Clear error on change
  };

  const handleCheckboxChange = (
    name: keyof CreateMovimientoCajaDto,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: MovimientoCajaFormErrors = {};

    if (!formData.tipo) {
      newErrors.tipo = "El tipo de movimiento es requerido.";
    }
    if (!formData.categoria) {
      newErrors.categoria = "La categoría es requerida.";
    }
    if (formData.monto <= 0) {
      newErrors.monto = "El monto debe ser mayor a 0.";
    }
    if (!formData.usuarioId) {
      newErrors.usuarioId = "El ID de usuario es requerido.";
    }
    if (!formData.fecha) {
      newErrors.fecha = "La fecha es requerida.";
    }

    // Validaciones condicionales
    if (
      (formData.categoria === CategoriaMovimiento.COSTO_VENTA ||
        formData.categoria === CategoriaMovimiento.DEPOSITO_PROVEEDOR) &&
      !formData.proveedorId
    ) {
      newErrors.proveedorId = "El proveedor es requerido para esta categoría.";
    }

    if (formData.tipo === TipoMovimientoCaja.DEPOSITO_BANCO) {
      if (!formData.banco) {
        newErrors.banco = "El banco es requerido para depósitos bancarios.";
      }
      if (!formData.numeroBoleta) {
        newErrors.numeroBoleta =
          "El número de boleta es requerido para depósitos bancarios.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsConfirmDialogOpen(true);
    } else {
      toast.error("Por favor, corrige los errores del formulario.");
    }
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setIsConfirmDialogOpen(false);

    const promise = new Promise(async (resolve, reject) => {
      try {
        // Asegúrate de que el usuarioId sea un número
        const dataToSend = {
          ...formData,
          usuarioId: Number(formData.usuarioId),
          monto: Number(formData.monto),
          // Asegúrate de que la fecha esté en formato ISO si es necesario para tu backend
          fecha: formData.fecha
            ? new Date(formData.fecha).toISOString()
            : undefined,
        };
        console.log("La data a enviar es: ", dataToSend);

        // Importa la función de la API aquí para evitar problemas de circular dependency si api.ts importa tipos de aquí
        const { createMovimientoCaja } = await import("./api");
        await createMovimientoCaja(dataToSend);
        resolve("Movimiento de caja registrado exitosamente.");
        setFormData(initialFormData); // Limpiar campos
        onSuccess(); // Callback para la página principal
        getMovimientosCaja(); // Refrescar datos
      } catch (error: any) {
        reject(error.message || "Error al registrar el movimiento.");
      } finally {
        setIsSubmitting(false);
      }
    });

    toast.promise(promise, {
      loading: "Registrando movimiento...",
      success: "Registrado  ",
      error: (error) => error,
    });
  };

  const isDepositoBanco = formData.tipo === TipoMovimientoCaja.DEPOSITO_BANCO;
  const isCostoVentaOrDepositoProveedor =
    formData.categoria === CategoriaMovimiento.COSTO_VENTA ||
    formData.categoria === CategoriaMovimiento.DEPOSITO_PROVEEDOR;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Registrar Movimiento de Caja
        </CardTitle>
        <CardDescription>
          Completa los detalles para registrar un nuevo movimiento de caja.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">
                <Calendar className="inline-block h-4 w-4 mr-1 text-muted-foreground" />
                Fecha
              </Label>
              <Input
                id="fecha"
                name="fecha"
                type="date"
                value={formData.fecha || ""}
                onChange={handleChange}
                className={errors.fecha ? "border-red-500" : ""}
              />
              {errors.fecha && (
                <p className="text-red-500 text-sm">{errors.fecha}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">
                <Tag className="inline-block h-4 w-4 mr-1 text-muted-foreground" />
                Tipo de Movimiento
              </Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) =>
                  handleSelectChange("tipo", value as TipoMovimientoCaja)
                }
              >
                <SelectTrigger
                  id="tipo"
                  className={errors.tipo ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPO_MOVIMIENTO_CAJA_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tipo && (
                <p className="text-red-500 text-sm">{errors.tipo}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">
                <List className="inline-block h-4 w-4 mr-1 text-muted-foreground" />
                Categoría
              </Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) =>
                  handleSelectChange("categoria", value as CategoriaMovimiento)
                }
              >
                <SelectTrigger
                  id="categoria"
                  className={errors.categoria ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Selecciona la categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIA_MOVIMIENTO_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoria && (
                <p className="text-red-500 text-sm">{errors.categoria}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="monto">
                <DollarSign className="inline-block h-4 w-4 mr-1 text-muted-foreground" />
                Monto
              </Label>
              <Input
                id="monto"
                name="monto"
                type="number"
                step="0.01"
                value={formData.monto}
                onChange={handleChange}
                className={errors.monto ? "border-red-500" : ""}
              />
              {errors.monto && (
                <p className="text-red-500 text-sm">{errors.monto}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">
              <Info className="inline-block h-4 w-4 mr-1 text-muted-foreground" />
              Descripción (Opcional)
            </Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion || ""}
              onChange={handleChange}
              placeholder="Detalles del movimiento"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="referencia">
              <FileText className="inline-block h-4 w-4 mr-1 text-muted-foreground" />
              Referencia (Opcional)
            </Label>
            <Input
              id="referencia"
              name="referencia"
              value={formData.referencia || ""}
              onChange={handleChange}
              placeholder="Número de referencia o código"
            />
          </div>

          {isDepositoBanco && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="banco">
                  <Banknote className="inline-block h-4 w-4 mr-1 text-muted-foreground" />
                  Banco
                </Label>
                <Input
                  id="banco"
                  name="banco"
                  value={formData.banco || ""}
                  onChange={handleChange}
                  placeholder="Nombre del banco"
                  className={errors.banco ? "border-red-500" : ""}
                />
                {errors.banco && (
                  <p className="text-red-500 text-sm">{errors.banco}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="numeroBoleta">
                  <FileText className="inline-block h-4 w-4 mr-1 text-muted-foreground" />
                  Número de Boleta
                </Label>
                <Input
                  id="numeroBoleta"
                  name="numeroBoleta"
                  value={formData.numeroBoleta || ""}
                  onChange={handleChange}
                  placeholder="Número de boleta de depósito"
                  className={errors.numeroBoleta ? "border-red-500" : ""}
                />
                {errors.numeroBoleta && (
                  <p className="text-red-500 text-sm">{errors.numeroBoleta}</p>
                )}
              </div>
            </div>
          )}

          {isCostoVentaOrDepositoProveedor && (
            <div className="space-y-2">
              <Label htmlFor="proveedorId">
                <Building className="inline-block h-4 w-4 mr-1 text-muted-foreground" />
                Proveedor
              </Label>
              <Select
                value={formData.proveedorId?.toString() || ""}
                onValueChange={(value) =>
                  handleSelectChange("proveedorId", value)
                }
              >
                <SelectTrigger
                  id="proveedorId"
                  className={errors.proveedorId ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Selecciona un proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {proveedores.map((proveedor) => (
                    <SelectItem
                      key={proveedor.id}
                      value={proveedor.id.toString()}
                    >
                      {proveedor.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.proveedorId && (
                <p className="text-red-500 text-sm">{errors.proveedorId}</p>
              )}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="usadoParaCierre"
              checked={formData.usadoParaCierre || false}
              onCheckedChange={(checked) =>
                handleCheckboxChange("usadoParaCierre", checked as boolean)
              }
            />
            <Label
              htmlFor="usadoParaCierre"
              className="flex items-center gap-1 cursor-pointer"
            >
              <Check className="h-4 w-4" />
              Usado para Cierre de Caja
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="usuarioId">
              <User className="inline-block h-4 w-4 mr-1 text-muted-foreground" />
              ID de Usuario
            </Label>
            <Input
              id="usuarioId"
              name="usuarioId"
              type="number"
              value={formData.usuarioId}
              onChange={handleChange}
              className={errors.usuarioId ? "border-red-500" : ""}
              readOnly // Asume que el usuarioId viene de la sesión y no es editable
            />
            {errors.usuarioId && (
              <p className="text-red-500 text-sm">{errors.usuarioId}</p>
            )}
          </div>

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
          icon: <Save className="mr-2 h-4 w-4" />,
        }}
        cancelButton={{
          label: "Cancelar",
          onClick: () => setIsConfirmDialogOpen(false),
          disabled: isSubmitting,
          icon: <X className="mr-2 h-4 w-4" />,
        }}
        type="confirmation"
        icon="info"
      />
    </Card>
  );
}
