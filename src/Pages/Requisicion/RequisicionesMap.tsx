import { useEffect, useState } from "react";
import type {
  RequisitionResponse,
  RequisitionEstado,
  CreateRequisicionRecepcion,
} from "./requisicion.interfaces";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  FileText,
  Printer,
  Eye,
  Calendar,
  Package,
  DollarSign,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formattMoneda as formatearMoneda, formattFecha } from "../Utils/Utils";
import { formattFecha as formatearFecha } from "../Utils/Utils";
import { Link } from "react-router-dom";
import { ConfirmDialog } from "../Utils/ConfirmDialog";
import {
  deleteRequisicionRegis,
  makeReEnterRequisicion,
} from "./requisicion.api";
import { toast } from "sonner";
import { AdvancedDialog } from "@/utils/components/AdvancedDialog";
import { useStore } from "@/components/Context/ContextSucursal";
interface PropsRequisiciones {
  requisiciones: RequisitionResponse[];
  isLoadingRequisiciones: boolean;
  setIsLoadingRequisiciones: (value: boolean) => void;
  getRequisiciones: () => void;
  fetchAlerts: () => void;
}

const RequisicionesMap = ({
  requisiciones,
  isLoadingRequisiciones,
  getRequisiciones,
  fetchAlerts,
}: PropsRequisiciones) => {
  const userId = useStore((state) => state.userId) ?? 0;
  const sucursalId = useStore((state) => state.sucursalId) ?? 0;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedRequisicion, setSelectedRequisicion] =
    useState<RequisitionResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Calcular paginación
  const totalPages = Math.ceil(requisiciones.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequisiciones = requisiciones.slice(startIndex, endIndex);

  const [openConfirDel, setOpenConfirmDel] = useState<boolean>(false);

  // Función para obtener el color del badge según el estado
  const getEstadoBadgeVariant = (estado: RequisitionEstado) => {
    switch (estado) {
      case "BORRADOR":
        return "secondary";
      case "PENDIENTE":
        return "outline";
      case "APROBADA":
        return "default";
      case "ENVIADA":
        return "secondary";
      case "RECIBIDA":
        return "outline";
      case "COMPLETADA":
        return "default";
      case "CANCELADA":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const [openReIngreso, setOpenReIngreso] = useState<boolean>(false);
  // Función para manejar impresión
  const handleImprimir = (requisicion: RequisitionResponse) => {
    console.log("Imprimir requisición:", requisicion.id);
  };

  // Función para ver detalles
  const handleVerDetalles = (requisicion: RequisitionResponse) => {
    setSelectedRequisicion(requisicion);
    setIsDialogOpen(true);
  };
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const handleDeleteRequisicion = async (id: number) => {
    if (isDeleting) return; // evita dobles clics
    setIsDeleting(true);

    try {
      await deleteRequisicionRegis(id); // ← espera a que el backend responda
      toast.success("Registro eliminado");
      await getRequisiciones(); // refresca la tabla
      setOpenConfirmDel(false); // cierra el diálogo
      setSelectedRequisicion(null); // opcional: limpia selección
      setCurrentPage(1); // opcional: reset de paginación
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error al eliminar requisición:", error);
      toast.error("No se pudo eliminar la requisición");
    } finally {
      setIsDeleting(false);
    }
  };

  const [submiting, setSubmitting] = useState<boolean>(false);

  console.log("las lineas a enviar son: ", selectedRequisicion?.lineas);

  const handleMakeReEnterRequisicion = async () => {
    try {
      setOpenReIngreso(false);
      setSubmitting(true);

      const dto: CreateRequisicionRecepcion = {
        proveedorId: 1,
        requisicionId: selectedRequisicion?.id ?? 0,
        usuarioId: userId,
        sucursalId: sucursalId,
        observaciones: "",
        lineas: (selectedRequisicion?.lineas ?? []).map((linea) => ({
          cantidadRecibida: linea.cantidadSugerida,
          cantidadSolicitada: linea.cantidadSugerida,
          precioUnitario: linea.producto.precioCostoActual,
          productoId: linea.producto.id,
          requisicionLineaId: linea.id,
          ingresadaAStock: true,
          fechaExpiracion: linea.fechaExpiracion ?? null,
        })),
      };

      await makeReEnterRequisicion(dto);
      await getRequisiciones();
      toast.success("Productos ingresados correctamente");
      setIsDialogOpen(false); // Cerrar diálogo
      setSelectedRequisicion(null); // Resetear selección
      await fetchAlerts();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(
          "Error al generar al re ingresar productos: " + error.message
        );
      } else {
        toast.error("Error desconocido al generar al re ingresar productos.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  console.log("Las requisiciones reigstros son: ", requisiciones);
  // Evitar memoria de la requisición seleccionada
  useEffect(() => {
    if (!isDialogOpen) {
      setSelectedRequisicion(null);
    }
  }, [isDialogOpen]);

  if (isLoadingRequisiciones) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Cargando requisiciones...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (requisiciones.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hay requisiciones</h3>
          <p className="text-muted-foreground text-center">
            No se encontraron requisiciones en el sistema.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Requisiciones</span>
          </CardTitle>
          <CardDescription>
            Gestión de requisiciones del sistema. Total: {requisiciones.length}{" "}
            requisiciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Folio</TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Fecha</span>
                    </div>
                  </TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Package className="h-4 w-4" />
                      <span>Líneas</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>Total</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRequisiciones.map((requisicion) => (
                  <TableRow key={requisicion.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {requisicion.folio}
                    </TableCell>
                    <TableCell>{formatearFecha(requisicion.fecha)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={getEstadoBadgeVariant(requisicion.estado)}
                      >
                        {requisicion.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{requisicion.totalLineas}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatearMoneda(requisicion.totalRequisicion)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerDetalles(requisicion)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver detalles</span>
                        </Button>
                        <Link to={`/pdf-requisicion/${requisicion.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleImprimir(requisicion)}
                            className="h-8 w-8 p-0"
                          >
                            <Printer className="h-4 w-4" />
                            <span className="sr-only">Imprimir</span>
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1);
                        }
                      }}
                      className={
                        currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {/* Páginas */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      // Mostrar solo algunas páginas alrededor de la actual
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                              }}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    }
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1);
                        }
                      }}
                      className={
                        currentPage >= totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              {/* Información de paginación */}
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-muted-foreground">
                  Mostrando {startIndex + 1} a{" "}
                  {Math.min(endIndex, requisiciones.length)} de{" "}
                  {requisiciones.length} requisiciones
                </p>
                <p className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Dialog para ver detalles */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedRequisicion(null);
          }
          setIsDialogOpen(open);
        }}
      >
        {" "}
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>
                Detalles de Requisición - {selectedRequisicion?.folio}
              </span>
            </DialogTitle>
            <DialogDescription>
              Información completa de la requisición y sus líneas de productos
            </DialogDescription>
          </DialogHeader>

          {selectedRequisicion && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6">
                {/* Información general */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">
                        Información General
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Folio:
                        </span>
                        <span className="text-sm font-medium">
                          {selectedRequisicion.folio}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Fecha:
                        </span>
                        <span className="text-sm">
                          {formatearFecha(selectedRequisicion.fecha)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Estado:
                        </span>
                        <Badge
                          variant={getEstadoBadgeVariant(
                            selectedRequisicion.estado
                          )}
                        >
                          {selectedRequisicion.estado}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Total Líneas:
                        </span>
                        <Badge variant="outline">
                          {selectedRequisicion.totalLineas}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">
                        Detalles Adicionales
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Sucursal:
                        </span>
                        <span className="text-sm font-medium">
                          {selectedRequisicion.sucursal.nombre}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Usuario:
                        </span>
                        <span className="text-sm">
                          {selectedRequisicion.usuario.nombre}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Rol:
                        </span>
                        <span className="text-sm">
                          {selectedRequisicion.usuario.rol}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Total:
                        </span>
                        <span className="text-sm font-bold">
                          {formatearMoneda(
                            selectedRequisicion.totalRequisicion
                          )}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-2">
                  <Button
                    disabled={selectedRequisicion?.ingresadaAStock}
                    onClick={() => {
                      setOpenReIngreso(true);
                    }}
                    variant={"destructive"}
                  >
                    {selectedRequisicion.ingresadaAStock
                      ? "Ingresado al stock"
                      : " Generar Re-Ingreso de Stocks"}
                  </Button>

                  {selectedRequisicion.ingresadaAStock ? null : (
                    <Link to={`/requisicion-edit/${selectedRequisicion.id}`}>
                      <Button
                        disabled={selectedRequisicion?.ingresadaAStock}
                        variant={"outline"}
                      >
                        Editar Registro
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Observaciones */}
                {selectedRequisicion.observaciones && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">
                        Observaciones
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {selectedRequisicion.observaciones}
                      </p>
                    </CardContent>
                  </Card>
                )}

                <Separator />

                {/* Líneas de productos */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>
                      Líneas de Productos ({selectedRequisicion.lineas.length})
                    </span>
                  </h3>

                  <div className="space-y-3">
                    {selectedRequisicion.lineas.map((linea) => (
                      <Card
                        key={linea.id}
                        className="border-l-4 border-l-primary"
                      >
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <h4 className="font-medium text-sm mb-2">
                                {linea.producto.nombre}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                Código: {linea.producto.codigoProducto}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Linea ID: {linea.id}
                              </p>

                              <p className="text-xs text-muted-foreground">
                                Fecha Expiración:{" "}
                                {linea.fechaExpiracion ? (
                                  <span className="font-semibold">
                                    {formattFecha(linea?.fechaExpiracion)}
                                  </span>
                                ) : (
                                  "No especificado"
                                )}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Stock Actual:
                                </span>
                                <span className="font-medium">
                                  {linea.cantidadActual}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Stock Mínimo:
                                </span>
                                <span className="font-medium">
                                  {linea.stockMinimo}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Cantidad Sugerida:
                                </span>
                                <span className="font-medium text-primary dark:text-white">
                                  {linea.cantidadSugerida}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Precio Unitario:
                                </span>
                                <span className="font-medium">
                                  {formatearMoneda(linea.precioUnitario)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Subtotal:
                                </span>
                                <span className="font-bold">
                                  {formatearMoneda(
                                    linea.precioUnitario *
                                      linea.cantidadSugerida
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Fechas de auditoría */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Información de Auditoría
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Creado:
                      </span>
                      <span className="text-sm">
                        {formatearFecha(selectedRequisicion.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Actualizado:
                      </span>
                      <span className="text-sm">
                        {formatearFecha(selectedRequisicion.updatedAt)}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant={"destructive"}
                      onClick={() => {
                        setOpenConfirmDel(true);
                      }}
                    >
                      Eliminar registro
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={openConfirDel}
        onOpenChange={setOpenConfirmDel}
        title={"Eliminacion de registro de requisición"}
        description={
          "Se eliminará este registro de su base de datos permanentemente"
        }
        cancelLabel={"Cancelar"}
        confirmLabel={"Si, continuar"}
        onConfirm={() => {
          if (selectedRequisicion?.id !== undefined) {
            handleDeleteRequisicion(selectedRequisicion.id);
          }
        }}
        isLoading={isDeleting}
        icon={<TriangleAlert className="text-white" />}
        warning=""
        bgIcon="bg-rose-500"
      />

      <AdvancedDialog
        open={openReIngreso}
        onOpenChange={setOpenReIngreso}
        title="¿Generar requisición de productos?"
        description="Se crearán y registrarán los productos en stock."
        confirmButton={{
          label: "Sí, continuar y dar ingreso",
          disabled: submiting,
          loading: submiting,
          onClick: handleMakeReEnterRequisicion,
        }}
        cancelButton={{
          label: "Cancelar",
          onClick: () => setOpenReIngreso(false),
          disabled: submiting,
        }}
      />
    </div>
  );
};

export default RequisicionesMap;
