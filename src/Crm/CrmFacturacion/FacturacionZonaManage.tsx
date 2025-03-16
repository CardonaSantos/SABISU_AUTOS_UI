"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  Search,
  PlusCircle,
  Save,
  AlertCircle,
  Calendar,
  Clock,
  Bell,
  MessageSquare,
  FileText,
  Ban,
  Loader2,
  WifiOff,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

// Types
interface ClienteInternet {
  id: number;
  nombre: string;
  // Otros campos que pueda tener el cliente
}

interface FacturaInternet {
  id: number;
  // Otros campos que pueda tener la factura
}

interface FacturacionZona {
  id: number;
  nombre: string;
  empresaId: number;
  diaGeneracionFactura: number;
  diaPago: number;
  diaRecordatorio: number;
  diaSegundoRecordatorio: number;
  horaRecordatorio: string;
  enviarRecordatorio: boolean;
  mediosNotificacion: string;
  diaCorte?: number | null;
  suspenderTrasFacturas?: number | null;
  clientes?: ClienteInternet[];
  facturas?: FacturaInternet[];
  creadoEn: string;
  actualizadoEn: string;
  clientesCount?: number; // Campo calculado para mostrar la cantidad de clientes
  facturasCount?: number; // Campo calculado para mostrar la cantidad de facturas

  whatsapp?: boolean;
  email?: boolean;
  sms?: boolean;
  llamada?: boolean;
  telegram?: boolean;
}

interface NuevaFacturacionZona {
  nombre: string;
  empresaId: number;
  diaGeneracionFactura: number;
  diaPago: number;
  diaRecordatorio: number;
  diaSegundoRecordatorio: number;
  horaRecordatorio: string;
  enviarRecordatorio: boolean;
  // mediosNotificacion: string;
  diaCorte?: number | null;
  suspenderTrasFacturas?: number | null;
  //
  whatsapp?: boolean;
  email?: boolean;
  sms?: boolean;
  llamada?: boolean;
  telegram?: boolean;
}

