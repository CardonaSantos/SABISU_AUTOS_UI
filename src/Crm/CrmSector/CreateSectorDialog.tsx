"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { MapPin, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { Municipio, Sector } from "./types";
import { Departamentos } from "../CrmCustomerEdition/types";
import { OptionSelected } from "../ReactSelectComponent/OptionSelected";
import ReactSelectComponent from "react-select";

interface CreateSectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // municipios: Municipio[];
  onSubmit: (
    sector: Omit<Sector, "id" | "creadoEn" | "actualizadoEn" | "clientes">
  ) => void;
  departamentos: Departamentos[];
  municipios: Municipio[]; // Asegúrate de que este tipo esté definido correctamente

  getMunicipios: () => void; // Función para obtener municipios
  setMunicipios: (municipios: Municipio[]) => void; // Función para establecer municipios
  setDepaSelected: (value: string | null) => void;
  depaSelected: string | null; // Estado para el departamento seleccionado
}

export function CreateSectorDialog({
  open,
  onOpenChange,
  municipios,
  onSubmit,
  //
  depaSelected,
  setDepaSelected,
  getMunicipios,
  setMunicipios,
  departamentos,
}: CreateSectorDialogProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    municipioId: "",
  });
  console.log("La data del form es:", formData);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (!formData.municipioId) {
      newErrors.municipioId = "Debe seleccionar un municipio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || null,
        municipioId: Number.parseInt(formData.municipioId),
      });

      // Reset form
      setFormData({
        nombre: "",
        descripcion: "",
        municipioId: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const optionsMunicipios = municipios.map((muni) => ({
    value: muni.id.toString(),
    label: muni.nombre,
  }));

  const handleSelectMunicipio = (optionSelected: OptionSelected | null) => {
    if (optionSelected) {
      setFormData((previaData) => ({
        ...previaData,
        municipioId: optionSelected.value,
      }));
    }
  };

  const optionsDepartamentos: OptionSelected[] = departamentos.map((depa) => ({
    value: depa.id.toString(), // Asegúrate de convertir el 'id' a 'string'
    label: depa.nombre,
  }));

  const handleSelectDepartamento = (selectedOption: OptionSelected | null) => {
    setDepaSelected(selectedOption ? selectedOption.value : null);
  };

  useEffect(() => {
    if (depaSelected) {
      getMunicipios();
    } else {
      setMunicipios([]);
      // setMuniSelected(null);
    }
  }, [depaSelected]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Crear Nuevo Sector
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="nombre" className="flex items-center">
              Nombre <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="nombre"
              placeholder="Ej: Sector Norte"
              value={formData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              className={errors.nombre ? "border-destructive" : ""}
              aria-invalid={!!errors.nombre}
              aria-describedby={errors.nombre ? "nombre-error" : undefined}
            />
            {errors.nombre && (
              <p id="nombre-error" className="text-sm text-destructive">
                {errors.nombre}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="space-y-2">
              <ReactSelectComponent
                placeholder="Seleccione un departamento"
                isClearable
                options={optionsDepartamentos}
                value={
                  depaSelected
                    ? {
                        value: depaSelected,
                        label:
                          departamentos.find(
                            (depa) => depa.id.toString() === depaSelected
                          )?.nombre || "",
                      }
                    : null
                }
                onChange={handleSelectDepartamento}
                className="text-xs text-black"
              />

              <Label htmlFor="edit-municipio" className="flex items-center">
                Municipio <span className="text-destructive ml-1">*</span>
              </Label>
              <ReactSelectComponent
                placeholder="Seleccionar municipio"
                id="edit-municipio"
                className="text-black text-xs"
                options={optionsMunicipios}
                onChange={handleSelectMunicipio}
                value={
                  formData.municipioId
                    ? {
                        value: formData.municipioId,
                        label:
                          optionsMunicipios.find(
                            (option) =>
                              option.value === formData.municipioId.toString()
                          )?.label || "",
                      }
                    : null
                }
              />
              {errors.municipioId && (
                <p
                  id="edit-municipio-error"
                  className="text-sm text-destructive flex items-center"
                >
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {errors.municipioId}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="edit-descripcion" className="flex items-center">
                Descripción{" "}
                <span className="text-muted-foreground text-sm ml-1">
                  (opcional)
                </span>
              </Label>
              <Textarea
                id="edit-descripcion"
                placeholder="Descripción del sector"
                value={formData.descripcion}
                onChange={(e) => handleChange("descripcion", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear Sector"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
