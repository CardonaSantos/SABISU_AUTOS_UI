"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Loader2, DollarSign, Gauge, Save } from "lucide-react";

// Importación centralizada de tipos
import type {
  ServicioFormProps,
  //   EstadoServicio,
} from "./servicio-internet.types";

const ServicioForm: React.FC<ServicioFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  isEditing,
  empresaId,
}) => {
  const [formData, setFormData] = React.useState({
    ...initialData,
    empresaId: empresaId,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "precio") {
      setFormData({
        ...formData,
        [name]: value === "" ? 0 : Number.parseFloat(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  //   const handleEstadoChange = (value: string) => {
  //     setFormData({
  //       ...formData,
  //       estado: value as EstadoServicio,
  //     });
  //   };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre del Plan</Label>
        <Input
          id="nombre"
          name="nombre"
          placeholder="Ej: Plan Básico Internet"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="velocidad">Velocidad</Label>
        <div className="relative">
          <Gauge className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="velocidad"
            name="velocidad"
            className="pl-8"
            placeholder="Ej: 20 Mbps"
            value={formData.velocidad || ""}
            onChange={handleChange}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Especifique la velocidad del plan (opcional)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="precio">Precio</Label>
        <div className="relative">
          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="precio"
            name="precio"
            type="number"
            step="0.01"
            min="0"
            className="pl-8"
            placeholder="0.00"
            value={formData.precio || ""}
            onChange={handleChange}
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">Precio mensual del plan</p>
      </div>

      {/* <div className="space-y-2">
        <Label htmlFor="estado">Estado</Label>
        <Select onValueChange={handleEstadoChange} value={formData.estado}>
          <SelectTrigger id="estado">
            <SelectValue placeholder="Seleccione un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVO">Activo</SelectItem>
            <SelectItem value="INACTIVO">Inactivo</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Los planes inactivos no estarán disponibles para asignar a nuevos
          clientes
        </p>
      </div> */}

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            // Reset form or close dialog
          }}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </>
          ) : (
            "Crear Plan"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ServicioForm;