// Componente principal
const FacturacionZonaManage: React.FC = () => {
  // State para zonas de facturación
  const [zonas, setZonas] = useState<FacturacionZona[]>([]);
  const [searchZona, setSearchZona] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;

  // State para formulario
  const [nuevaZona, setNuevaZona] = useState<NuevaFacturacionZona>({
    nombre: "",
    empresaId: empresaId, // Default value, would typically come from context/props
    diaGeneracionFactura: 10,
    diaPago: 20,
    diaRecordatorio: 5,
    diaSegundoRecordatorio: 15,
    horaRecordatorio: "08:00:00",
    enviarRecordatorio: true,
    diaCorte: 25,
    suspenderTrasFacturas: 2,
    //BOLEANOS
    whatsapp: false,
    email: false,
    sms: false,
    llamada: false,
    telegram: false,
  });

  // State para edición
  const [editingZona, setEditingZona] = useState<FacturacionZona | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // State para eliminación
  const [deleteZonaId, setDeleteZonaId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // State para notificaciones
  const [mediosSeleccionados, setMediosSeleccionados] = useState<string[]>([
    "WhatsApp",
    "Email",
  ]);
  const [editMediosSeleccionados, setEditMediosSeleccionados] = useState<
    string[]
  >([]);

  // Opciones para medios de notificación
  const mediosNotificacionOptions = [
    { id: "WhatsApp", label: "WhatsApp" },
    { id: "Email", label: "Email" },
    { id: "SMS", label: "SMS" },
  ];

  // Cargar datos
  useEffect(() => {
    fetchZonas();
  }, []);

  // Función para cargar zonas de facturación
  const fetchZonas = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${VITE_CRM_API_URL}/facturacion-zona`);

      if (response.status === 200) {
        setZonas(response.data);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error al cargar zonas de facturación:", err);
      setError("Error al cargar las zonas de facturación. Intente nuevamente.");
      setIsLoading(false);
    }
  };

  // Handlers para formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (editingZona) {
      setEditingZona((prev) => ({
        ...prev!,
        [name]:
          name.includes("dia") || name === "suspenderTrasFacturas"
            ? Number.parseInt(value) || 0
            : value,
      }));
    } else {
      setNuevaZona((prev) => ({
        ...prev,
        [name]:
          name.includes("dia") || name === "suspenderTrasFacturas"
            ? Number.parseInt(value) || 0
            : value,
      }));
    }
  };

  // Handler para checkbox de recordatorio xd
  const handleCheckboxChange = (checked: boolean) => {
    setNuevaZona((prev) => ({
      ...prev,
      enviarRecordatorio: checked,
    }));
  };

  // Handler para medios de notificación
  const handleMedioChange = (medio: string, checked: boolean) => {
    if (editingZona) {
      if (checked) {
        setEditMediosSeleccionados((prev) => [...prev, medio]);
      } else {
        setEditMediosSeleccionados((prev) => prev.filter((m) => m !== medio));
      }
    } else {
      if (checked) {
        setMediosSeleccionados((prev) => [...prev, medio]);
      } else {
        setMediosSeleccionados((prev) => prev.filter((m) => m !== medio));
      }
    }
  };

  // Actualizar mediosNotificacion cuando cambian los medios seleccionados
  useEffect(() => {
    setNuevaZona((prev) => ({
      ...prev,
      mediosNotificacion: mediosSeleccionados.join(", "),
    }));
  }, [mediosSeleccionados]);

  // Actualizar mediosNotificacion cuando cambian los medios seleccionados en edición
  useEffect(() => {
    if (editingZona) {
      setEditingZona((prev) => ({
        ...prev!,
        mediosNotificacion: editMediosSeleccionados.join(", "),
      }));
    }
  }, [editMediosSeleccionados]);

  // Inicializar medios seleccionados al editar
  useEffect(() => {
    if (editingZona) {
      const medios = editingZona.mediosNotificacion.split(", ");
      setEditMediosSeleccionados(medios);
    }
  }, [editingZona]);

  // Submit handlers
  const handleSubmitZona = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${VITE_CRM_API_URL}/facturacion-zona`,
        nuevaZona
      );

      if (response.status === 201) {
        toast.success("Nueva Zona de Facturación Creada");
      }

      // Reset form
      setNuevaZona({
        nombre: "",
        empresaId: empresaId,
        diaGeneracionFactura: 10,
        diaPago: 20,
        diaRecordatorio: 5,
        diaSegundoRecordatorio: 15,
        horaRecordatorio: "08:00:00",
        enviarRecordatorio: true,
        diaCorte: 10,
        suspenderTrasFacturas: 2,
      });
      fetchZonas();
    } catch (err) {
      toast.error("Error al crear zona");
      console.error("Error al crear zona de facturación:", err);
      setError("Error al crear la zona de facturación. Intente nuevamente.");
      setIsLoading(false);
    }
  };

  // Edit handlers
  const handleEditClick = (zona: FacturacionZona) => {
    setEditingZona(zona);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingZona) return;

    setIsLoading(true);
    setError(null);

    try {
      // En un entorno real, esto sería una llamada a la API
      // const response = await axios.put(`/api/facturacion-zonas/${editingZona.id}`, editingZona)
      // const updatedZona = response.data

      // Mock para demostración
      setTimeout(() => {
        const updatedZona = {
          ...editingZona,
          actualizadoEn: new Date().toISOString(),
        };

        setZonas(zonas.map((z) => (z.id === editingZona.id ? updatedZona : z)));

        // Close dialog and reset editing state
        setIsEditDialogOpen(false);
        setEditingZona(null);
        setIsLoading(false);
      }, 800);
    } catch (err) {
      console.error("Error al actualizar zona de facturación:", err);
      setError(
        "Error al actualizar la zona de facturación. Intente nuevamente."
      );
      setIsLoading(false);
    }
  };

  // Delete handlers
  const handleDeleteClick = (id: number) => {
    setDeleteZonaId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteZonaId === null) return;

    setIsLoading(true);
    setError(null);

    try {
      // En un entorno real, esto sería una llamada a la API
      // await axios.delete(`/api/facturacion-zonas/${deleteZonaId}`)

      // Mock para demostración
      setTimeout(() => {
        setZonas(zonas.filter((z) => z.id !== deleteZonaId));

        // Close dialog and reset delete state
        setIsDeleteDialogOpen(false);
        setDeleteZonaId(null);
        setIsLoading(false);
      }, 800);
    } catch (err) {
      console.error("Error al eliminar zona de facturación:", err);
      setError("Error al eliminar la zona de facturación. Intente nuevamente.");
      setIsLoading(false);
    }
  };

  // Filter zonas based on search
  const filteredZonas = zonas.filter((zona) =>
    zona.nombre.toLowerCase().includes(searchZona.toLowerCase())
  );

  // Validar que los días estén en orden lógico
  const validateDays = (
    zona: NuevaFacturacionZona | FacturacionZona
  ): boolean => {
    // Si no hay día de corte, no hay problema
    if (!zona.diaCorte) return true;

    // Validar que el día de generación sea antes del día de recordatorio
    if (zona.diaGeneracionFactura >= zona.diaRecordatorio) return false;

    // Validar que el día de recordatorio sea antes del día de pago
    if (zona.diaRecordatorio >= zona.diaPago) return false;

    // Validar que el día de pago sea antes del día de corte
    if (zona.diaPago >= zona.diaCorte) return false;

    return true;
  };

  // Verificar si el formulario es válido
  const isFormValid = (): boolean => {
    return (
      nuevaZona.nombre.trim() !== "" &&
      nuevaZona.diaGeneracionFactura > 0 &&
      nuevaZona.diaGeneracionFactura <= 28 &&
      nuevaZona.diaPago > 0 &&
      nuevaZona.diaPago <= 28 &&
      nuevaZona.diaRecordatorio > 0 &&
      nuevaZona.diaRecordatorio <= 31
      // Validación de diaCorte solo si es proporcionado
      // (!nuevaZona.diaCorte ||
      //   (nuevaZona.diaCorte > 0 && nuevaZona.diaCorte <= 31)) &&
      // Validación de suspenderTrasFacturas solo si es proporcionado
      // (!nuevaZona.suspenderTrasFacturas ||
      //   nuevaZona.suspenderTrasFacturas > 0) &&
      // validateDays(nuevaZona)
    );
  };

  // Verificar si el formulario de edición es válido
  const isEditFormValid = (): boolean => {
    if (!editingZona) return false;

    return (
      editingZona.nombre.trim() !== "" &&
      editingZona.diaGeneracionFactura > 0 &&
      editingZona.diaGeneracionFactura <= 28 &&
      editingZona.diaPago > 0 &&
      editingZona.diaPago <= 28 &&
      editingZona.diaRecordatorio > 0 &&
      editingZona.diaRecordatorio <= 28 &&
      (!editingZona.diaCorte ||
        (editingZona.diaCorte > 0 && editingZona.diaCorte <= 28)) &&
      (!editingZona.suspenderTrasFacturas ||
        editingZona.suspenderTrasFacturas > 0) &&
      validateDays(editingZona)
    );
  };
  const handleCheckedBoleans = (check: boolean, medio: string) => {
    setNuevaZona((prevData) => ({
      ...prevData,
      [medio]: check, // Usamos la variable 'medio' como la clave dinámica del objeto
    }));
  };

  console.log(nuevaZona.whatsapp);
  console.log("la nueva zona es: ", nuevaZona);

  // Función para manejar el cambio de la hora seleccionada
  const handleSelectChange = (value: string) => {
    const newValue = value + ":00"; // Asegúrate de añadir los segundos ":00"
    setNuevaZona((prevData) => ({
      ...prevData,
      horaRecordatorio: newValue,
    }));
  };

  return (
    <div className="container mx-auto py-1 space-y-1">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Zonas de Facturación
            </h1>
            <p className="text-muted-foreground">
              Gestione las zonas de facturación para sus clientes
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar zonas..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchZona}
                onChange={(e) => setSearchZona(e.target.value)}
              />
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Formulario para crear zonas de facturación */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Nueva Zona de Facturación
              </CardTitle>
              <CardDescription>
                Configure los parámetros para una nueva zona de facturación
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmitZona}>
              <CardContent>
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="fechas">Fechas</TabsTrigger>
                    <TabsTrigger value="notificaciones">
                      Notificaciones
                    </TabsTrigger>
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
                          value={nuevaZona.nombre}
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
                          max="28"
                          value={nuevaZona.diaGeneracionFactura}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Día del mes en que se genera la factura (1-28)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="diaRecordatorio">
                        Día de Recordatorio
                      </Label>
                      <div className="relative">
                        <Bell className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="diaRecordatorio"
                          name="diaRecordatorio"
                          type="number"
                          className="pl-8"
                          min="1"
                          max="28"
                          value={nuevaZona.diaRecordatorio}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Día del mes en que se envía el recordatorio (1-28)
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
                          max="28"
                          value={nuevaZona.diaSegundoRecordatorio}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Día del mes en que se envía el recordatorio (1-28)
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
                          max="28"
                          value={nuevaZona.diaPago}
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
                          max="28"
                          value={nuevaZona.diaCorte || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Día del mes en que se corta el servicio si no paga
                        (1-28)
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
                        min="1"
                        value={nuevaZona.suspenderTrasFacturas || ""}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        Cantidad de facturas vencidas antes de cortar servicio
                      </p>
                    </div>
                  </TabsContent>

                  {/* Pestaña Notificaciones */}
                  <TabsContent
                    value="notificaciones"
                    className="space-y-4 mt-4"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="enviarRecordatorio"
                        checked={nuevaZona.enviarRecordatorio}
                        onCheckedChange={handleCheckboxChange}
                      />
                      <Label htmlFor="enviarRecordatorio">
                        Enviar recordatorio de pago
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="horaRecordatorio">
                        Hora de Recordatorio
                      </Label>
                      <Select
                        value={nuevaZona.horaRecordatorio.substring(0, 5)} // Usar el valor que ya tienes
                        onValueChange={handleSelectChange} // Asegúrate de usar el valor directamente
                        name="horaRecordatorio"
                      >
                        <SelectTrigger
                          id="horaRecordatorio"
                          className="w-full pl-8"
                        >
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
                    </div>

                    <div className="space-y-2">
                      <Label>Medios de Notificación</Label>
                      <div className=" gap-2 flex">
                        <Label
                          htmlFor={`medio-${nuevaZona.whatsapp}`}
                          className="flex items-center gap-2"
                        >
                          Whatsapp
                        </Label>
                        <Checkbox
                          checked={nuevaZona.whatsapp}
                          onCheckedChange={(checked: boolean) =>
                            handleCheckedBoleans(checked, "whatsapp")
                          }
                        />

                        <Label
                          htmlFor={`medio-${nuevaZona.whatsapp}`}
                          className="flex items-center gap-2"
                        >
                          Llamada
                        </Label>
                        <Checkbox
                          checked={nuevaZona.llamada}
                          onCheckedChange={(checked: boolean) =>
                            handleCheckedBoleans(checked, "llamada")
                          }
                        />

                        <Label
                          htmlFor={`medio-${nuevaZona.whatsapp}`}
                          className="flex items-center gap-2"
                        >
                          Email
                        </Label>
                        <Checkbox
                          checked={nuevaZona.email}
                          onCheckedChange={(checked: boolean) =>
                            handleCheckedBoleans(checked, "email")
                          }
                        />

                        <Label
                          htmlFor={`medio-${nuevaZona.whatsapp}`}
                          className="flex items-center gap-2"
                        >
                          SMS
                        </Label>
                        <Checkbox
                          checked={nuevaZona.sms}
                          onCheckedChange={(checked: boolean) =>
                            handleCheckedBoleans(checked, "sms")
                          }
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Seleccione al menos un medio de notificación
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !isFormValid()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>Crear Zona de Facturación</>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Tabla de zonas de facturación */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Zonas de Facturación Existentes
              </CardTitle>
              <CardDescription>
                Lista de zonas de facturación configuradas en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && zonas.length === 0 ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : zonas.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No hay zonas disponibles</AlertTitle>
                  <AlertDescription>
                    No se encontraron zonas de facturación. Cree una nueva
                    utilizando el formulario.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="text-[12px]">
                          <TableHead>Nombre</TableHead>
                          <TableHead className="hidden md:table-cell">
                            Facturación
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Pago
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Clientes
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Facturas
                          </TableHead>

                          <TableHead className="hidden md:table-cell">
                            Fecha Corte
                          </TableHead>

                          <TableHead className="w-[80px]">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredZonas.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center text-muted-foreground py-6"
                            >
                              No se encontraron resultados para "{searchZona}"
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredZonas.map((zona) => (
                            <TableRow key={zona.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">
                                    {zona.nombre}
                                  </div>
                                  <div className="text-sm text-muted-foreground md:hidden">
                                    Facturación: día {zona.diaGeneracionFactura}
                                    , Pago: día {zona.diaPago}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <div className="flex flex-col">
                                  <span>
                                    Generación: día {zona.diaGeneracionFactura}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {zona.diaCorte
                                      ? `Corte: día ${zona.diaCorte}`
                                      : "Sin corte automático"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <div className="flex flex-col">
                                  <span>Pago: día {zona.diaPago}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {zona.enviarRecordatorio ? (
                                      <span className="flex items-center gap-1">
                                        <Bell className="h-3 w-3" />
                                        Recordatorio: día{" "}
                                        {`${zona.diaRecordatorio} y ${zona.diaSegundoRecordatorio}`}
                                      </span>
                                    ) : (
                                      "Sin recordatorio"
                                    )}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span>{zona.clientesCount || 0}</span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <div className="flex items-center gap-1">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span>{zona.facturasCount || 0}</span>
                                </div>
                              </TableCell>

                              <TableCell className="hidden md:table-cell">
                                <div className="flex items-center gap-1">
                                  <WifiOff className="h-4 w-4 text-muted-foreground" />
                                  <span>{zona.diaCorte || 0}</span>
                                </div>
                              </TableCell>

                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                      <span className="sr-only">
                                        Abrir menú
                                      </span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      className="flex items-center gap-2"
                                      onClick={() => handleEditClick(zona)}
                                    >
                                      <Edit className="h-4 w-4" />
                                      <span>Editar</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="flex items-center gap-2 text-destructive"
                                      onClick={() => handleDeleteClick(zona.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span>Eliminar</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Zona de Facturación</DialogTitle>
              <DialogDescription>
                Modifique los detalles de la zona de facturación y guarde los
                cambios.
              </DialogDescription>
            </DialogHeader>
            {editingZona && (
              <div className="grid gap-4 py-4">
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="fechas">Fechas</TabsTrigger>
                    <TabsTrigger value="notificaciones">
                      Notificaciones
                    </TabsTrigger>
                  </TabsList>

                  {/* Pestaña General */}
                  <TabsContent value="general" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-nombre">Nombre de la Zona</Label>
                      <div className="relative">
                        <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="edit-nombre"
                          name="nombre"
                          className="pl-8"
                          value={editingZona.nombre}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Pestaña Fechas */}
                  <TabsContent value="fechas" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-diaGeneracionFactura">
                        Día de Generación de Factura
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="edit-diaGeneracionFactura"
                          name="diaGeneracionFactura"
                          type="number"
                          className="pl-8"
                          min="1"
                          max="28"
                          value={editingZona.diaGeneracionFactura}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-diaRecordatorio">
                        Día de Recordatorio
                      </Label>
                      <div className="relative">
                        <Bell className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="edit-diaRecordatorio"
                          name="diaRecordatorio"
                          type="number"
                          className="pl-8"
                          min="1"
                          max="28"
                          value={editingZona.diaRecordatorio}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-diaPago">Día de Pago</Label>
                      <div className="relative">
                        <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="edit-diaPago"
                          name="diaPago"
                          type="number"
                          className="pl-8"
                          min="1"
                          max="28"
                          value={editingZona.diaPago}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <Label htmlFor="edit-diaCorte">
                        Día de Corte (opcional)
                      </Label>
                      <div className="relative">
                        <Ban className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="edit-diaCorte"
                          name="diaCorte"
                          type="number"
                          className="pl-8"
                          min="1"
                          max="28"
                          value={editingZona.diaCorte || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-suspenderTrasFacturas">
                        Suspender Tras Facturas (opcional)
                      </Label>
                      <Input
                        id="edit-suspenderTrasFacturas"
                        name="suspenderTrasFacturas"
                        type="number"
                        min="1"
                        value={editingZona.suspenderTrasFacturas || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </TabsContent>

                  {/* Pestaña Notificaciones */}
                  <TabsContent
                    value="notificaciones"
                    className="space-y-4 mt-4"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="edit-enviarRecordatorio"
                        checked={editingZona.enviarRecordatorio}
                        onCheckedChange={handleCheckboxChange}
                      />
                      <Label htmlFor="edit-enviarRecordatorio">
                        Enviar recordatorio de pago
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-horaRecordatorio">
                        Hora de Recordatorio
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="edit-horaRecordatorio"
                          name="horaRecordatorio"
                          type="time"
                          className="pl-8"
                          value={editingZona.horaRecordatorio.substring(0, 5)}
                          onChange={(e) => {
                            const newValue = e.target.value + ":00";
                            handleInputChange({
                              ...e,
                              target: {
                                ...e.target,
                                name: "horaRecordatorio",
                                value: newValue,
                              },
                            });
                          }}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Medios de Notificación</Label>
                      <div className="grid gap-2">
                        {mediosNotificacionOptions.map((medio) => (
                          <div
                            key={medio.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`edit-medio-${medio.id}`}
                              checked={editMediosSeleccionados.includes(
                                medio.id
                              )}
                              onCheckedChange={(checked) =>
                                handleMedioChange(medio.id, checked === true)
                              }
                              disabled={!editingZona.enviarRecordatorio}
                            />
                            <Label
                              htmlFor={`edit-medio-${medio.id}`}
                              className="flex items-center gap-2"
                            >
                              {medio.id === "WhatsApp" && (
                                <MessageSquare className="h-4 w-4" />
                              )}
                              {medio.id === "Email" && (
                                <FileText className="h-4 w-4" />
                              )}
                              {medio.id === "SMS" && (
                                <MessageSquare className="h-4 w-4" />
                              )}
                              {medio.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="gap-2"
                disabled={isLoading || !isEditFormValid()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
              <DialogDescription>
                ¿Está seguro que desea eliminar esta zona de facturación? Esta
                acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Advertencia</AlertTitle>
                <AlertDescription>
                  Si hay clientes o facturas asociadas a esta zona, se perderá
                  la relación con ellos.
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  "Eliminar"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default FacturacionZonaManage;
