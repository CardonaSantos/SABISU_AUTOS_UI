"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import type {
  FacturacionZona,
  NuevaFacturacionZona,
} from "./FacturacionZonaTypes";

interface ZonaFormProps {
  initialData: FacturacionZona | NuevaFacturacionZona;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  isEditing: boolean;
}

const ZonaForm: React.FC<ZonaFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  isEditing,
}) => {
  const [formData, setFormData] = React.useState<any>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setFormData({
        ...formData,
        [name]: value === "" ? "" : Number.parseInt(value, 10),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="fechas">Fechas y Recordatorios</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la Zona</Label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Zona Centro"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="diaCorte">Día de Corte</Label>
              <Input
                id="diaCorte"
                name="diaCorte"
                type="number"
                min="1"
                max="31"
                value={formData.diaCorte === null ? "" : formData.diaCorte}
                onChange={handleChange}
                placeholder="Ej: 25"
              />
              <p className="text-xs text-muted-foreground">
                Día del mes en que se realiza el corte de servicio
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="suspenderTrasFacturas">
                Suspender Tras Facturas
              </Label>
              <Input
                id="suspenderTrasFacturas"
                name="suspenderTrasFacturas"
                type="number"
                min="1"
                max="12"
                value={
                  formData.suspenderTrasFacturas === null
                    ? ""
                    : formData.suspenderTrasFacturas
                }
                onChange={handleChange}
                placeholder="Ej: 2"
              />
              <p className="text-xs text-muted-foreground">
                Número de facturas pendientes antes de suspender
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fechas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="diaGeneracionFactura">
                Día de Generación de Factura
              </Label>
              <Input
                id="diaGeneracionFactura"
                name="diaGeneracionFactura"
                type="number"
                min="1"
                max="31"
                value={formData.diaGeneracionFactura}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center justify-between space-x-2 pt-6">
              <Label
                htmlFor="enviarRecordatorioGeneracion"
                className="cursor-pointer"
              >
                Enviar Aviso de Generación
              </Label>
              <Switch
                id="enviarRecordatorioGeneracion"
                checked={formData.enviarRecordatorioGeneracion}
                onCheckedChange={(checked) =>
                  handleSwitchChange("enviarRecordatorioGeneracion", checked)
                }
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="diaPago">Día de Pago</Label>
              <Input
                id="diaPago"
                name="diaPago"
                type="number"
                min="1"
                max="31"
                value={formData.diaPago}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center justify-between space-x-2 pt-6">
              <Label htmlFor="enviarAvisoPago" className="cursor-pointer">
                Enviar Aviso de Pago
              </Label>
              <Switch
                id="enviarAvisoPago"
                checked={formData.enviarAvisoPago}
                onCheckedChange={(checked) =>
                  handleSwitchChange("enviarAvisoPago", checked)
                }
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="diaRecordatorio">Día Primer Recordatorio</Label>
              <Input
                id="diaRecordatorio"
                name="diaRecordatorio"
                type="number"
                min="1"
                max="31"
                value={formData.diaRecordatorio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center justify-between space-x-2 pt-6">
              <Label htmlFor="enviarRecordatorio1" className="cursor-pointer">
                Enviar Primer Recordatorio
              </Label>
              <Switch
                id="enviarRecordatorio1"
                checked={formData.enviarRecordatorio1}
                onCheckedChange={(checked) =>
                  handleSwitchChange("enviarRecordatorio1", checked)
                }
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="diaSegundoRecordatorio">
                Día Segundo Recordatorio
              </Label>
              <Input
                id="diaSegundoRecordatorio"
                name="diaSegundoRecordatorio"
                type="number"
                min="1"
                max="31"
                value={formData.diaSegundoRecordatorio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center justify-between space-x-2 pt-6">
              <Label htmlFor="enviarRecordatorio2" className="cursor-pointer">
                Enviar Segundo Recordatorio
              </Label>
              <Switch
                id="enviarRecordatorio2"
                checked={formData.enviarRecordatorio2}
                onCheckedChange={(checked) =>
                  handleSwitchChange("enviarRecordatorio2", checked)
                }
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between space-x-2 pt-6">
              <Label htmlFor="enviarRecordatorio" className="cursor-pointer">
                Enviar Recordatorios
              </Label>
              <Switch
                id="enviarRecordatorio"
                checked={formData.enviarRecordatorio}
                onCheckedChange={(checked) =>
                  handleSwitchChange("enviarRecordatorio", checked)
                }
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-2">
        {/* <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (isEditing) {
              // Close edit dialog
            } else {
              // Reset form
              setFormData(initialData);
            }
          }}
          disabled={isLoading}
        >
          Cancelar
        </Button> */}
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Guardar Cambios" : "Crear Zona"}
        </Button>
      </div>
    </form>
  );
};

export default ZonaForm;
