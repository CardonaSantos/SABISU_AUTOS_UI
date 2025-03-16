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
  LinkIcon,
  Check,
} from "lucide-react";

// Types
interface TicketEtiqueta {
  id: number;
  ticketId: number;
  etiquetaId: number;
  ticket: {
    id: number;
    titulo: string;
  };
}

interface EtiquetaTicket {
  id: number;
  nombre: string;
  tickets?: TicketEtiqueta[];
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

  // State para edición
  const [editingEtiqueta, setEditingEtiqueta] = useState<EtiquetaTicket | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // State para eliminación
  const [deleteEtiquetaId, setDeleteEtiquetaId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // State para ver tickets relacionados
  const [selectedEtiqueta, setSelectedEtiqueta] =
    useState<EtiquetaTicket | null>(null);
  const [isTicketsDialogOpen, setIsTicketsDialogOpen] = useState(false);

  // Cargar datos
  useEffect(() => {
    fetchEtiquetas();
  }, []);

  // Función para cargar etiquetas
  const fetchEtiquetas = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // En un entorno real, esto sería una llamada a la API
      // const response = await axios.get('/api/etiquetas-ticket')
      // setEtiquetas(response.data)

      // Mock data para demostración
      setTimeout(() => {
        const mockEtiquetas: EtiquetaTicket[] = [
          {
            id: 1,
            nombre: "Urgente",
            ticketsCount: 12,
            tickets: [
              {
                id: 1,
                ticketId: 101,
                etiquetaId: 1,
                ticket: {
                  id: 101,
                  titulo: "Problema con conexión de internet",
                },
              },
              {
                id: 2,
                ticketId: 102,
                etiquetaId: 1,
                ticket: { id: 102, titulo: "Servicio caído en zona norte" },
              },
              {
                id: 3,
                ticketId: 103,
                etiquetaId: 1,
                ticket: { id: 103, titulo: "Router no enciende" },
              },
            ],
          },
          {
            id: 2,
            nombre: "Soporte Técnico",
            ticketsCount: 25,
            tickets: [
              {
                id: 4,
                ticketId: 104,
                etiquetaId: 2,
                ticket: { id: 104, titulo: "Configuración de router" },
              },
              {
                id: 5,
                ticketId: 105,
                etiquetaId: 2,
                ticket: { id: 105, titulo: "Problema con señal WiFi" },
              },
            ],
          },
          {
            id: 3,
            nombre: "Facturación",
            ticketsCount: 18,
            tickets: [
              {
                id: 6,
                ticketId: 106,
                etiquetaId: 3,
                ticket: { id: 106, titulo: "Error en factura de marzo" },
              },
              {
                id: 7,
                ticketId: 107,
                etiquetaId: 3,
                ticket: { id: 107, titulo: "Solicitud de cambio de plan" },
              },
            ],
          },
          {
            id: 4,
            nombre: "Instalación",
            ticketsCount: 9,
            tickets: [
              {
                id: 8,
                ticketId: 108,
                etiquetaId: 4,
                ticket: {
                  id: 108,
                  titulo: "Programar instalación de servicio",
                },
              },
            ],
          },
          {
            id: 5,
            nombre: "Baja Prioridad",
            ticketsCount: 7,
            tickets: [
              {
                id: 9,
                ticketId: 109,
                etiquetaId: 5,
                ticket: {
                  id: 109,
                  titulo: "Consulta sobre planes disponibles",
                },
              },
            ],
          },
        ];

        setEtiquetas(mockEtiquetas);
        setIsLoading(false);
      }, 600); // Simular tiempo de carga
    } catch (err) {
      console.error("Error al cargar etiquetas:", err);
      setError("Error al cargar las etiquetas. Intente nuevamente.");
      setIsLoading(false);
    }
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

      // En un entorno real, esto sería una llamada a la API
      // const response = await axios.post('/api/etiquetas-ticket', nuevaEtiqueta)
      // const createdEtiqueta = response.data

