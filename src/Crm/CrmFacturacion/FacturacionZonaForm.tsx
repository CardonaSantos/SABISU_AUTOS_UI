"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { CardFooter } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import {
  MapPin,
  Calendar,
  //   Clock,
  Bell,
  Ban,
  Loader2,
  PlusCircle,
  Save,
} from "lucide-react";
import type {
  NuevaFacturacionZona,
  FacturacionZona,
} from "./FacturacionZonaTypes";

interface ZonaFormProps {
  initialData: NuevaFacturacionZona | FacturacionZona;
  onSubmit: (data: NuevaFacturacionZona | FacturacionZona) => void;
  isLoading: boolean;
  isEditing: boolean;
}

export const ZonaForm: React.FC<ZonaFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  isEditing,
}) => {
  const [formData, setFormData] = useState<
    NuevaFacturacionZona | FacturacionZona
  >(initialData);

  // Update form data when initialData changes (for editing)
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Handlers para formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("dia") || name === "suspenderTrasFacturas"
          ? Number.parseInt(value) || 0
          : value,
    }));
  };

  // Handler para checkbox de recordatorio
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Verificar si el formulario es válido
  const isFormValid = (): boolean => {
    return (
      formData.nombre.trim() !== "" &&
      formData.diaGeneracionFactura > 0 &&
      formData.diaGeneracionFactura <= 31 &&
      formData.diaPago > 0 &&
      formData.diaPago <= 31 &&
      formData.diaRecordatorio > 0 &&
      formData.diaRecordatorio <= 31 &&
      formData.diaSegundoRecordatorio > 0 &&
      formData.diaSegundoRecordatorio <= 31 &&
      (!formData.diaCorte ||
        (formData.diaCorte > 0 && formData.diaCorte <= 31)) &&
      (!formData.suspenderTrasFacturas || formData.suspenderTrasFacturas > 0)
      // Comentado para evitar validaciones demasiado estrictas
      // validateDays()
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="fechas">Fechas</TabsTrigger>
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
        </TabsList>

        {/* Pestaña General */}
        <TabsContent value="general" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la Zona</Label>
            <div className="relative">
              <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="nombre"
                name="nombre"
                className="pl-8"
                placeholder="Ej: Jacaltenango Corte 5"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </TabsContent>

        {/* Pestaña Fechas */}
        <TabsContent value="fechas" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="diaGeneracionFactura">
              Día de Generación de Factura
            </Label>
            <div className="relative">
              <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="diaGeneracionFactura"
                name="diaGeneracionFactura"
                type="number"
                className="pl-8"
                min="1"
                max="31"
                value={formData.diaGeneracionFactura}
                onChange={handleInputChange}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Día del mes en que se genera la factura (1-28)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="diaRecordatorio">Día de Recordatorio</Label>
            <div className="relative">
              <Bell className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="diaRecordatorio"
                name="diaRecordatorio"
                type="number"
                className="pl-8"
                min="1"
                max="31"
                value={formData.diaRecordatorio}
                onChange={handleInputChange}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Día del mes en que se envía el primer recordatorio (1-28)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="diaSegundoRecordatorio">
              Día de Segundo Recordatorio
            </Label>
            <div className="relative">
              <Bell className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="diaSegundoRecordatorio"
                name="diaSegundoRecordatorio"
                type="number"
                className="pl-8"
                min="1"
                max="31"
                value={formData.diaSegundoRecordatorio}
                onChange={handleInputChange}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Día del mes en que se envía el segundo recordatorio (1-28)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="diaPago">Día de Pago</Label>
            <div className="relative">
              <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="diaPago"
                name="diaPago"
                type="number"
                className="pl-8"
                min="1"
                max="31"
                value={formData.diaPago}
                onChange={handleInputChange}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Día del mes en que se espera el pago (1-28)
            </p>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <Label htmlFor="diaCorte">Día de Corte (opcional)</Label>
            <div className="relative">
              <Ban className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="diaCorte"
                name="diaCorte"
                type="number"
                className="pl-8"
                min="1"
                max="31"
                value={formData.diaCorte || ""}
                onChange={handleInputChange}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Día del mes en que se corta el servicio si no paga (1-28)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="suspenderTrasFacturas">
              Suspender Tras Facturas (opcional)
            </Label>
            <Input
              id="suspenderTrasFacturas"
              name="suspenderTrasFacturas"
              type="number"
              min="0"
              value={formData.suspenderTrasFacturas || ""}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground">
              Cantidad de facturas vencidas antes de cortar servicio
            </p>
          </div>
        </TabsContent>

        {/* Pestaña Notificaciones */}
        <TabsContent value="notificaciones" className="space-y-4 mt-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="enviarRecordatorio"
              checked={formData.enviarRecordatorio}
              onCheckedChange={(checked) =>
                handleSwitchChange("enviarRecordatorio", checked)
              }
            />
            <Label htmlFor="enviarRecordatorio">
              Enviar recordatorio de pago
            </Label>
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="horaRecordatorio">Hora de Recordatorio</Label>
            <Select
              value={formData.horaRecordatorio.substring(0, 5)}
              onValueChange={handleSelectChange}
              name="horaRecordatorio"
            >
              <SelectTrigger id="horaRecordatorio" className="w-full pl-8">
                <SelectValue placeholder="Seleccionar hora" />
                <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="08:00">08:00</SelectItem>
                <SelectItem value="12:00">12:00</SelectItem>
                <SelectItem value="16:00">16:00</SelectItem>
                <SelectItem value="20:00">20:00</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Hora específica para enviar la notificación
            </p>
          </div> */}

          <div className="space-y-4">
            <Label>Medios de Notificación</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="email">Email</Label>
              </div>

              {/* <div className="flex items-center space-x-2">
                <Switch
                  id="sms"
                  checked={formData.sms || false}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("sms", checked)
                  }
                  disabled={!formData.enviarRecordatorio}
                />
                <Label htmlFor="sms">SMS</Label>
              </div> */}

              <div className="flex items-center space-x-2">
                <Label htmlFor="llamada">Llamada</Label>
              </div>

              {/* <div className="flex items-center space-x-2">
                <Switch
                  id="telegram"
                  checked={formData.telegram || false}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("telegram", checked)
                  }
                  disabled={!formData.enviarRecordatorio}
                />
                <Label htmlFor="telegram">Telegram</Label>
              </div> */}
            </div>
            <p className="text-xs text-muted-foreground">
              Seleccione al menos un medio de notificación
            </p>
          </div>
        </TabsContent>
      </Tabs>
      <CardFooter className="mt-4 px-0">
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !isFormValid()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Actualizando..." : "Creando..."}
            </>
          ) : (
            <>
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Crear Zona de Facturación
                </>
              )}
            </>
          )}
        </Button>
      </CardFooter>
    </form>
  );
};
