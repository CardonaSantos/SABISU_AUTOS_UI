"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Ticket,
  User,
  AlertCircle,
  Calendar,
  Tag,
  MessageSquare,
  Save,
  // Search,
  Clock,
  Flag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
// import { cn } from "@/lib/utils";
import SelectComponent, { MultiValue } from "react-select";
import axios from "axios";
import { toast } from "sonner";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;
// Tipos
interface CreateTicketProps {
  openCreatT: boolean;
  setOpenCreateT: (open: boolean) => void;
  getTickets: () => void;
}

interface Cliente {
  id: number;
  nombre: string;
}

interface Empresa {
  id: number;
  nombre: string;
}

interface Usuario {
  id: number;
  nombre: string;
}

// interface Etiqueta {
//   id: number;
//   nombre: string;
//   color: string;
// }

function CrmCreateTicket({
  openCreatT,
  setOpenCreateT,
  getTickets,
}: CreateTicketProps) {
  // Estados para los campos del formulario
  const [formData, setFormData] = useState({
    clienteId: "",
    empresaId: "",
    tecnicoId: "",
    titulo: "",
    descripcion: "",
    estado: "ABIERTA",
    prioridad: "MEDIA",
    etiquetas: [] as number[],
  });

  // Estado para búsqueda de cliente
  // const [clienteSearch, setClienteSearch] = useState("");
  // const [clientePopoverOpen, setClientePopoverOpen] = useState(false);

  // Datos simulados
  const [clientes, setClientes] = useState<Cliente[]>([
    { id: 1, nombre: "Juan Pérez" },
    { id: 2, nombre: "María López" },
    { id: 3, nombre: "Carlos Rodríguez" },
    { id: 4, nombre: "Ana Martínez" },
    { id: 5, nombre: "Roberto Gómez" },
  ]);

  const [empresas, setEmpresas] = useState<Empresa[]>([
    { id: 1, nombre: "Empresa A" },
    { id: 2, nombre: "Empresa B" },
    { id: 3, nombre: "Empresa C" },
  ]);

  const [tecnicos, setTecnicos] = useState<Usuario[]>([
    { id: 1, nombre: "Técnico 1" },
    { id: 2, nombre: "Técnico 2" },
    { id: 3, nombre: "Técnico 3" },
  ]);

  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([
    { id: 1, nombre: "Hardware", color: "bg-red-100 text-red-800" },
    { id: 2, nombre: "Software", color: "bg-blue-100 text-blue-800" },
    { id: 3, nombre: "Conectividad", color: "bg-green-100 text-green-800" },
    { id: 4, nombre: "Facturación", color: "bg-yellow-100 text-yellow-800" },
    { id: 5, nombre: "Instalación", color: "bg-purple-100 text-purple-800" },
  ]);

  const getClientes = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/internet-customer/get-customers-to-ticket`
      );
      if (response.status === 200) {
        setClientes(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.info("No se pudieron conseguir los clientes");
    }
  };

  const getTecs = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/user/get-users-to-create-tickets`
      );
      if (response.status === 200) {
        setTecnicos(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.info("No se pudieron conseguir los clientes");
    }
  };

  useEffect(() => {
    getClientes();
    getTecs();
  }, []);

  console.log(empresas, setEmpresas, setClientes, setTecnicos, setEtiquetas);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejador para enviar el formulario
  const handleSubmit = () => {
    console.log("Datos del ticket:", formData);
    getTickets();
    setOpenCreateT(false);
  };

  // Efecto para resetear el formulario cuando se abre
  useEffect(() => {
    if (openCreatT) {
      setFormData({
        clienteId: "",
        empresaId: "",
        tecnicoId: "",
        titulo: "",
        descripcion: "",
        estado: "ABIERTA",
        prioridad: "MEDIA",
        etiquetas: [],
      });
    }
  }, [openCreatT]);
  const [customerSelectedID, setCustomerSelectedID] = useState<number | null>(
    null
  );

  const [tecSelected, setTecSelected] = useState<number | null>(null);

  // Estado para las etiquetas seleccionadas (solo IDs)
  const [labelsSelecteds, setLabelsSelecteds] = useState<number[]>([]);

  interface OptionSelectedReactComponent {
    value: string;
    label: string;
  }

  interface Etiqueta {
    id: number;
    nombre: string;
    color: string;
  }

  //OPCIONES DE SELECCIONADO PARA EL DIALOG
  const handleChangeCustomerSelect = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setCustomerSelectedID(
      selectedOption ? parseInt(selectedOption.value, 10) : null
    );
  };

  const handleChangeTecSelect = (
    optionSelected: OptionSelectedReactComponent | null
  ) => {
    setTecSelected(optionSelected ? parseInt(optionSelected.value) : null);
  };

  const handleChangeLabels = (
    //MODIFICAR EL MULTI VALUE PARA QUE TOME UN GENERICO, EL CUAL LE TENGO QUE PASAR Y ESPECIFICAR
    selectedOptions: MultiValue<{ value: string; label: string }>
  ) => {
    setLabelsSelecteds(
      selectedOptions
        ? selectedOptions.map((option) => parseInt(option.value))
        : []
    );
  };

  const optionsCustomers = clientes.map((cliente) => ({
    value: cliente.id.toString(),
    label: cliente.nombre,
  }));

  const optionsTecs = tecnicos.map((tec) => ({
    value: tec.id.toString(),
    label: tec.nombre,
  }));

  const optionsLabels = etiquetas.map((label) => ({
    value: label.id.toString(),
    label: label.nombre,
  }));

  return (
    <Dialog open={openCreatT} onOpenChange={setOpenCreateT}>
      <DialogContent className="sm:max-w-[700px] max-h-[100vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Ticket className="h-5 w-5 text-primary" />
            Crear Nuevo Ticket de Soporte
          </DialogTitle>
          <DialogDescription>
            Complete la información para crear un nuevo ticket de soporte
            técnico.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="info"
          className="flex-1 overflow-hidden flex flex-col"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="info" className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Información Básica
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              Detalles
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 ">
            <TabsContent value="info" className="mt-0 space-y-10">
              {/* Cliente */}
              <div className="space-y-2">
                <Label htmlFor="cliente" className="flex items-center gap-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Cliente <span className="text-destructive">*</span>
                </Label>
                <SelectComponent
                  placeholder="Seleccione un cliente"
                  isClearable
                  options={optionsCustomers}
                  value={
                    optionsCustomers.find(
                      (option) =>
                        option.value === customerSelectedID?.toString()
                    ) || null
                  }
                  onChange={handleChangeCustomerSelect}
                />
              </div>

              {/* Técnico */}
              <div className="space-y-2">
                <Label htmlFor="tecnicoId" className="flex items-center gap-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Técnico Asignado
                </Label>
                <SelectComponent
                  placeholder="Seleccione un técnico"
                  isClearable
                  options={optionsTecs}
                  value={optionsTecs.find(
                    (tec) => tec.value === tecSelected?.toString() || null
                  )}
                  onChange={handleChangeTecSelect}
                />
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="estado" className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Estado
                </Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => handleSelectChange("estado", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ABIERTA">Abierta</SelectItem>
                    <SelectItem value="EN_PROCESO">En Proceso</SelectItem>
                    <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                    <SelectItem value="CERRADA">Cerrada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Prioridad */}
              <div className="space-y-2">
                <Label htmlFor="prioridad" className="flex items-center gap-1">
                  <Flag className="h-4 w-4 text-muted-foreground" />
                  Prioridad
                </Label>
                <Select
                  value={formData.prioridad}
                  onValueChange={(value) =>
                    handleSelectChange("prioridad", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BAJA">Baja</SelectItem>
                    <SelectItem value="MEDIA">Media</SelectItem>
                    <SelectItem value="ALTA">Alta</SelectItem>
                    <SelectItem value="URGENTE">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-0 space-y-10">
              {/* Título */}
              <div className="space-y-2 px-4">
                <Label htmlFor="titulo" className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  Título <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Título descriptivo del problema"
                  required
                />
              </div>

              {/* Descripción */}
              <div className="space-y-1 px-4">
                <Label
                  htmlFor="descripcion"
                  className="flex items-center gap-1"
                >
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  Descripción
                </Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describa detalladamente el problema o solicitud"
                  className="min-h-[90px]"
                />
              </div>

              {/* Etiquetas */}
              <div className="space-y-1">
                <Label className="flex items-center gap-1">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  Etiquetas
                </Label>
                <div className="relative z-30">
                  <SelectComponent
                    placeholder="Seleccione etiquetas (opcional)"
                    options={optionsLabels}
                    isMulti
                    onChange={handleChangeLabels}
                    value={optionsLabels.filter((option) =>
                      labelsSelecteds.includes(Number.parseInt(option.value))
                    )}
                    className="z-30"
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 30,
                        position: "absolute",
                        maxHeight: "200px",
                        overflow: "auto",
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        maxHeight: "200px",
                      }),
                    }}
                    menuPlacement="top" // Esta propiedad hace que las opciones se desplieguen hacia arriba
                  />
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <Separator className="my-4" />

        <DialogFooter className="flex sm:justify-between gap-2">
          <div className="hidden sm:flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            Fecha de creación: {new Date().toLocaleDateString()}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setOpenCreateT(false)}
              className="flex-1 sm:flex-initial"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 sm:flex-initial"
              disabled={
                !formData.clienteId || !formData.empresaId || !formData.titulo
              }
            >
              <Save className="mr-2 h-4 w-4" />
              Crear Ticket
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CrmCreateTicket;
