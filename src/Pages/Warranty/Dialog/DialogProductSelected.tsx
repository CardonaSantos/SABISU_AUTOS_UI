"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { ProductoVentaToTable } from "../interfaces2.interfaces";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  GarantiaFormData,
  OptionType,
  ProveedoresResponse,
} from "../interfaces.interfaces";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import {
  Package,
  MessageSquare,
  AlertTriangle,
  X,
  Check,
  User,
  Barcode,
  PackagePlus,
  Text,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdvancedDialog } from "@/utils/components/AdvancedDialog";
// import { submitWarrantyRegistration } from "../api";

interface Props {
  product: ProductoVentaToTable | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setFormData: React.Dispatch<React.SetStateAction<GarantiaFormData>>;
  formData: GarantiaFormData;
  providerOptionSelect: OptionType[];
  providers: ProveedoresResponse[];
  onSubmit?: () => void;
  handleSubmitRegistGarantia: () => Promise<void>;
  //truncar
  isSubmittingGarantia: boolean;
  setIsSubmittingGarantia: React.Dispatch<React.SetStateAction<boolean>>;
}

function DialogProductSelected({
  onOpenChange,
  open,
  product,
  setFormData,
  formData,
  providerOptionSelect,
  providers,
  // onSubmit,
  handleSubmitRegistGarantia,
  isSubmittingGarantia,
}: // setIsSubmittingGarantia,
Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChangeText = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  function handleChangeSelectProvider(newValue: OptionType | null) {
    if (newValue) {
      setFormData((prev) => ({
        ...prev,
        proveedorId: newValue.value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        proveedorId: null,
      }));
    }
  }

  const handleClose = () => {
    setErrors({});
    onOpenChange(false);
  };

  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className="
      max-w-3xl w-full
      max-h-[90vh] overflow-y-auto
      p-6 sm:p-8
    "
        >
          <DialogHeader className="mb-4">
            <div className="flex justify-center items-center">
              <DialogTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5" />
                Producto para garantía
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-center">
              {product
                ? `${product.producto.nombre} (ID ${product.id})`
                : "Ningún producto seleccionado"}
            </DialogDescription>
          </DialogHeader>

          {product && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* === COLUMNA IZQUIERDA === */}
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Barcode className="h-4 w-4 text-muted-foreground" />
                    <p>
                      <strong>Código:</strong> {product.producto.codigoProducto}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <PackagePlus className="h-4 w-4 text-muted-foreground" />
                    <p>
                      <strong>Cantidad vendida:</strong> {product.cantidad}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <p>
                      <strong>Precio unitario:</strong> Q{" "}
                      {product.precioVenta.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Text className="h-4 w-4 text-muted-foreground" />
                    <p className="truncate max-w-[30ch]">
                      <strong>Descripción:</strong>{" "}
                      {product.producto.descripcion}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="cantidad"
                    className="flex items-center gap-2 text-sm"
                  >
                    <Package className="h-4 w-4" />
                    Cantidad para garantía
                  </Label>
                  <Input
                    id="cantidad"
                    type="number"
                    min={1}
                    max={product.cantidad}
                    value={formData.cantidad || ""}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        cantidad: isNaN(v) ? prev.cantidad : v,
                      }));
                      if (errors.cantidad) {
                        setErrors((prev) => {
                          const t = { ...prev };
                          delete t.cantidad;
                          return t;
                        });
                      }
                    }}
                    placeholder="1"
                    className={cn(errors.cantidad && "border-destructive")}
                    aria-invalid={!!errors.cantidad}
                    aria-describedby={
                      errors.cantidad ? "cantidad-error" : undefined
                    }
                  />
                  {errors.cantidad && (
                    <p
                      id="cantidad-error"
                      className="text-xs text-destructive flex items-center gap-1 mt-1"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      {errors.cantidad}
                    </p>
                  )}
                </div>
              </div>

              {/* === COLUMNA DERECHA === */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="comentario"
                    className="flex items-center gap-2 text-sm"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Comentario (opcional)
                  </Label>
                  <Textarea
                    id="comentario"
                    name="comentario"
                    placeholder="Añade un comentario"
                    value={formData.comentario}
                    onChange={handleChangeText}
                    rows={2}
                    className="min-h-[60px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="descripcionProblema"
                    className="flex items-center gap-2 text-sm"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Descripción del problema
                  </Label>
                  <Textarea
                    id="descripcionProblema"
                    name="descripcionProblema"
                    placeholder="Detalle el problema"
                    value={formData.descripcionProblema}
                    onChange={handleChangeText}
                    rows={2}
                    className={cn(
                      "min-h-[60px]",
                      errors.descripcionProblema && "border-destructive"
                    )}
                    aria-invalid={!!errors.descripcionProblema}
                    aria-describedby={
                      errors.descripcionProblema
                        ? "descripcion-error"
                        : undefined
                    }
                  />
                  {errors.descripcionProblema && (
                    <p
                      id="descripcion-error"
                      className="text-xs text-destructive flex items-center gap-1 mt-1"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      {errors.descripcionProblema}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="proveedor"
                    className="flex items-center gap-2 text-sm"
                  >
                    <User className="h-4 w-4" />
                    Proveedor (opcional)
                  </Label>
                  <Select
                    inputId="proveedor"
                    placeholder="Elige un proveedor"
                    isClearable
                    options={providerOptionSelect}
                    onChange={handleChangeSelectProvider}
                    value={
                      formData.proveedorId != null
                        ? {
                            value: formData.proveedorId,
                            label:
                              providers.find(
                                (p) => p.id === formData.proveedorId
                              )?.nombre ?? "",
                          }
                        : null
                    }
                    classNames={{
                      control: (state) =>
                        `!border-input !shadow-none ${
                          state.isFocused ? "!border-ring" : ""
                        }`,
                      placeholder: () => "text-muted-foreground",
                      menu: () => "!bg-popover !border-border",
                      option: (state) =>
                        `${state.isFocused ? "!bg-accent" : ""} ${
                          state.isSelected
                            ? "!bg-primary !text-primary-foreground"
                            : ""
                        }`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
            <Button
              variant="destructive"
              onClick={handleClose}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4" /> Cancelar
            </Button>
            <Button
              variant={"outline"}
              onClick={() => {
                setOpenConfirm(true);
              }}
              className="w-full sm:w-auto"
            >
              <Check className="h-4 w-4 mr-2" /> Confirmar registro de garantía
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AdvancedDialog
        onOpenChange={setOpenConfirm}
        open={openConfirm}
        title="Registrar nueva garantía"
        description="Se comenzará un nuevo registro de garantía para su seguimiento"
        confirmButton={{
          label: "Si, continuar y registrar",
          disabled: isSubmittingGarantia,
          loading: isSubmittingGarantia,
          onClick: () => {
            handleSubmitRegistGarantia();
            setOpenConfirm(false);
            onOpenChange(false);
          },
          loadingText: "Registrando garantía...",
        }}
        cancelButton={{
          label: "Cancelar",
          disabled: isSubmittingGarantia,
        }}
      />
    </>
  );
}
// handleSubmitRegistGarantia
export default DialogProductSelected;
