"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  MoreVertical,
  Edit,
  Trash2,
  Search,
  PlusCircle,
  Save,
  AlertCircle,
  Loader2,
  RefreshCw,
  Copy,
  Eye,
  FileSignature,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

// Types
interface PlantillaContrato {
  id: number;
  nombre: string;
  body: string;
  empresaId: number;
  creadoEn?: string;
  actualizadoEn?: string;
}

interface NuevaPlantillaContrato {
  nombre: string;
  body: string;
  empresaId: number;
}

// Componente principal
const PlantillaContratoManage: React.FC = () => {
  // Estado para plantillas
  const [plantillas, setPlantillas] = useState<PlantillaContrato[]>([]);
  const [searchPlantilla, setSearchPlantilla] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para formularios
  const empresaID = useStoreCrm((state) => state.empresaId) ?? 0;
  const [nuevaPlantilla, setNuevaPlantilla] = useState<NuevaPlantillaContrato>({
    nombre: "",
    body: "",
    empresaId: empresaID,
  });

  // Estado para diálogos
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

  // Estado para edición y eliminación
  const [editingPlantilla, setEditingPlantilla] =
    useState<PlantillaContrato | null>(null);
  const [deletePlantillaId, setDeletePlantillaId] = useState<number | null>(
    null
  );
  const [previewPlantilla, setPreviewPlantilla] =
    useState<PlantillaContrato | null>(null);

  // Cargar datos
  useEffect(() => {
    fetchPlantillas();
  }, []);

  // Función para cargar plantillas
  const fetchPlantillas = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // En un entorno real, esta sería la llamada a la API
      const response = await axios.get(
        `${VITE_CRM_API_URL}/contrato-cliente/plantillas-contrato`
      );

      if (response.status === 200) {
        setPlantillas(response.data);
      }
    } catch (err) {
      console.error("Error al cargar plantillas:", err);
      setError("Error al cargar las plantillas. Intente nuevamente.");
      toast.error("Error al cargar las plantillas");
    } finally {
      setIsLoading(false);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setNuevaPlantilla({
      nombre: "",
      body: "",
      empresaId: empresaID,
    });
  };

  // Handlers para formulario
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (editingPlantilla) {
      setEditingPlantilla((prev) => ({
        ...prev!,
        [name]: value,
      }));
    } else {
      setNuevaPlantilla((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Submit handlers
  const handleSubmitPlantilla = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validar que los campos no estén vacíos
      if (!nuevaPlantilla.nombre.trim()) {
        throw new Error("El nombre de la plantilla no puede estar vacío");
      }

      if (!nuevaPlantilla.body.trim()) {
        throw new Error("El contenido de la plantilla no puede estar vacío");
      }

      // En un entorno real, esta sería la llamada a la API
      const response = await axios.post(
        `${VITE_CRM_API_URL}/contrato-cliente/plantilla`,
        nuevaPlantilla
      );

      if (response.status === 201) {
        toast.success("Plantilla creada exitosamente");
        await fetchPlantillas();
        resetForm();
        setIsCreateDialogOpen(false);
      }
    } catch (err: any) {
      console.error("Error al crear plantilla:", err);
      setError(
        err.message || "Error al crear la plantilla. Intente nuevamente."
      );
      toast.error(err.message || "Error al crear la plantilla");
    } finally {
      setIsLoading(false);
    }
  };

  // Edit handlers
  const handleEditClick = (plantilla: PlantillaContrato) => {
    setEditingPlantilla(plantilla);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingPlantilla) return;

    setIsLoading(true);
    setError(null);

    try {
      // Validar que los campos no estén vacíos
      if (!editingPlantilla.nombre.trim()) {
        throw new Error("El nombre de la plantilla no puede estar vacío");
      }

      if (!editingPlantilla.body.trim()) {
        throw new Error("El contenido de la plantilla no puede estar vacío");
      }

      // En un entorno real, esta sería la llamada a la API
      const response = await axios.patch(
        `${VITE_CRM_API_URL}/contrato-cliente/plantilla`,
        {
          id: editingPlantilla.id,
          nombre: editingPlantilla.nombre,
          body: editingPlantilla.body,
          empresaId: editingPlantilla.empresaId,
        }
      );

      if (response.status === 200) {
        toast.success("Plantilla actualizada exitosamente");
        await fetchPlantillas();
        setIsEditDialogOpen(false);
        setEditingPlantilla(null);
      }
    } catch (err: any) {
      console.error("Error al actualizar plantilla:", err);
      setError(
        err.message || "Error al actualizar la plantilla. Intente nuevamente."
      );
      toast.error(err.message || "Error al actualizar la plantilla");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete handlers
  const handleDeleteClick = (id: number) => {
    setDeletePlantillaId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletePlantillaId === null) return;

    setIsLoading(true);
    setError(null);

    try {
      // En un entorno real, esta sería la llamada a la API
      const response = await axios.delete(
        `${VITE_CRM_API_URL}/contrato-cliente/plantilla/${deletePlantillaId}`
      );

      if (response.status === 200) {
        toast.success("Plantilla eliminada exitosamente");
        await fetchPlantillas();
        setIsDeleteDialogOpen(false);
        setDeletePlantillaId(null);
      }
    } catch (err) {
      console.error("Error al eliminar plantilla:", err);
      setError("Error al eliminar la plantilla. Intente nuevamente.");
      toast.error("Error al eliminar la plantilla");
    } finally {
      setIsLoading(false);
    }
  };

  // Preview handler
  const handlePreviewClick = (plantilla: PlantillaContrato) => {
    setPreviewPlantilla(plantilla);
    setIsPreviewDialogOpen(true);
  };

  // Duplicate handler
  const handleDuplicateClick = (plantilla: PlantillaContrato) => {
    setNuevaPlantilla({
      nombre: `${plantilla.nombre} (Copia)`,
      body: plantilla.body,
      empresaId: empresaID,
    });
    setIsCreateDialogOpen(true);
  };

  // Filter plantillas based on search
  const filteredPlantillas = plantillas.filter((plantilla) =>
    plantilla.nombre.toLowerCase().includes(searchPlantilla.toLowerCase())
  );

  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Plantillas de Contrato
          </h1>
          <p className="text-muted-foreground">
            Gestione las plantillas para generar contratos para sus clientes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar plantillas..."
              className="pl-8 w-full md:w-[250px]"
              value={searchPlantilla}
              onChange={(e) => setSearchPlantilla(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchPlantillas}
            title="Actualizar"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button className="gap-1" onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="h-4 w-4" />
            <span className="hidden md:inline">Nueva Plantilla</span>
            <span className="md:hidden">Nueva</span>
          </Button>
        </div>
      </div>

      {/* Mensajes de error */}
      {error && (
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Tabla de plantillas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl">Plantillas Existentes</CardTitle>
            <CardDescription>
              Lista de plantillas disponibles para contratos
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && plantillas.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : plantillas.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8">
              <FileText className="h-10 w-10 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                No hay plantillas configuradas
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                Crear nueva plantilla
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <ScrollArea className="h-[calc(100vh-400px)] min-h-[300px] rounded-md">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Última Modificación
                        </TableHead>
                        <TableHead className="w-[150px] text-right">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPlantillas.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center text-muted-foreground py-6"
                          >
                            No se encontraron resultados para "{searchPlantilla}
                            "
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPlantillas.map((plantilla) => (
                          <TableRow key={plantilla.id}>
                            <TableCell>
                              <div className="font-medium">
                                {plantilla.nombre}
                              </div>
                              <div className="text-sm text-muted-foreground md:hidden">
                                Modificado:{" "}
                                {formatDate(plantilla.actualizadoEn)}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {formatDate(plantilla.creadoEn)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handlePreviewClick(plantilla)}
                                  title="Vista previa"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    handleDuplicateClick(plantilla)
                                  }
                                  title="Duplicar"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
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
                                      onClick={() => handleEditClick(plantilla)}
                                    >
                                      <Edit className="h-4 w-4" />
                                      <span>Editar</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="flex items-center gap-2 text-destructive"
                                      onClick={() =>
                                        handleDeleteClick(plantilla.id)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span>Eliminar</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para Crear Plantilla */}
      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Crear Nueva Plantilla de Contrato</DialogTitle>
            <DialogDescription>
              Ingrese un nombre y el contenido para la nueva plantilla de
              contrato.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitPlantilla}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Plantilla</Label>
                <div className="relative">
                  <FileText className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nombre"
                    name="nombre"
                    className="pl-8"
                    placeholder="Ej: Contrato de Servicio Estándar"
                    value={nuevaPlantilla.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Elija un nombre descriptivo para identificar fácilmente esta
                  plantilla
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Contenido de la Plantilla</Label>
                <Textarea
                  id="body"
                  name="body"
                  className="min-h-[300px] font-mono text-sm"
                  placeholder="Ingrese el contenido de la plantilla aquí..."
                  value={nuevaPlantilla.body}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Puede utilizar variables como {"{nombre_cliente}"},{" "}
                  {"{fecha}"}, etc. que serán reemplazadas al generar el
                  contrato
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  !nuevaPlantilla.nombre.trim() ||
                  !nuevaPlantilla.body.trim()
                }
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Plantilla"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para Editar Plantilla */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setEditingPlantilla(null);
        }}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Editar Plantilla de Contrato</DialogTitle>
            <DialogDescription>
              Modifique el nombre y contenido de la plantilla.
            </DialogDescription>
          </DialogHeader>
          {editingPlantilla && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit();
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nombre">Nombre de la Plantilla</Label>
                  <div className="relative">
                    <FileText className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="edit-nombre"
                      name="nombre"
                      className="pl-8"
                      value={editingPlantilla.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-body">Contenido de la Plantilla</Label>
                  <Textarea
                    id="edit-body"
                    name="body"
                    className="min-h-[300px] font-mono text-sm"
                    value={editingPlantilla.body}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Puede utilizar variables como {"{nombre_cliente}"},{" "}
                    {"{fecha}"}, etc. que serán reemplazadas al generar el
                    contrato
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    !editingPlantilla.nombre.trim() ||
                    !editingPlantilla.body.trim()
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar esta plantilla? Esta acción no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Advertencia</AlertTitle>
              <AlertDescription>
                Si elimina esta plantilla, no podrá utilizarla para generar
                nuevos contratos.
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

      {/* Diálogo de Vista Previa */}
      <Dialog
        open={isPreviewDialogOpen}
        onOpenChange={(open) => {
          setIsPreviewDialogOpen(open);
          if (!open) setPreviewPlantilla(null);
        }}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Vista Previa de Plantilla</DialogTitle>
            <DialogDescription>{previewPlantilla?.nombre}</DialogDescription>
          </DialogHeader>
          {previewPlantilla && (
            <div className="py-4">
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="whitespace-pre-wrap font-mono text-sm">
                  {previewPlantilla.body}
                </div>
              </ScrollArea>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPreviewDialogOpen(false)}
            >
              Cerrar
            </Button>
            <Button
              onClick={() => {
                setIsPreviewDialogOpen(false);
                handleEditClick(previewPlantilla!);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar Plantilla
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlantillaContratoManage;
