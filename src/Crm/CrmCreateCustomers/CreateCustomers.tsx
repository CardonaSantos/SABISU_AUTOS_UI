"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Phone,
  MapPin,
  FileText,
  MessageSquare,
  Users,
  Wifi,
  Calendar,
  Map,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

function CreateCustomers() {
  // Estados para los campos del formulario
  const [formData, setFormData] = useState({
    // Datos básicos
    nombre: "",
    ip: "",
    apellidos: "",
    telefono: "",
    direccion: "",
    dpi: "",
    observaciones: "",
    contactoReferenciaNombre: "",
    contactoReferenciaTelefono: "",
    estadoCliente: "ACTIVO",

    // Datos del servicio
    contrasenaWifi: "",
    ssidRouter: "",
    fechaInstalacion: null as Date | null,
    asesorId: "",
    servicioId: "",
    municipioId: "",
    departamentoId: "",
    empresaId: "",
  });

  console.log("El form data es: ", formData);

  // Estados para las opciones de selección (simulados)
  const [asesores, setAsesores] = useState([
    { id: 1, nombre: "Juan Pérez" },
    { id: 2, nombre: "María López" },
    { id: 3, nombre: "Carlos Rodríguez" },
  ]);

  const [servicios, setServicios] = useState([
    { id: 1, nombre: "Plan Básico 10Mbps" },
    { id: 2, nombre: "Plan Estándar 25Mbps" },
    { id: 3, nombre: "Plan Premium 50Mbps" },
  ]);

  const [municipios, setMunicipios] = useState([
    { id: 1, nombre: "Guatemala" },
    { id: 2, nombre: "Mixco" },
    { id: 3, nombre: "Villa Nueva" },
  ]);

  const [departamentos, setDepartamentos] = useState([
    { id: 1, nombre: "Guatemala" },
    { id: 2, nombre: "Sacatepéquez" },
    { id: 3, nombre: "Escuintla" },
  ]);

  console.log(setServicios, setAsesores, setMunicipios, setDepartamentos);

  // Manejador de cambios para los campos de texto
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejador de cambios para los campos de selección
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejador para enviar el formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    // Aquí iría la lógica para enviar los datos al servidor
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Crear Nuevo Cliente</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna 1: Información Personal */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Información Personal
                </CardTitle>
                <CardDescription>Datos básicos del cliente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">
                    Nombres <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Nombre completo del cliente"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellidos">
                    Apellidos <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    placeholder="Apellidos del cliente"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="Número de teléfono"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      placeholder="Dirección del cliente"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dpi">DPI</Label>
                  <div className="relative">
                    <FileText className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dpi"
                      name="dpi"
                      value={formData.dpi}
                      onChange={handleChange}
                      placeholder="Número de DPI"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estadoCliente">
                    Estado del Cliente{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.estadoCliente}
                    onValueChange={(value) =>
                      handleSelectChange("estadoCliente", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVO">Activo</SelectItem>
                      <SelectItem value="INACTIVO">Inactivo</SelectItem>
                      <SelectItem value="SUSPENDIDO">Suspendido</SelectItem>
                      <SelectItem value="MOROSO">Moroso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Columna 2: Información de Servicio */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-primary" />
                  Información del Servicio
                </CardTitle>
                <CardDescription>
                  Detalles del servicio a contratar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ip">
                    IP <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Wifi className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="ip"
                      name="ip"
                      value={formData.ip}
                      onChange={handleChange}
                      placeholder="Dirección IP"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="servicioId">
                    Servicio Internet{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.servicioId.toString()}
                    onValueChange={(value) =>
                      handleSelectChange("servicioId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {servicios.map((servicio) => (
                        <SelectItem
                          key={servicio.id}
                          value={servicio.id.toString()}
                        >
                          {servicio.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contrasenaWifi">
                    Contraseña WiFi <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Wifi className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contrasenaWifi"
                      name="contrasenaWifi"
                      value={formData.contrasenaWifi}
                      onChange={handleChange}
                      placeholder="Contraseña para el WiFi"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ssidRouter">Nombre de Red (SSID)</Label>
                  <Input
                    id="ssidRouter"
                    name="ssidRouter"
                    value={formData.ssidRouter}
                    onChange={handleChange}
                    placeholder="Nombre de la red WiFi"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaInstalacion">Fecha de Instalación</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.fechaInstalacion && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {formData.fechaInstalacion ? (
                          format(formData.fechaInstalacion, "PPP", {
                            locale: es,
                          })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={formData.fechaInstalacion || undefined}
                        // onSelect={handleDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="asesorId">Asesor</Label>
                  <Select
                    value={formData.asesorId.toString()}
                    onValueChange={(value) =>
                      handleSelectChange("asesorId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar asesor" />
                    </SelectTrigger>
                    <SelectContent>
                      {asesores.map((asesor) => (
                        <SelectItem
                          key={asesor.id}
                          value={asesor.id.toString()}
                        >
                          {asesor.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Columna 3: Ubicación y Contacto de Referencia */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-primary" />
                  Ubicación
                </CardTitle>
                <CardDescription>
                  Datos de ubicación y contactos de referencia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactoReferenciaNombre">
                    Ubicación en Google Maps
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactoReferenciaNombre"
                      name="contactoReferenciaNombre"
                      value={formData.contactoReferenciaNombre}
                      onChange={handleChange}
                      placeholder="Ejem: 15.66717164492073, -91.71715513678991"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departamentoId">Departamento</Label>
                  <Select
                    value={formData.departamentoId.toString()}
                    onValueChange={(value) =>
                      handleSelectChange("departamentoId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {departamentos.map((departamento) => (
                        <SelectItem
                          key={departamento.id}
                          value={departamento.id.toString()}
                        >
                          {departamento.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="municipioId">Municipio</Label>
                  <Select
                    value={formData.municipioId.toString()}
                    onValueChange={(value) =>
                      handleSelectChange("municipioId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar municipio" />
                    </SelectTrigger>
                    <SelectContent>
                      {municipios.map((municipio) => (
                        <SelectItem
                          key={municipio.id}
                          value={municipio.id.toString()}
                        >
                          {municipio.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Label htmlFor="contactoReferenciaNombre">
                    Nombre de Referencia
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactoReferenciaNombre"
                      name="contactoReferenciaNombre"
                      value={formData.contactoReferenciaNombre}
                      onChange={handleChange}
                      placeholder="Nombre del contacto de referencia"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactoReferenciaTelefono">
                    Teléfono de Referencia
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactoReferenciaTelefono"
                      name="contactoReferenciaTelefono"
                      value={formData.contactoReferenciaTelefono}
                      onChange={handleChange}
                      placeholder="Teléfono del contacto de referencia"
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sección de Observaciones (ancho completo) */}
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Observaciones
                </CardTitle>
                <CardDescription>
                  Información adicional sobre el cliente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="observaciones"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  placeholder="Ingrese cualquier observación relevante sobre el cliente o la instalación"
                  className="min-h-[120px]"
                />
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Button variant="outline" type="button">
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Guardar Cliente
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default CreateCustomers;
