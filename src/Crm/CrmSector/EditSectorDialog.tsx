"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { MapPin, Save, AlertCircle } from "lucide-react";
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

import type { Sector, Municipio } from "./types";

import ReactSelectComponent from "react-select";
import { OptionSelected } from "../ReactSelectComponent/OptionSelected";
import { Departamento } from "@/Types/SalesHistory/HistorialVentas";

interface EditSectorDialogProps {
  sector: Sector | null;
  openEditSecto: boolean;
  setOpenEditSector: (value: boolean) => void;
  handleSubmitEdit: (updatedSector: Partial<Sector>) => void;
  municipios: Municipio[];
  departamentos: Departamento[]; // Asegúrate de que este tipo esté definido correctamente
  getMunicipios: () => void; // Función para obtener municipios
  setMunicipios: (municipios: Municipio[]) => void; // Función para establecer municipios

  setDepaSelected: (value: string | null) => void;
  depaSelected: string | null; // Estado para el departamento seleccionado
}

function EditSectorDialog({
  handleSubmitEdit,
  openEditSecto,
  sector,
  setOpenEditSector,
  municipios,
  departamentos,
  getMunicipios,
  setMunicipios,
  setDepaSelected,
  depaSelected,
}: EditSectorDialogProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    municipioId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    if (sector) {
      setFormData({
        nombre: sector.nombre || "",
        descripcion: sector.descripcion || "",
        municipioId: sector.municipioId?.toString() || "",
      });
      // Limpiar errores al cargar nuevos datos
      setErrors({});
    }
  }, [sector]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error cuando se edita el campo
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  console.log("EditSectorDialog", formData);

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

    if (!validateForm() || !sector) return;

    setIsSubmitting(true);
    try {
      const updatedSector: Partial<Sector> = {
        id: sector.id,
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || null,
        municipioId: Number(formData.municipioId),
      };

      await handleSubmitEdit(updatedSector);

      setOpenEditSector(false);
    } catch (error) {
      console.error("Error al actualizar el sector:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!sector) return null;

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
    <Dialog open={openEditSecto} onOpenChange={setOpenEditSector}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <MapPin className="h-5 w-5 mr-2" />
            Editar Sector
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Nombre del sector */}
          <div className="space-y-2">
            <Label htmlFor="edit-nombre" className="flex items-center">
              Nombre <span className="text-destructive ml-1">*</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="edit-nombre"
                placeholder="Nombre del sector"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                className={`pl-8 ${errors.nombre ? "border-destructive" : ""}`}
                aria-invalid={!!errors.nombre}
                aria-describedby={
                  errors.nombre ? "edit-nombre-error" : undefined
                }
              />
            </div>
            {errors.nombre && (
              <p
                id="edit-nombre-error"
                className="text-sm text-destructive flex items-center"
              >
                <AlertCircle className="h-3.5 w-3.5 mr-1" />
                {errors.nombre}
              </p>
            )}
          </div>

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

          <DialogFooter className="mt-6 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenEditSector(false)}
              disabled={isSubmitting}
              className="sm:mr-2"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar cambios
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditSectorDialog;
