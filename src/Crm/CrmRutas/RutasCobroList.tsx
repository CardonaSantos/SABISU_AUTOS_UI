"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  MoreVertical,
  MapPin,
  User,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Check,
  Play,
  Eye,
  Edit,
  Trash2,
  MapPinned,
  UserCheck,
  Phone,
  Home,
  Info,
  AlertCircle,
  Loader2,
  BookmarkX,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { RutasSkeleton } from "./RutasSkeleton";
import { EstadoRuta, EstadoCliente, type Ruta } from "./rutas-types";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

export function RutasCobroList() {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [searchRuta, setSearchRuta] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRuta, setSelectedRuta] = useState<Ruta | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rutaToDelete, setRutaToDelete] = useState<number | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    fetchRutas();
  }, []);

  // Función para cargar rutas
  const fetchRutas = async () => {
    setIsLoading(true);
    // setError(null);
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/ruta-cobro/get-rutas-cobros`
      );
      if (response.status === 200) {
        setRutas(response.data);
      }
    } catch (err) {
      console.error("Error al cargar rutas:", err);
      // setError("Error al cargar las rutas de cobro. Intente nuevamente.");
      toast.error("Error al cargar las rutas de cobro");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para ver detalles de una ruta
  const handleViewRuta = (ruta: Ruta) => {
    setSelectedRuta(ruta);
    setIsViewDialogOpen(true);
  };

  // Función para eliminar una ruta
  const handleDeleteClick = (rutaId: number) => {
    setRutaToDelete(rutaId);
    setIsDeleteDialogOpen(true);
  };

  const [rutaClose, setRutaClose] = useState<number | null>(null);
  const [openCloseRuta, setOpenCloseRuta] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleCloseRuta = (rutaId: number) => {
    setRutaClose(rutaId);
    setOpenCloseRuta(true);
  };

  const handleCloseRutaCobro = async () => {
    if (rutaClose === null) return;

    setIsClosing(true);
    try {
      const response = await axios.patch(
        `${VITE_CRM_API_URL}/ruta-cobro/close-one-ruta/${rutaClose}`
      );

      if (response.status === 200) {
        setOpenCloseRuta(false);
        setRutaClose(null);
        toast.success("Ruta cerrada correctamente");
        setIsClosing(false);
        fetchRutas();
      }
    } catch (err) {
      console.error("Error al eliminar ruta:", err);
      toast.error("Error al eliminar la ruta");
      setIsClosing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (rutaToDelete === null) return;

    setIsSubmitting(true);

    try {
      const response = await axios.delete(
        `${VITE_CRM_API_URL}/ruta-cobro/delete-one-ruta/${rutaToDelete}`
      );

      if (response.status === 200) {
        setIsDeleteDialogOpen(false);
        setRutaToDelete(null);
        toast.success("Ruta eliminada correctamente");
        setIsSubmitting(false);
        fetchRutas();
      }
    } catch (err) {
      console.error("Error al eliminar ruta:", err);
      toast.error("Error al eliminar la ruta");
      setIsSubmitting(false);
    }
  };

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-GT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Obtener el color del badge según el estado
  const getEstadoBadgeColor = (estado: EstadoRuta) => {
    switch (estado) {
      case EstadoRuta.ACTIVO:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case EstadoRuta.PENDIENTE:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case EstadoRuta.COMPLETADO:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case EstadoRuta.INACTIVO:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "";
    }
  };

  // Obtener el color del badge según el estado del cliente
  const getClienteEstadoBadgeColor = (estado: EstadoCliente) => {
    switch (estado) {
      case EstadoCliente.ACTIVO:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case EstadoCliente.MOROSO:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case EstadoCliente.SUSPENDIDO:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case EstadoCliente.ATRASADO:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "";
    }
  };

  // Obtener el icono según el estado
  const getEstadoIcon = (estado: EstadoRuta) => {
    switch (estado) {
      case EstadoRuta.ACTIVO:
        return <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      case EstadoRuta.PENDIENTE:
        return <Clock className="h-3.5 w-3.5 mr-1" />;
      case EstadoRuta.COMPLETADO:
        return <Check className="h-3.5 w-3.5 mr-1" />;
      case EstadoRuta.INACTIVO:
        return <XCircle className="h-3.5 w-3.5 mr-1" />;
      default:
        return null;
    }
  };

  const filteredRutas = rutas.filter(
    (ruta) =>
      ruta.nombreRuta.toLowerCase().includes(searchRuta.toLowerCase()) ||
      (ruta.cobrador &&
        `${ruta.cobrador.nombre} ${ruta.cobrador.apellidos || ""}`
          .toLowerCase()
          .includes(searchRuta.toLowerCase())) ||
      (ruta.observaciones &&
        ruta.observaciones.toLowerCase().includes(searchRuta.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Rutas de Cobro Existentes
          </CardTitle>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar rutas..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchRuta}
              onChange={(e) => setSearchRuta(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <RutasSkeleton />
        ) : rutas.length === 0 ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Sin rutas</AlertTitle>
            <AlertDescription>
              No hay rutas de cobro registradas. Cree una nueva utilizando la
              pestaña "Crear Ruta".
            </AlertDescription>
          </Alert>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Cobrador
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Clientes
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Estado
                    </TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRutas.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground py-6"
                      >
                        No se encontraron resultados para "{searchRuta}"
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRutas.map((ruta) => (
                      <TableRow key={ruta.id} className="group">
                        <TableCell>
                          <div className="font-medium">{ruta.nombreRuta}</div>
                          <div className="text-xs text-muted-foreground">
                            Creada: {formatDate(ruta.fechaCreacion)}
                          </div>
                          <div className="md:hidden mt-1">
                            <Badge
                              className={`${getEstadoBadgeColor(
                                ruta.estadoRuta
                              )} flex items-center text-xs`}
                            >
                              {getEstadoIcon(ruta.estadoRuta)}
                              {ruta.estadoRuta}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {ruta.cobrador ? (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {ruta.cobrador.nombre}{" "}
                                {ruta.cobrador.apellidos || ""}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              Sin asignar
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{ruta.clientes.length}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge
                            className={`${getEstadoBadgeColor(
                              ruta.estadoRuta
                            )} flex items-center`}
                          >
                            {getEstadoIcon(ruta.estadoRuta)}
                            {ruta.estadoRuta}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
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
                                {/* Ver detalles */}
                                <DropdownMenuItem
                                  className="flex items-center gap-2"
                                  onClick={() => handleViewRuta(ruta)}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span>Ver detalles</span>
                                </DropdownMenuItem>

                                {/* Opciones visibles solo si la ruta no está cerrada */}
                                {ruta.estadoRuta !== EstadoRuta.CERRADO && (
                                  <>
                                    <DropdownMenuItem
                                      className="flex items-center gap-2"
                                      asChild
                                    >
                                      <Link
                                        to={`/crm/cobros-en-ruta/${ruta.id}`}
                                      >
                                        <Play className="h-4 w-4" />
                                        <span>Iniciar Ruta</span>
                                      </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                      className="flex items-center gap-2"
                                      asChild
                                    >
                                      <Link
                                        to={`/crm/rutas-cobro/edit/${ruta.id}`}
                                      >
                                        <Edit className="h-4 w-4" />
                                        <span>Editar</span>
                                      </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                      className="flex items-center gap-2"
                                      onClick={() => handleCloseRuta(ruta.id)}
                                    >
                                      <BookmarkX className="h-4 w-4" />
                                      <span>Cerrar Ruta</span>
                                    </DropdownMenuItem>
                                  </>
                                )}

                                {/* Eliminar (siempre disponible) */}
                                <DropdownMenuItem
                                  className="flex items-center gap-2 text-destructive"
                                  onClick={() => handleDeleteClick(ruta.id)}
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
          </div>
        )}
      </CardContent>

      {/* Diálogo de detalles de ruta */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPinned className="h-5 w-5 text-primary" />
              {selectedRuta?.nombreRuta}
            </DialogTitle>
            <DialogDescription>Detalles de la ruta de cobro</DialogDescription>
          </DialogHeader>
          {selectedRuta && (
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Información General
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`${getEstadoBadgeColor(
                            selectedRuta.estadoRuta
                          )} flex items-center`}
                        >
                          {getEstadoIcon(selectedRuta.estadoRuta)}
                          {selectedRuta.estadoRuta}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>
                          Creada: {formatDate(selectedRuta.fechaCreacion)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>
                          Actualizada:{" "}
                          {formatDate(selectedRuta.fechaActualizacion)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Cobrador Asignado
                    </h3>
                    {selectedRuta.cobrador ? (
                      <div className="mt-2 p-3 bg-muted rounded-md">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-primary" />
                          <span className="font-medium">
                            {selectedRuta.cobrador.nombre}{" "}
                            {selectedRuta.cobrador.apellidos || ""}
                          </span>
                        </div>
                        {selectedRuta.cobrador.telefono && (
                          <div className="flex items-center gap-2 mt-1 text-sm">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{selectedRuta.cobrador.telefono}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{selectedRuta.cobrador.email}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 text-muted-foreground">
                        No hay cobrador asignado a esta ruta
                      </div>
                    )}
                  </div>

                  {selectedRuta.observaciones && (
                    <>
                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Observaciones
                        </h3>
                        <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                          {selectedRuta.observaciones}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="mt-2">
                      <div className="text-sm font-medium flex justify-between mb-2">
                        <span>
                          Total a cobrar: Q
                          {selectedRuta.clientes
                            .reduce(
                              (sum, cliente) =>
                                sum + (cliente.saldoPendiente || 0),
                              0
                            )
                            .toFixed(2)}
                        </span>
                        <span>
                          Cobrado: Q{selectedRuta.montoCobrado.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ScrollArea className="h-[300px] rounded-md border">
                    <div className="p-4 space-y-4">
                      {selectedRuta.clientes.length === 0 ? (
                        <div className="text-center text-muted-foreground py-4">
                          No hay clientes en esta ruta
                        </div>
                      ) : (
                        selectedRuta.clientes.map((cliente) => (
                          <div
                            key={cliente.id}
                            className="p-3 bg-muted rounded-md"
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-medium">
                                {cliente.nombre} {cliente.apellidos || ""}
                              </div>
                              <Badge
                                className={getClienteEstadoBadgeColor(
                                  cliente.estadoCliente
                                )}
                              >
                                {cliente.estadoCliente}
                              </Badge>
                            </div>

                            {cliente.telefono && (
                              <div className="flex items-center gap-2 mt-1 text-sm">
                                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{cliente.telefono}</span>
                              </div>
                            )}

                            {cliente.direccion && (
                              <div className="flex items-start gap-2 mt-1 text-sm">
                                <Home className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                                <span>{cliente.direccion}</span>
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-2">
                              <div className="text-sm">
                                <span className="font-medium">
                                  Saldo: Q
                                  {cliente.saldoPendiente?.toFixed(2) || "0.00"}
                                </span>
                                {cliente.facturasPendientes &&
                                  cliente.facturasPendientes > 0 && (
                                    <span className="text-xs text-muted-foreground ml-2">
                                      ({cliente.facturasPendientes} facturas)
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar esta ruta de cobro? Esta acción no
              se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Advertencia</AlertTitle>
              <AlertDescription>
                Al eliminar esta ruta, se perderá toda la información asociada a
                ella.
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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

      {/* DIALOG DE CIERRE DE RUTA */}
      <Dialog open={openCloseRuta} onOpenChange={setOpenCloseRuta}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Cierre de Ruta</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea cerrar esta ruta de cobro? Una vez cerrada,
              ya no estará disponible para realizar más cobros.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Advertencia</AlertTitle>
              <AlertDescription>
                Esta acción cerrará la ruta. No se eliminarán los registros
                históricos, pero no podrá reactivarse para cobros futuros.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCloseRuta(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleCloseRutaCobro}
              disabled={isClosing}
            >
              {isClosing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cerrando...
                </>
              ) : (
                "Cerrar Ruta"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
