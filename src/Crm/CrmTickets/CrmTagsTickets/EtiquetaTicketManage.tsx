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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tag,
  MoreVertical,
  Edit,
  Trash2,
  Search,
  PlusCircle,
  Save,
  AlertCircle,
  Loader2,
  Ticket,
  Check,
  FileText,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

// Types
interface EtiquetaTicket {
  id: number;
  nombre: string;
  tickets?: number;
  ticketsCount?: number; // Campo calculado para mostrar la cantidad de tickets
}

interface NuevaEtiquetaTicket {
  nombre: string;
}

// Componente principal
const EtiquetaTicketManage: React.FC = () => {
  // State para etiquetas
  const [etiquetas, setEtiquetas] = useState<EtiquetaTicket[]>([]);
  const [searchEtiqueta, setSearchEtiqueta] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // State para formulario
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState<NuevaEtiquetaTicket>({
    nombre: "",
  });

  // State para diálogos
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // const [isTicketsDialogOpen, setIsTicketsDialogOpen] = useState(false);

  // State para edición y eliminación
  const [editingEtiqueta, setEditingEtiqueta] = useState<EtiquetaTicket | null>(
    null
  );
  const [deleteEtiquetaId, setDeleteEtiquetaId] = useState<number | null>(null);
  // const [selectedEtiqueta, setSelectedEtiqueta] =
  //   useState<EtiquetaTicket | null>(null);

  // Estadísticas
  const [stats, setStats] = useState({
    totalEtiquetas: 0,
    totalTickets: 0,
  });

  // Cargar datos
  useEffect(() => {
    fetchEtiquetas();
  }, []);

  // Función para cargar etiquetas
  const fetchEtiquetas = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${VITE_CRM_API_URL}/tags-ticket`);
      if (response.status === 200) {
        setEtiquetas(response.data);

        // Calcular estadísticas
        const totalTickets = response.data.reduce(
          (acc: number, curr: EtiquetaTicket) => acc + (curr.ticketsCount || 0),
          0
        );

        setStats({
          totalEtiquetas: response.data.length,
          totalTickets,
        });

        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error al cargar etiquetas:", err);
      setError("Error al cargar las etiquetas. Intente nuevamente.");
      setIsLoading(false);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setNuevaEtiqueta({ nombre: "" });
  };

  // Handlers para formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (editingEtiqueta) {
      setEditingEtiqueta((prev) => ({
        ...prev!,
        [name]: value,
      }));
    } else {
      setNuevaEtiqueta((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Submit handlers
  const handleSubmitEtiqueta = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validar que el nombre no esté vacío
      if (!nuevaEtiqueta.nombre.trim()) {
        throw new Error("El nombre de la etiqueta no puede estar vacío");
      }

      // Validar que el nombre sea único
      if (
        etiquetas.some(
          (e) => e.nombre.toLowerCase() === nuevaEtiqueta.nombre.toLowerCase()
        )
      ) {
        throw new Error("Ya existe una etiqueta con este nombre");
      }

      const response = await axios.post(
        `${VITE_CRM_API_URL}/tags-ticket`,
        nuevaEtiqueta
      );

      if (response.status === 201) {
        toast.success("Etiqueta creada exitosamente");
        await fetchEtiquetas();
        resetForm();
        setIsCreateDialogOpen(false);
      }
    } catch (err: any) {
      console.error("Error al crear etiqueta:", err);
      setError(
        err.message || "Error al crear la etiqueta. Intente nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Edit handlers
  const handleEditClick = (etiqueta: EtiquetaTicket) => {
    setEditingEtiqueta(etiqueta);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingEtiqueta) return;

    setIsLoading(true);
    setError(null);

    try {
      // Validar que el nombre no esté vacío
      if (!editingEtiqueta.nombre.trim()) {
        throw new Error("El nombre de la etiqueta no puede estar vacío");
      }

      // Validar que el nombre sea único (excluyendo la etiqueta actual)
      if (
        etiquetas.some(
          (e) =>
            e.id !== editingEtiqueta.id &&
            e.nombre.toLowerCase() === editingEtiqueta.nombre.toLowerCase()
        )
      ) {
        throw new Error("Ya existe una etiqueta con este nombre");
      }

      // En un entorno real, esto sería una llamada a la API
      // const response = await axios.put(`/api/etiquetas-ticket/${editingEtiqueta.id}`, editingEtiqueta)
      // const updatedEtiqueta = response.data

      // Mock para demostración
      setTimeout(() => {
        setEtiquetas(
          etiquetas.map((e) =>
            e.id === editingEtiqueta.id ? editingEtiqueta : e
          )
        );

        // Close dialog and reset editing state
        setIsEditDialogOpen(false);
        setEditingEtiqueta(null);
        setIsLoading(false);

        toast.success("Etiqueta actualizada correctamente");
      }, 600);
    } catch (err: any) {
      console.error("Error al actualizar etiqueta:", err);
      setError(
        err.message || "Error al actualizar la etiqueta. Intente nuevamente."
      );
      setIsLoading(false);
    }
  };

  // Delete handlers
  const handleDeleteClick = (id: number) => {
    setDeleteEtiquetaId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteEtiquetaId === null) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.delete(
        `${VITE_CRM_API_URL}/tags-ticket/delete-ticket/${deleteEtiquetaId}`
      );

      if (response.status === 200) {
        toast.success("Etiqueta eliminada exitosamente");
        await fetchEtiquetas();
        setIsDeleteDialogOpen(false);
      }
    } catch (err) {
      console.error("Error al eliminar etiqueta:", err);
      setError("Error al eliminar la etiqueta. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Ver tickets relacionados

  // Filter etiquetas based on search
  const filteredEtiquetas = etiquetas.filter((etiqueta) =>
    etiqueta.nombre.toLowerCase().includes(searchEtiqueta.toLowerCase())
  );

  // Generar color aleatorio pero consistente para cada etiqueta
  const getTagColor = (id: number): string => {
    const colors = [
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    ];

    return colors[id % colors.length];
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Etiquetas de Tickets
          </h1>
          <p className="text-muted-foreground">
            Gestione las etiquetas para categorizar sus tickets de soporte
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar etiquetas..."
              className="pl-8 w-full md:w-[250px]"
              value={searchEtiqueta}
              onChange={(e) => setSearchEtiqueta(e.target.value)}
            />
          </div>

          <Button className="gap-1" onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="h-4 w-4" />
            <span className="hidden md:inline">Nueva Etiqueta</span>
            <span className="md:hidden">Nueva</span>
          </Button>
        </div>
      </div>

      {/* Mensajes de error y éxito */}
      {error && (
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="max-w-md bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900/30">
          <Check className="h-4 w-4" />
          <AlertTitle>Éxito</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Etiquetas
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold">{stats.totalEtiquetas}</h3>
                <p className="text-sm text-muted-foreground">
                  Etiquetas configuradas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Tickets
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold">{stats.totalTickets}</h3>
                <p className="text-sm text-muted-foreground">
                  Tickets etiquetados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de etiquetas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl">Etiquetas Existentes</CardTitle>
            <CardDescription>
              Lista de etiquetas disponibles para tickets
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && etiquetas.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : etiquetas.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8">
              <FileText className="h-10 w-10 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                No hay etiquetas configuradas
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                Crear nueva etiqueta
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <ScrollArea className="h-[calc(100vh-400px)] min-h-[300px] rounded-md">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Etiqueta</TableHead>
                        <TableHead className="text-center">Tickets</TableHead>
                        <TableHead className="w-[100px] text-right">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEtiquetas.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center text-muted-foreground py-6"
                          >
                            No se encontraron resultados para "{searchEtiqueta}"
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredEtiquetas.map((etiqueta) => (
                          <TableRow key={etiqueta.id}>
                            <TableCell>
                              <Badge
                                className={`font-medium ${getTagColor(
                                  etiqueta.id
                                )}`}
                              >
                                <Tag className="mr-1 h-3 w-3" />
                                {etiqueta.nombre}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 flex items-center gap-1"
                                // onClick={() => handleViewTickets(etiqueta)}
                                disabled={!etiqueta.ticketsCount}
                              >
                                <Ticket className="h-3.5 w-3.5" />
                                <span>{etiqueta.ticketsCount || 0}</span>
                              </Button>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Abrir menú</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    className="flex items-center gap-2"
                                    onClick={() => handleEditClick(etiqueta)}
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span>Editar</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="flex items-center gap-2 text-destructive"
                                    onClick={() =>
                                      handleDeleteClick(etiqueta.id)
                                    }
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
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para Crear Etiqueta */}
      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear Nueva Etiqueta</DialogTitle>
            <DialogDescription>
              Ingrese un nombre único para la nueva etiqueta de tickets.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEtiqueta}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Etiqueta</Label>
                <div className="relative">
                  <Tag className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nombre"
                    name="nombre"
                    className="pl-8"
                    placeholder="Ej: Soporte Técnico"
                    value={nuevaEtiqueta.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  El nombre debe ser único y descriptivo
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
                disabled={isLoading || !nuevaEtiqueta.nombre.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Etiqueta"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Etiqueta</DialogTitle>
            <DialogDescription>
              Modifique el nombre de la etiqueta y guarde los cambios.
            </DialogDescription>
          </DialogHeader>
          {editingEtiqueta && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre de la Etiqueta</Label>
                <div className="relative">
                  <Tag className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-nombre"
                    name="nombre"
                    className="pl-8"
                    value={editingEtiqueta.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
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
              disabled={isLoading || !editingEtiqueta?.nombre.trim()}
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
              ¿Está seguro que desea eliminar esta etiqueta? Esta acción no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Advertencia</AlertTitle>
              <AlertDescription>
                Si hay tickets asociados a esta etiqueta, se eliminará la
                relación con ellos.
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
    </div>
  );
};

export default EtiquetaTicketManage;
