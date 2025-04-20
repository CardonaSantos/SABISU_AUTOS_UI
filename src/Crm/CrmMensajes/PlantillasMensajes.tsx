import { useState, useEffect } from "react";
import {
  MessageSquare,
  Plus,
  Search,
  FileText,
  Pencil,
  Trash2,
  AlertCircle,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { PlantillaMensaje, TipoPlantilla } from "./types";
import { toast } from "sonner";
import axios from "axios";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

// Mapeo de tipos de plantilla a etiquetas más amigables
const tipoPlantillaLabels: Record<TipoPlantilla, string> = {
  GENERACION_FACTURA: "Generación de Factura",
  RECORDATORIO_1: "Primer Recordatorio",
  RECORDATORIO_2: "Segundo Recordatorio",
  AVISO_PAGO: "Aviso de Pago",
  SUSPENSION: "Suspensión de Servicio",
  CORTE: "Corte de Servicio",
};

export default function PlantillasMensajesView() {
  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;
  const [plantillas, setPlantillas] = useState<PlantillaMensaje[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlantilla, setSelectedPlantilla] =
    useState<PlantillaMensaje | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "" as TipoPlantilla | "",
    body: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadPlantillas();
  }, []);

  const loadPlantillas = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/mensaje/get-mensajes-plantillas`
      );
      if (response.status === 200) {
        setPlantillas(response.data);
      }
    } catch (error) {
      toast("No se pudieron cargar las plantillas. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPlantillas = plantillas.filter(
    (plantilla) =>
      plantilla.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tipoPlantillaLabels[plantilla.tipo]
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      plantilla.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      nombre: "",
      tipo: "",
      body: "",
    });
    setFormErrors({});
  };

  const handleOpenCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleOpenEditDialog = (plantilla: PlantillaMensaje) => {
    setSelectedPlantilla(plantilla);
    setFormData({
      nombre: plantilla.nombre,
      tipo: plantilla.tipo,
      body: plantilla.body,
    });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (plantilla: PlantillaMensaje) => {
    setSelectedPlantilla(plantilla);
    setIsDeleteDialogOpen(true);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio";
    }

    if (!formData.tipo) {
      errors.tipo = "El tipo de plantilla es obligatorio";
    }

    if (!formData.body.trim()) {
      errors.body = "El contenido del mensaje es obligatorio";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreatePlantilla = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const newPlantilla = {
        nombre: formData.nombre.trim(),
        tipo: formData.tipo as TipoPlantilla,
        body: formData.body.trim(),
        empresaId: empresaId, // Valor fijo para el ejemplo
      };

      const response = await axios.post(
        `${VITE_CRM_API_URL}/mensaje`,
        newPlantilla
      );

      if (response.status === 201) {
        toast.success("Plantilla creada exitosamente");
        loadPlantillas();
        setIsCreateDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      toast("No se pudo crear la plantilla. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePlantilla = async () => {
    if (!validateForm() || !selectedPlantilla) return;

    setIsLoading(true);
    try {
      const data = {
        nombre: formData.nombre.trim(),
        tipo: formData.tipo as TipoPlantilla,
        body: formData.body.trim(),
      };

      const response = await axios.patch(
        `${VITE_CRM_API_URL}/mensaje/${selectedPlantilla.id}`,
        data
      );

      if (response.status === 200) {
        toast.success("Plantilla actualizada exitosamente");
        setIsLoading(false);
        loadPlantillas();
        setIsEditDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      toast("No se pudo actualizar la plantilla. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlantilla = async () => {
    if (!selectedPlantilla) return;

    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${VITE_CRM_API_URL}/mensaje/${selectedPlantilla.id}`
      );

      if (response.status === 200) {
        toast.success("Plantilla eliminada exitosamente");
        loadPlantillas();
        setIsLoading(false);
        setIsDeleteDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      toast("No se pudo eliminar la plantilla. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Plantillas de Mensajes</CardTitle>
              <CardDescription>
                Gestione las plantillas para comunicaciones automáticas con
                clientes
              </CardDescription>
            </div>
            <Button onClick={handleOpenCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Plantilla
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar plantillas..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Nombre</TableHead>
                    <TableHead className="w-[180px]">Tipo</TableHead>
                    <TableHead>Contenido</TableHead>
                    <TableHead className="w-[100px] text-right">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlantillas.map((plantilla) => (
                    <TableRow key={plantilla.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {plantilla.nombre}
                        </div>
                      </TableCell>
                      <TableCell>
                        {tipoPlantillaLabels[plantilla.tipo]}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md truncate text-sm text-muted-foreground">
                          {plantilla.body}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menú</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleOpenEditDialog(plantilla)}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleOpenDeleteDialog(plantilla)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de Creación */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <MessageSquare className="h-5 w-5 mr-2" />
              Nueva Plantilla de Mensaje
            </DialogTitle>
            <DialogDescription>
              Cree una nueva plantilla para comunicaciones automáticas con
              clientes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="flex items-center">
                Nombre <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id="nombre"
                placeholder="Ej: Recordatorio de pago mensual"
                value={formData.nombre}
                onChange={(e) => handleFormChange("nombre", e.target.value)}
                className={formErrors.nombre ? "border-destructive" : ""}
              />
              {formErrors.nombre && (
                <p className="text-sm text-destructive flex items-center">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {formErrors.nombre}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo" className="flex items-center">
                Tipo de Plantilla{" "}
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => handleFormChange("tipo", value)}
              >
                <SelectTrigger
                  id="tipo"
                  className={formErrors.tipo ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Seleccionar tipo de plantilla" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(tipoPlantillaLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.tipo && (
                <p className="text-sm text-destructive flex items-center">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {formErrors.tipo}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="body" className="flex items-center">
                Contenido del Mensaje{" "}
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Textarea
                id="body"
                placeholder="Escriba el contenido del mensaje..."
                value={formData.body}
                onChange={(e) => handleFormChange("body", e.target.value)}
                className={`min-h-[150px] ${
                  formErrors.body ? "border-destructive" : ""
                }`}
              />
              {formErrors.body ? (
                <p className="text-sm text-destructive flex items-center">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {formErrors.body}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Al crear su mensaje, puede utilizar variables como:{" "}
                  {"[nombre_cliente]"}, {"[fecha_pago]"}, {"[monto_pago]"},{" "}
                  {"[nombre_servicio]"}, {"[detalle_factura]"} y{" "}
                  {"[empresa_nombre]"} para personalizar y optimizar el
                  contenido del texto.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreatePlantilla} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Creando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Crear Plantilla
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="text-center items-center">
            <DialogTitle className="flex items-center text-xl text-center">
              <Pencil className="h-5 w-5 mr-2" />
              Editar Plantilla de Mensaje
            </DialogTitle>
            <DialogDescription className="text-center">
              Modifique los detalles de la plantilla de mensaje.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nombre" className="flex items-center">
                Nombre <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id="edit-nombre"
                placeholder="Ej: Recordatorio de pago mensual"
                value={formData.nombre}
                onChange={(e) => handleFormChange("nombre", e.target.value)}
                className={formErrors.nombre ? "border-destructive" : ""}
              />
              {formErrors.nombre && (
                <p className="text-sm text-destructive flex items-center">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {formErrors.nombre}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-tipo" className="flex items-center">
                Tipo de Plantilla{" "}
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => handleFormChange("tipo", value)}
              >
                <SelectTrigger
                  id="edit-tipo"
                  className={formErrors.tipo ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Seleccionar tipo de plantilla" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(tipoPlantillaLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.tipo && (
                <p className="text-sm text-destructive flex items-center">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {formErrors.tipo}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-body" className="flex items-center">
                Contenido del Mensaje{" "}
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Textarea
                id="edit-body"
                placeholder="Escriba el contenido del mensaje..."
                value={formData.body}
                onChange={(e) => handleFormChange("body", e.target.value)}
                className={`min-h-[150px] ${
                  formErrors.body ? "border-destructive" : ""
                }`}
              />
              {formErrors.body ? (
                <p className="text-sm text-destructive flex items-center">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {formErrors.body}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Al crear su mensaje, puede utilizar variables como:
                  [nombre_cliente], [fecha_pago], [monto_pago],
                  [nombre_servicio], [detalle_factura] y [empresa_nombre] para
                  personalizar y optimizar el contenido del texto.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdatePlantilla} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Actualizando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center text-xl">
              <Trash2 className="h-5 w-5 mr-2 text-destructive" />
              <span>Eliminar Plantilla</span>
            </div>
          </DialogHeader>
          <p className="mt-2">
            ¿Está seguro de que desea eliminar esta plantilla? Esta acción no se
            puede deshacer.
          </p>
          {selectedPlantilla && (
            <div className="py-4">
              <div className="p-3 border rounded-md bg-muted/20">
                <p className="font-medium">{selectedPlantilla.nombre}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Tipo: {tipoPlantillaLabels[selectedPlantilla.tipo]}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button disabled={isLoading}>Cancelar</Button>
            <Button
              onClick={handleDeletePlantilla}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  <span>Eliminando...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <XCircle className="h-4 w-4 mr-2" />
                  <span>Eliminar</span>
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