      // Mock para demostración
      setTimeout(() => {
        const createdEtiqueta: EtiquetaTicket = {
          id: etiquetas.length + 1,
          nombre: nuevaEtiqueta.nombre,
          ticketsCount: 0,
        };

        setEtiquetas([...etiquetas, createdEtiqueta]);

        // Reset form
        setNuevaEtiqueta({
          nombre: "",
        });

        setSuccess("Etiqueta creada correctamente");
        setIsLoading(false);

        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }, 600);
    } catch (err: any) {
      console.error("Error al crear etiqueta:", err);
      setError(
        err.message || "Error al crear la etiqueta. Intente nuevamente."
      );
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

        setSuccess("Etiqueta actualizada correctamente");

        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
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
      // En un entorno real, esto sería una llamada a la API
      // await axios.delete(`/api/etiquetas-ticket/${deleteEtiquetaId}`)

      // Mock para demostración
      setTimeout(() => {
        setEtiquetas(etiquetas.filter((e) => e.id !== deleteEtiquetaId));

        // Close dialog and reset delete state
        setIsDeleteDialogOpen(false);
        setDeleteEtiquetaId(null);
        setIsLoading(false);

        setSuccess("Etiqueta eliminada correctamente");

        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }, 600);
    } catch (err) {
      console.error("Error al eliminar etiqueta:", err);
      setError("Error al eliminar la etiqueta. Intente nuevamente.");
      setIsLoading(false);
    }
  };

  // Ver tickets relacionados
  const handleViewTickets = (etiqueta: EtiquetaTicket) => {
    setSelectedEtiqueta(etiqueta);
    setIsTicketsDialogOpen(true);
  };

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
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Etiquetas de Tickets
          </h1>
          <p className="text-muted-foreground text-sm">
            Gestione las etiquetas para categorizar sus tickets de soporte
          </p>
        </div>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Formulario para crear etiquetas */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Nueva Etiqueta
            </CardTitle>
            <CardDescription>
              Cree una nueva etiqueta para categorizar tickets
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmitEtiqueta}>
            <CardContent>
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
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !nuevaEtiqueta.nombre.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>Crear Etiqueta</>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Tabla de etiquetas */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Etiquetas Existentes
              </CardTitle>
              <CardDescription>
                Lista de etiquetas disponibles para tickets
              </CardDescription>
            </div>
            <div className="relative w-full max-w-[200px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar etiquetas..."
                className="pl-8 w-full"
                value={searchEtiqueta}
                onChange={(e) => setSearchEtiqueta(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && etiquetas.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : etiquetas.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No hay etiquetas</AlertTitle>
                <AlertDescription>
                  No se encontraron etiquetas. Cree una nueva utilizando el
                  formulario.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="rounded-md border overflow-hidden">
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
                                onClick={() => handleViewTickets(etiqueta)}
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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

      {/* View Tickets Dialog */}
      <Dialog open={isTicketsDialogOpen} onOpenChange={setIsTicketsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              Tickets con etiqueta:
              {selectedEtiqueta && (
                <Badge
                  className={`ml-2 font-medium ${
                    selectedEtiqueta ? getTagColor(selectedEtiqueta.id) : ""
                  }`}
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {selectedEtiqueta?.nombre}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Lista de tickets que utilizan esta etiqueta.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedEtiqueta?.tickets &&
            selectedEtiqueta.tickets.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead className="w-[60px] text-right">Ver</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedEtiqueta.tickets.map((ticketEtiqueta) => (
                      <TableRow key={ticketEtiqueta.id}>
                        <TableCell className="font-medium">
                          #{ticketEtiqueta.ticket.id}
                        </TableCell>
                        <TableCell>{ticketEtiqueta.ticket.titulo}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <LinkIcon className="h-4 w-4" />
                            <span className="sr-only">Ver ticket</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No hay tickets</AlertTitle>
                <AlertDescription>
                  No se encontraron tickets asociados a esta etiqueta.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsTicketsDialogOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EtiquetaTicketManage;
